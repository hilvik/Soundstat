import { lastfmService } from './lastfm.service.js'
import { supabase } from './supabase.service.js'

export class BatchImportService {
  constructor() {
    this.artistCache = new Map()
    this.albumCache = new Map()
    this.trackCache = new Map()
    this.batchSize = 500 // Reduced for better reliability
    this.existingArtists = new Map()
    this.existingAlbums = new Map()
    this.existingTracks = new Map()
  }

  async importAllData(onProgress) {
    console.log('Starting optimized batch import...')
    const startTime = Date.now()
    
    try {
      // Load existing data into cache
      await this.loadExistingData()
      
      // Step 1: Fetch all scrobbles from Last.fm
      console.log('Step 1: Fetching all scrobbles from Last.fm...')
      const allScrobbles = await this.fetchAllScrobbles(onProgress)
      console.log(`Fetched ${allScrobbles.length} scrobbles`)
      
      // Step 2: Extract unique artists, albums, and tracks
      console.log('Step 2: Processing unique items...')
      const { artists, albums, tracks } = await this.extractUniqueItems(allScrobbles)
      
      // Step 3: Insert or get artists
      console.log('Step 3: Processing artists...')
      await this.processArtists(artists)
      
      // Step 4: Insert or get albums
      console.log('Step 4: Processing albums...')
      await this.processAlbums(albums)
      
      // Step 5: Insert or get tracks
      console.log('Step 5: Processing tracks...')
      await this.processTracks(tracks)
      
      // Step 6: Insert scrobbles
      console.log('Step 6: Processing scrobbles...')
      await this.processScrobbles(allScrobbles)
      
      const endTime = Date.now()
      const duration = (endTime - startTime) / 1000 / 60 // minutes
      
      console.log(`Import completed in ${duration.toFixed(2)} minutes`)
      return {
        success: true,
        totalScrobbles: allScrobbles.length,
        duration: duration
      }
    } catch (error) {
      console.error('Import failed:', error)
      throw error
    }
  }

  async loadExistingData() {
    console.log('Loading existing data...')
    
    // Load existing artists
    const { data: artists } = await supabase
      .from('artists')
      .select('id, name')
    
    artists?.forEach(artist => {
      this.existingArtists.set(artist.name, artist.id)
      this.artistCache.set(artist.name, artist.id)
    })
    
    console.log(`Loaded ${this.existingArtists.size} existing artists`)
  }

  async fetchAllScrobbles(onProgress) {
    const allScrobbles = []
    let page = 1
    let totalPages = 1
    
    // First, get total pages with extended info
    const firstPage = await lastfmService.makeRequest('user.getrecenttracks', {
      page: 1,
      limit: 1000,
      extended: 1 // Get extended info including loved tracks
    })
    
    totalPages = parseInt(firstPage.recenttracks['@attr'].totalPages)
    const totalTracks = parseInt(firstPage.recenttracks['@attr'].total)
    console.log(`Total pages: ${totalPages}, Total tracks: ${totalTracks}`)
    
    // Add first page tracks
    const firstPageTracks = Array.isArray(firstPage.recenttracks.track) 
      ? firstPage.recenttracks.track 
      : [firstPage.recenttracks.track]
    
    allScrobbles.push(...firstPageTracks.filter(t => t.date))
    
    // Fetch remaining pages in parallel batches
    const PARALLEL_REQUESTS = 3 // Reduced for stability
    page = 2 // Start from page 2
    
    while (page <= totalPages) {
      const pagesToFetch = []
      for (let i = 0; i < PARALLEL_REQUESTS && page <= totalPages; i++) {
        pagesToFetch.push(page++)
      }
      
      const promises = pagesToFetch.map(p => 
        lastfmService.makeRequest('user.getrecenttracks', {
          page: p,
          limit: 1000,
          extended: 1
        }).catch(err => {
          console.error(`Error fetching page ${p}:`, err.message)
          return null
        })
      )
      
      const results = await Promise.all(promises)
      
      results.forEach(data => {
        if (!data) return
        
        const tracks = Array.isArray(data.recenttracks.track)
          ? data.recenttracks.track
          : [data.recenttracks.track]
        
        const validTracks = tracks.filter(t => t && t.date)
        allScrobbles.push(...validTracks)
      })
      
      if (onProgress) {
        onProgress({
          current: Math.min(page - 1, totalPages),
          total: totalPages,
          scrobbles: allScrobbles.length
        })
      }
      
      console.log(`Progress: ${Math.min(page - 1, totalPages)}/${totalPages} pages (${allScrobbles.length} scrobbles)`)
      
      // Rate limit delay
      await new Promise(resolve => setTimeout(resolve, 200))
    }
    
    // Sort by date (oldest first) for chronological insertion
    allScrobbles.sort((a, b) => a.date.uts - b.date.uts)
    
    return allScrobbles
  }

  async extractUniqueItems(scrobbles) {
    const artists = new Map()
    const albums = new Map()
    const tracks = new Map()
    
    scrobbles.forEach(scrobble => {
      // Extract artist
      const artistName = scrobble.artist['#text'] || scrobble.artist.name || scrobble.artist
      if (!artistName) return
      
      if (!artists.has(artistName) && !this.existingArtists.has(artistName)) {
        artists.set(artistName, {
          name: artistName,
          mbid: scrobble.artist.mbid || null,
          image_url: scrobble.image?.[3]?.['#text'] || null,
          lastfm_url: scrobble.artist.url || null
        })
      }
      
      // Extract album if exists
      if (scrobble.album?.['#text']) {
        const albumKey = `${artistName}:::${scrobble.album['#text']}`
        if (!albums.has(albumKey)) {
          albums.set(albumKey, {
            name: scrobble.album['#text'],
            artist_name: artistName,
            mbid: scrobble.album.mbid || null,
            image_url: scrobble.image?.[3]?.['#text'] || null
          })
        }
      }
      
      // Extract track
      const trackKey = `${artistName}:::${scrobble.name}`
      if (!tracks.has(trackKey)) {
        tracks.set(trackKey, {
          name: scrobble.name,
          artist_name: artistName,
          album_name: scrobble.album?.['#text'] || null,
          mbid: scrobble.mbid || null,
          duration: parseInt(scrobble.duration) || null,
          lastfm_url: scrobble.url || null
        })
      }
    })
    
    return {
      artists: Array.from(artists.values()),
      albums: Array.from(albums.values()),
      tracks: Array.from(tracks.values())
    }
  }

  async processArtists(artists) {
    if (artists.length === 0) {
      console.log('No new artists to insert')
      return
    }
    
    // Insert in batches
    for (let i = 0; i < artists.length; i += this.batchSize) {
      const batch = artists.slice(i, i + this.batchSize)
      
      try {
        const { data, error } = await supabase
          .from('artists')
          .insert(batch)
          .select()
          .onConflict('name')
        
        if (error && error.code !== '23505') { // Ignore unique constraint violations
          console.error('Error inserting artists:', error)
          throw error
        }
        
        // Cache the results
        if (data) {
          data.forEach(artist => {
            this.artistCache.set(artist.name, artist.id)
          })
        }
      } catch (err) {
        console.error('Batch error:', err)
        // Try inserting one by one for this batch
        for (const artist of batch) {
          try {
            const { data: existing } = await supabase
              .from('artists')
              .select('id')
              .eq('name', artist.name)
              .single()
            
            if (existing) {
              this.artistCache.set(artist.name, existing.id)
            } else {
              const { data: newArtist } = await supabase
                .from('artists')
                .insert(artist)
                .select()
                .single()
              
              if (newArtist) {
                this.artistCache.set(artist.name, newArtist.id)
              }
            }
          } catch (e) {
            console.error(`Failed to process artist ${artist.name}:`, e.message)
          }
        }
      }
      
      console.log(`Processed artists: ${Math.min(i + batch.length, artists.length)}/${artists.length}`)
    }
  }

  async processAlbums(albums) {
    if (albums.length === 0) {
      console.log('No albums to process')
      return
    }
    
    // Get artist IDs and filter valid albums
    const albumsWithArtistIds = albums
      .map(album => ({
        ...album,
        artist_id: this.artistCache.get(album.artist_name)
      }))
      .filter(album => album.artist_id)
    
    // Insert in batches
    for (let i = 0; i < albumsWithArtistIds.length; i += this.batchSize) {
      const batch = albumsWithArtistIds.slice(i, i + this.batchSize)
      
      try {
        const { data } = await supabase
          .from('albums')
          .upsert(batch, { 
            onConflict: 'name,artist_id',
            ignoreDuplicates: true 
          })
          .select()
        
        // Cache the results
        if (data) {
          data.forEach(album => {
            const key = `${album.artist_id}:::${album.name}`
            this.albumCache.set(key, album.id)
          })
        }
      } catch (err) {
        console.error('Album batch error:', err)
      }
      
      console.log(`Processed albums: ${Math.min(i + batch.length, albumsWithArtistIds.length)}/${albumsWithArtistIds.length}`)
    }
  }

  async processTracks(tracks) {
    if (tracks.length === 0) {
      console.log('No tracks to process')
      return
    }
    
    // Map tracks with IDs
    const tracksWithIds = tracks
      .map(track => {
        const artistId = this.artistCache.get(track.artist_name)
        const albumId = track.album_name 
          ? this.albumCache.get(`${artistId}:::${track.album_name}`)
          : null
        
        return {
          ...track,
          artist_id: artistId,
          album_id: albumId
        }
      })
      .filter(track => track.artist_id)
    
    // Insert in batches
    for (let i = 0; i < tracksWithIds.length; i += this.batchSize) {
      const batch = tracksWithIds.slice(i, i + this.batchSize)
      
      try {
        const { data } = await supabase
          .from('tracks')
          .upsert(batch, { 
            onConflict: 'name,artist_id',
            ignoreDuplicates: true 
          })
          .select()
        
        // Cache the results
        if (data) {
          data.forEach(track => {
            const key = `${track.artist_id}:::${track.name}`
            this.trackCache.set(key, track.id)
          })
        }
      } catch (err) {
        console.error('Track batch error:', err)
      }
      
      console.log(`Processed tracks: ${Math.min(i + batch.length, tracksWithIds.length)}/${tracksWithIds.length}`)
    }
  }

  async processScrobbles(scrobbles) {
    // Map scrobbles to track IDs
    const scrobblesWithTrackIds = []
    
    for (const scrobble of scrobbles) {
      const artistName = scrobble.artist['#text'] || scrobble.artist.name || scrobble.artist
      const artistId = this.artistCache.get(artistName)
      
      if (!artistId) continue
      
      const trackId = this.trackCache.get(`${artistId}:::${scrobble.name}`)
      
      if (trackId) {
        scrobblesWithTrackIds.push({
          track_id: trackId,
          played_at: new Date(scrobble.date.uts * 1000).toISOString(),
          device_source: null
        })
      }
    }
    
    console.log(`Mapped ${scrobblesWithTrackIds.length} scrobbles to tracks`)
    
    // Insert in batches
    let inserted = 0
    for (let i = 0; i < scrobblesWithTrackIds.length; i += this.batchSize) {
      const batch = scrobblesWithTrackIds.slice(i, i + this.batchSize)
      
      try {
        await supabase
          .from('scrobbles')
          .upsert(batch, { 
            onConflict: 'track_id,played_at',
            ignoreDuplicates: true 
          })
        
        inserted += batch.length
      } catch (err) {
        console.error('Scrobble batch error:', err)
      }
      
      console.log(`Processed scrobbles: ${Math.min(i + batch.length, scrobblesWithTrackIds.length)}/${scrobblesWithTrackIds.length}`)
    }
    
    console.log(`Successfully inserted ${inserted} scrobbles`)
  }
}