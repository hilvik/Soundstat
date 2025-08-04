import { supabaseService, supabase } from './supabase.service.js'

export async function processScrobbles(scrobbles) {
  const processed = []
  
  for (const scrobble of scrobbles) {
    // Skip currently playing
    if (scrobble['@attr']?.nowplaying === 'true') continue
    
    try {
      // Get or create artist
      const artist = await supabaseService.getOrCreateArtist({
        name: scrobble.artist['#text'] || scrobble.artist.name,
        mbid: scrobble.artist.mbid || null,
        image_url: scrobble.image?.[3]?.['#text'] || null,
        lastfm_url: scrobble.url
      })
      
      // Get or create album if exists
      let album = null
      if (scrobble.album?.['#text']) {
        album = await supabaseService.getOrCreateAlbum({
          name: scrobble.album['#text'],
          artist_id: artist.id,
          mbid: scrobble.album.mbid || null,
          image_url: scrobble.image?.[3]?.['#text'] || null
        })
      }
      
      // Get or create track
      const track = await supabaseService.getOrCreateTrack({
        name: scrobble.name,
        artist_id: artist.id,
        album_id: album?.id || null,
        mbid: scrobble.mbid || null,
        duration: scrobble.duration || null,
        lastfm_url: scrobble.url
      })
      
      // Create scrobble entry
      const scrobbleData = {
        track_id: track.id,
        played_at: new Date(scrobble.date.uts * 1000).toISOString(),
        device_source: null // Last.fm doesn't provide this
      }
      
      processed.push(scrobbleData)
    } catch (error) {
      console.error('Error processing scrobble:', error, scrobble)
    }
  }
  
  // Batch insert scrobbles
  if (processed.length > 0) {
    await supabaseService.insertScrobbles(processed)
  }
  
  return processed
}

export async function calculateDailyStats(date) {
  const startDate = new Date(date)
  startDate.setHours(0, 0, 0, 0)
  const endDate = new Date(date)
  endDate.setHours(23, 59, 59, 999)
  
  // Get all scrobbles for the day
  const { data: dayScrobbles, error } = await supabase
    .from('scrobbles')
    .select(`
      id,
      played_at,
      track:tracks(
        id,
        name,
        artist:artists(id, name),
        album:albums(id, name)
      )
    `)
    .gte('played_at', startDate.toISOString())
    .lte('played_at', endDate.toISOString())
  
  if (error) throw error
  
  // Calculate stats
  const stats = {
    date: startDate.toISOString().split('T')[0],
    total_scrobbles: dayScrobbles.length,
    unique_tracks: new Set(dayScrobbles.map(s => s.track.id)).size,
    unique_artists: new Set(dayScrobbles.map(s => s.track.artist.id)).size,
    unique_albums: new Set(dayScrobbles.filter(s => s.track.album).map(s => s.track.album.id)).size,
    listening_time_minutes: Math.round(dayScrobbles.length * 3.5), // Estimate
    new_discoveries: 0 // TODO: Calculate new tracks
  }
  
  await supabaseService.updateDailyStats(stats.date, stats)
  
  // Update hourly stats
  await calculateHourlyStats(dayScrobbles)
  
  return stats
}

export async function calculateHourlyStats(scrobbles) {
  const hourlyData = {}
  
  // Initialize all hours
  for (let hour = 0; hour < 24; hour++) {
    hourlyData[hour] = 0
  }
  
  // Count scrobbles per hour
  scrobbles.forEach(scrobble => {
    const hour = new Date(scrobble.played_at).getHours()
    hourlyData[hour]++
  })
  
  // Update in database
  for (const [hour, count] of Object.entries(hourlyData)) {
    const { error } = await supabase
      .from('hourly_stats')
      .upsert({
        hour: parseInt(hour),
        total_scrobbles: count,
        avg_scrobbles: count // TODO: Calculate rolling average
      })
    
    if (error) console.error('Error updating hourly stats:', error)
  }
}

// Add these methods to supabaseService.js
export const additionalSupabaseMethods = {
  async getOrCreateAlbum(albumData) {
    const { data: existing } = await supabase
      .from('albums')
      .select('*')
      .eq('name', albumData.name)
      .eq('artist_id', albumData.artist_id)
      .single()
    
    if (existing) return existing

    const { data, error } = await supabase
      .from('albums')
      .insert([albumData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getOrCreateTrack(trackData) {
    const { data: existing } = await supabase
      .from('tracks')
      .select('*')
      .eq('name', trackData.name)
      .eq('artist_id', trackData.artist_id)
      .single()
    
    if (existing) return existing

    const { data, error } = await supabase
      .from('tracks')
      .insert([trackData])
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}