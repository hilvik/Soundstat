import { lastfmService } from './lastfm.service.js'
import { supabase } from './supabase.service.js'
import pg from 'pg'
import dotenv from 'dotenv'
import { pipeline } from 'stream/promises'
import { Readable } from 'stream'
import QueryStream from 'pg-query-stream'
import { from as copyFrom } from 'pg-copy-streams'

dotenv.config()

export class UltraFastImportService {
  constructor() {
    // Direct PostgreSQL connection for maximum speed
    this.pool = new pg.Pool({
      connectionString: process.env.SUPABASE_DB_URL,
      max: 10,
      ssl: { rejectUnauthorized: false }
    })
  }

  // Remove the buildConnectionString() method completely

  async importAllData(onProgress) {
    console.log('Starting ULTRA FAST import...')
    const startTime = Date.now()
    const client = await this.pool.connect()
    
    try {
      await client.query('BEGIN')
      
      // Step 1: Fetch all data
      console.log('Step 1: Fetching all scrobbles (parallel)...')
      const allScrobbles = await this.fetchAllScrobblesParallel(onProgress)
      console.log(`Fetched ${allScrobbles.length} scrobbles`)
      
      // Step 2: Process in memory
      console.log('Step 2: Processing data in memory...')
      const processed = this.processDataInMemory(allScrobbles)
      
      // Step 3: Bulk insert using COPY
      console.log('Step 3: Bulk inserting with COPY command...')
      await this.bulkInsertArtists(client, processed.artists)
      await this.bulkInsertAlbums(client, processed.albums)
      await this.bulkInsertTracks(client, processed.tracks)
      await this.bulkInsertScrobbles(client, processed.scrobbles)
      
      await client.query('COMMIT')
      
      const endTime = Date.now()
      const duration = (endTime - startTime) / 1000 / 60
      
      console.log(`Import completed in ${duration.toFixed(2)} minutes`)
      return {
        success: true,
        totalScrobbles: allScrobbles.length,
        duration: duration,
        stats: {
          artists: processed.artists.length,
          albums: processed.albums.length,
          tracks: processed.tracks.length,
          scrobbles: processed.scrobbles.length
        }
      }
    } catch (error) {
      await client.query('ROLLBACK')
      console.error('Import failed:', error)
      throw error
    } finally {
      client.release()
    }
  }

  async fetchAllScrobblesParallel(onProgress) {
    // Get total pages first
    const firstPage = await lastfmService.makeRequest('user.getrecenttracks', {
      page: 1,
      limit: 1000
    })
    
    const totalPages = parseInt(firstPage.recenttracks['@attr'].totalPages)
    console.log(`Total pages: ${totalPages}`)
    
    // Fetch ALL pages in parallel (be careful with rate limits)
    const BATCH_SIZE = 10 // Process 10 pages at once
    const allScrobbles = []
    
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
        }).catch(err => {
          console.error(`Error on page ${page}:`, err.message)
          return null
        })
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
      
      // Small delay between batches
      if (i + BATCH_SIZE <= totalPages) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }
    
    return allScrobbles
  }

  processDataInMemory(scrobbles) {
    const artists = new Map()
    const albums = new Map()
    const tracks = new Map()
    const processedScrobbles = []
    
    // Process all data in memory
    scrobbles.forEach(scrobble => {
      const artistName = this.getArtistName(scrobble)
      if (!artistName) return
      
      // Artist
      if (!artists.has(artistName)) {
        artists.set(artistName, {
          id: artists.size + 1,
          name: artistName,
          mbid: scrobble.artist?.mbid || null,
          image_url: scrobble.image?.[3]?.['#text'] || null,
          lastfm_url: typeof scrobble.artist === 'object' ? scrobble.artist.url : null
        })
      }
      
      const artistId = artists.get(artistName).id
      
      // Album
      let albumId = null
      if (scrobble.album?.['#text']) {
        const albumKey = `${artistName}:::${scrobble.album['#text']}`
        if (!albums.has(albumKey)) {
          albums.set(albumKey, {
            id: albums.size + 1,
            name: scrobble.album['#text'],
            artist_id: artistId,
            mbid: scrobble.album.mbid || null,
            image_url: scrobble.image?.[3]?.['#text'] || null
          })
        }
        albumId = albums.get(albumKey).id
      }
      
      // Track
      const trackKey = `${artistName}:::${scrobble.name}`
      if (!tracks.has(trackKey)) {
        tracks.set(trackKey, {
          id: tracks.size + 1,
          name: scrobble.name,
          artist_id: artistId,
          album_id: albumId,
          mbid: scrobble.mbid || null,
          duration: parseInt(scrobble.duration) || null,
          lastfm_url: scrobble.url || null
        })
      }
      
      const trackId = tracks.get(trackKey).id
      
      // Scrobble
      processedScrobbles.push({
        track_id: trackId,
        played_at: new Date(scrobble.date.uts * 1000).toISOString(),
        device_source: null
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

  async bulkInsertArtists(client, artists) {
    console.log(`Bulk inserting ${artists.length} artists...`)
    
    const stream = client.query(copyFrom(`
      COPY artists (name, mbid, image_url, lastfm_url)
      FROM STDIN WITH (FORMAT csv, DELIMITER '|', NULL '\\N', QUOTE '"')
    `))
    
    for (const artist of artists) {
      stream.write([
        artist.name,
        artist.mbid || '\\N',
        artist.image_url || '\\N',
        artist.lastfm_url || '\\N'
      ].join('|') + '\n')
    }
    
    stream.end()
    await new Promise((resolve, reject) => {
      stream.on('finish', resolve)
      stream.on('error', reject)
    })
    
    console.log('Artists inserted!')
  }

  async bulkInsertAlbums(client, albums) {
    console.log(`Bulk inserting ${albums.length} albums...`)
    
    // First get the real artist IDs
    const artistMap = new Map()
    const result = await client.query('SELECT id, name FROM artists')
    result.rows.forEach(row => artistMap.set(row.name, row.id))
    
    const stream = client.query(copyFrom(`
      COPY albums (name, artist_id, mbid, image_url)
      FROM STDIN WITH (FORMAT csv, DELIMITER '|', NULL '\\N', QUOTE '"')
    `))
    
    for (const album of albums) {
      // Find the real artist ID
      const artist = Array.from(artistMap.entries()).find(([name, id]) => 
        album.artist_id === Array.from(artistMap.values()).indexOf(id) + 1
      )
      const realArtistId = artist ? artist[1] : album.artist_id
      
      stream.write([
        album.name,
        realArtistId,
        album.mbid || '\\N',
        album.image_url || '\\N'
      ].join('|') + '\n')
    }
    
    stream.end()
    await new Promise((resolve, reject) => {
      stream.on('finish', resolve)
      stream.on('error', reject)
    })
    
    console.log('Albums inserted!')
  }

  async bulkInsertTracks(client, tracks) {
    console.log(`Bulk inserting ${tracks.length} tracks...`)
    
    // Get real IDs
    const artistMap = new Map()
    const albumMap = new Map()
    
    const artists = await client.query('SELECT id, name FROM artists')
    artists.rows.forEach(row => artistMap.set(row.name, row.id))
    
    const albums = await client.query('SELECT id, name, artist_id FROM albums')
    albums.rows.forEach(row => albumMap.set(`${row.artist_id}:::${row.name}`, row.id))
    
    const stream = client.query(copyFrom(`
      COPY tracks (name, artist_id, album_id, mbid, duration, lastfm_url)
      FROM STDIN WITH (FORMAT csv, DELIMITER '|', NULL '\\N', QUOTE '"')
    `))
    
    const trackMap = new Map()
    let trackId = 1
    
    for (const track of tracks) {
      const realArtistId = Array.from(artistMap.values())[track.artist_id - 1]
      const realAlbumId = track.album_id ? Array.from(albumMap.values())[track.album_id - 1] : null
      
      stream.write([
        track.name,
        realArtistId,
        realAlbumId || '\\N',
        track.mbid || '\\N',
        track.duration || '\\N',
        track.lastfm_url || '\\N'
      ].join('|') + '\n')
      
      trackMap.set(`${track.artist_id}:::${track.name}`, trackId++)
    }
    
    stream.end()
    await new Promise((resolve, reject) => {
      stream.on('finish', resolve)
      stream.on('error', reject)
    })
    
    console.log('Tracks inserted!')
    return trackMap
  }

  async bulkInsertScrobbles(client, scrobbles) {
    console.log(`Bulk inserting ${scrobbles.length} scrobbles...`)
    
    // Get real track IDs
    const trackMap = new Map()
    const tracks = await client.query('SELECT id, name, artist_id FROM tracks')
    tracks.rows.forEach(row => trackMap.set(`${row.artist_id}:::${row.name}`, row.id))
    
    const stream = client.query(copyFrom(`
      COPY scrobbles (track_id, played_at, device_source)
      FROM STDIN WITH (FORMAT csv, DELIMITER '|', NULL '\\N', QUOTE '"')
    `))
    
    let inserted = 0
    for (const scrobble of scrobbles) {
      // Find real track ID based on the mapping
      const realTrackId = Array.from(trackMap.values())[scrobble.track_id - 1]
      if (realTrackId) {
        stream.write([
          realTrackId,
          scrobble.played_at,
          '\\N'
        ].join('|') + '\n')
        inserted++
      }
    }
    
    stream.end()
    await new Promise((resolve, reject) => {
      stream.on('finish', resolve)
      stream.on('error', reject)
    })
    
    console.log(`Scrobbles inserted: ${inserted}`)
  }

  async close() {
    await this.pool.end()
  }
}