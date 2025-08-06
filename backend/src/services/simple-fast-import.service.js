import { lastfmService } from './lastfm.service.js'
import { supabase } from './supabase.service.js'

export class SimpleFastImportService {
  constructor() {
    this.batchSize = 1000
  }

  async importAllData(onProgress) {
    console.log('Starting simplified fast import...')
    const startTime = Date.now()
    
    try {
      // Step 1: Fetch all data in parallel
      console.log('Step 1: Fetching all scrobbles...')
      const allScrobbles = await this.fetchAllScrobblesParallel(onProgress)
      console.log(`Fetched ${allScrobbles.length} scrobbles`)
      
      // Step 2: Process and prepare bulk data
      console.log('Step 2: Processing data...')
      const { artists, albums, tracks, scrobbles } = this.processData(allScrobbles)
      
      // Step 3: Bulk insert using Supabase
      console.log('Step 3: Bulk inserting...')
      
      // Insert artists
      console.log(`Inserting ${artists.length} artists...`)
      for (let i = 0; i < artists.length; i += this.batchSize) {
        const batch = artists.slice(i, i + this.batchSize)
        await supabase.from('artists').insert(batch)
        console.log(`Artists: ${Math.min(i + this.batchSize, artists.length)}/${artists.length}`)
      }
      
      // Get artist ID mapping
      const { data: dbArtists } = await supabase.from('artists').select('id, name')
      const artistMap = new Map(dbArtists.map(a => [a.name, a.id]))
      
      // Update album artist IDs and insert
      console.log(`Inserting ${albums.length} albums...`)
      const albumsWithIds = albums.map(a => ({
        ...a,
        artist_id: artistMap.get(a.artist_name)
      })).filter(a => a.artist_id)
      
      for (let i = 0; i < albumsWithIds.length; i += this.batchSize) {
        const batch = albumsWithIds.slice(i, i + this.batchSize)
        await supabase.from('albums').insert(batch)
        console.log(`Albums: ${Math.min(i + this.batchSize, albumsWithIds.length)}/${albumsWithIds.length}`)
      }
      
      // Get album ID mapping
      const { data: dbAlbums } = await supabase.from('albums').select('id, name, artist_id')
      const albumMap = new Map(dbAlbums.map(a => [`${a.artist_id}:::${a.name}`, a.id]))
      
      // Update track IDs and insert
      console.log(`Inserting ${tracks.length} tracks...`)
      const tracksWithIds = tracks.map(t => ({
        name: t.name,
        artist_id: artistMap.get(t.artist_name),
        album_id: t.album_name ? albumMap.get(`${artistMap.get(t.artist_name)}:::${t.album_name}`) : null,
        mbid: t.mbid,
        duration: t.duration,
        lastfm_url: t.lastfm_url
      })).filter(t => t.artist_id)
      
      for (let i = 0; i < tracksWithIds.length; i += this.batchSize) {
        const batch = tracksWithIds.slice(i, i + this.batchSize)
        await supabase.from('tracks').insert(batch)
        console.log(`Tracks: ${Math.min(i + this.batchSize, tracksWithIds.length)}/${tracksWithIds.length}`)
      }
      
      // Get track ID mapping
      const { data: dbTracks } = await supabase.from('tracks').select('id, name, artist_id')
      const trackMap = new Map(dbTracks.map(t => [`${t.artist_id}:::${t.name}`, t.id]))
      
      // Insert scrobbles
      console.log(`Inserting ${scrobbles.length} scrobbles...`)
      const scrobblesWithIds = scrobbles.map(s => ({
        track_id: trackMap.get(`${artistMap.get(s.artist_name)}:::${s.track_name}`),
        played_at: s.played_at,
        device_source: null
      })).filter(s => s.track_id)
      
      for (let i = 0; i < scrobblesWithIds.length; i += this.batchSize) {
        const batch = scrobblesWithIds.slice(i, i + this.batchSize)
        await supabase.from('scrobbles').insert(batch)
        console.log(`Scrobbles: ${Math.min(i + this.batchSize, scrobblesWithIds.length)}/${scrobblesWithIds.length}`)
      }
      
      const endTime = Date.now()
      const duration = (endTime - startTime) / 1000 / 60
      
      console.log(`Import completed in ${duration.toFixed(2)} minutes`)
      return {
        success: true,
        totalScrobbles: scrobblesWithIds.length,
        duration
      }
    } catch (error) {
      console.error('Import failed:', error)
      throw error
    }
  }

  async fetchAllScrobblesParallel(onProgress) {
    // Get total pages
    const firstPage = await lastfmService.makeRequest('user.getrecenttracks', {
      page: 1,
      limit: 1000
    })
    
    const totalPages = parseInt(firstPage.recenttracks['@attr'].totalPages)
    console.log(`Total pages: ${totalPages}`)
    
    const allScrobbles = []
    const BATCH_SIZE = 10
    
    for (let i = 1; i <= totalPages; i += BATCH_SIZE) {
      const pageNumbers = []
      for (let j = i; j < i + BATCH_SIZE && j <= totalPages; j++) {
        pageNumbers.push(j)
      }
      
      const promises = pageNumbers.map(page => 
        lastfmService.makeRequest('user.getrecenttracks', {
          page,
          limit: 1000,
          extended: 1
        }).catch(err => null)
      )
      
      const results = await Promise.all(promises)
      
      results.forEach(data => {
        if (!data) return
        const tracks = Array.isArray(data.recenttracks.track)
          ? data.recenttracks.track
          : [data.recenttracks.track]
        allScrobbles.push(...tracks.filter(t => t && t.date))
      })
      
      if (onProgress) {
        onProgress({
          current: Math.min(i + BATCH_SIZE - 1, totalPages),
          total: totalPages,
          scrobbles: allScrobbles.length
        })
      }
      
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    return allScrobbles
  }

  processData(scrobbles) {
    const artists = new Map()
    const albums = new Map()
    const tracks = new Map()
    const processedScrobbles = []
    
    scrobbles.forEach(scrobble => {
      const artistName = this.getArtistName(scrobble)
      if (!artistName) return
      
      // Artist
      if (!artists.has(artistName)) {
        artists.set(artistName, {
          name: artistName,
          mbid: scrobble.artist?.mbid || null,
          image_url: scrobble.image?.[3]?.['#text'] || null,
          lastfm_url: typeof scrobble.artist === 'object' ? scrobble.artist.url : null
        })
      }
      
      // Album
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
      
      // Track
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
      
      // Scrobble
      processedScrobbles.push({
        artist_name: artistName,
        track_name: scrobble.name,
        played_at: new Date(scrobble.date.uts * 1000).toISOString()
      })
    })
    
    return {
      artists: Array.from(artists.values()),
      albums: Array.from(albums.values()),
      tracks: Array.from(tracks.values()),
      scrobbles: processedScrobbles
    }
  }

  getArtistName(scrobble) {
    if (typeof scrobble.artist === 'string') return scrobble.artist
    if (scrobble.artist?.['#text']) return scrobble.artist['#text']
    if (scrobble.artist?.name) return scrobble.artist.name
    return null
  }
}