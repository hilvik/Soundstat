import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_KEY // Use service key for backend

export const supabase = createClient(supabaseUrl, supabaseKey)

export const supabaseService = {
  // Insert scrobbles
  async insertScrobbles(scrobbles) {
    const { data, error } = await supabase
      .from('scrobbles')
      .upsert(scrobbles, { onConflict: 'track_id,played_at' })
    
    if (error) throw error
    return data
  },

  // Get latest scrobble timestamp
  async getLatestScrobbleTime() {
    const { data, error } = await supabase
      .from('scrobbles')
      .select('played_at')
      .order('played_at', { ascending: false })
      .limit(1)
      .single()
    
    return data?.played_at || null
  },

  // Update daily stats
  async updateDailyStats(date, stats) {
    const { data, error } = await supabase
      .from('daily_stats')
      .upsert({
        date,
        ...stats
      })
    
    if (error) throw error
    return data
  },

  // Get artist by name
  async getOrCreateArtist(artistData) {
    // First try to find existing
    const { data: existing } = await supabase
      .from('artists')
      .select('*')
      .eq('name', artistData.name)
      .single()
    
    if (existing) return existing

    // Create new
    const { data, error } = await supabase
      .from('artists')
      .insert([artistData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Get or create album
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

  // Get or create track
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
  },

  // Get overview stats
  async getOverviewStats() {
    const { data: totalCounts } = await supabase.rpc('get_total_counts')
    const { data: recentStats } = await supabase
      .from('daily_stats')
      .select('*')
      .order('date', { ascending: false })
      .limit(7)
    
    return {
      totalCounts,
      recentStats
    }
  },

  // Get hourly stats
  async getHourlyStats() {
    const { data, error } = await supabase
      .from('hourly_stats')
      .select('*')
      .order('hour')
    
    if (error) throw error
    return data
  },

  // Update hourly stats
  async updateHourlyStats(hour, stats) {
    const { data, error } = await supabase
      .from('hourly_stats')
      .upsert({
        hour,
        ...stats
      })
    
    if (error) throw error
    return data
  },

  // Get top artists for period
  async getTopArtists(period, limit) {
    let dateFilter = new Date()
    
    switch(period) {
      case '7day':
        dateFilter.setDate(dateFilter.getDate() - 7)
        break
      case '1month':
        dateFilter.setMonth(dateFilter.getMonth() - 1)
        break
      case '3month':
        dateFilter.setMonth(dateFilter.getMonth() - 3)
        break
      case '6month':
        dateFilter.setMonth(dateFilter.getMonth() - 6)
        break
      case '12month':
        dateFilter.setFullYear(dateFilter.getFullYear() - 1)
        break
      default: // overall
        dateFilter = null
    }

    let query = supabase
      .from('scrobbles')
      .select(`
        tracks!inner(
          artists!inner(
            id,
            name,
            image_url,
            lastfm_url
          )
        )
      `)
    
    if (dateFilter) {
      query = query.gte('played_at', dateFilter.toISOString())
    }

    const { data: scrobbles, error } = await query
    
    if (error) throw error

    // Aggregate by artist
    const artistCounts = {}
    scrobbles.forEach(scrobble => {
      const artist = scrobble.tracks.artists
      if (!artistCounts[artist.id]) {
        artistCounts[artist.id] = {
          ...artist,
          playcount: 0
        }
      }
      artistCounts[artist.id].playcount++
    })

    // Sort and limit
    return Object.values(artistCounts)
      .sort((a, b) => b.playcount - a.playcount)
      .slice(0, limit)
  },

  // Get or create tag stats
  async updateTagStats(tags, date) {
    for (const tag of tags) {
      const { error } = await supabase
        .from('tag_stats')
        .upsert({
          tag_name: tag.name,
          date: date,
          play_count: tag.count,
          track_count: tag.tracks || 0,
          artist_count: tag.artists || 0
        })
      
      if (error) console.error('Error updating tag stats:', error)
    }
  }
}