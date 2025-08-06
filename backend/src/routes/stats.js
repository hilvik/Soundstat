import express from 'express'
import { supabaseService } from '../services/supabase.service.js'

const router = express.Router()

// Get overview stats
router.get('/overview', async (req, res) => {
  try {
    const stats = await supabaseService.getOverviewStats()
    res.json(stats)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get daily stats for a specific date
router.get('/daily/:date', async (req, res) => {
  try {
    const { date } = req.params
    const { data, error } = await supabaseService.supabase
      .from('daily_stats')
      .select('*')
      .eq('date', date)
      .single()
    
    if (error) throw error
    res.json(data || {})
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get listening patterns
router.get('/patterns', async (req, res) => {
  try {
    const hourlyStats = await supabaseService.getHourlyStats()
    res.json({ hourly: hourlyStats })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get top artists
router.get('/top/artists', async (req, res) => {
  try {
    const { period = 'overall', limit = 50 } = req.query
    const artists = await supabaseService.getTopArtists(period, parseInt(limit))
    res.json({ artists })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get top tracks
router.get('/top/tracks', async (req, res) => {
  try {
    const { period = 'overall', limit = 50 } = req.query
    
    // For now, we'll return data from Last.fm API since we haven't implemented track aggregation
    res.json({ 
      message: 'Track aggregation not yet implemented. Use Last.fm API directly.',
      tracks: []
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get top albums
router.get('/top/albums', async (req, res) => {
  try {
    const { period = 'overall', limit = 50 } = req.query
    
    // For now, we'll return data from Last.fm API since we haven't implemented album aggregation
    res.json({ 
      message: 'Album aggregation not yet implemented. Use Last.fm API directly.',
      albums: []
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get trends for a period
router.get('/trends/:period', async (req, res) => {
  try {
    const { period } = req.params
    const days = period === '7day' ? 7 : period === '1month' ? 30 : 90
    
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    
    const { data, error } = await supabaseService.supabase
      .from('daily_stats')
      .select('*')
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0])
      .order('date', { ascending: true })
    
    if (error) throw error
    res.json(data || [])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get genre distribution
router.get('/genres', async (req, res) => {
  try {
    const { data, error } = await supabaseService.supabase
      .from('tag_stats')
      .select('*')
      .order('play_count', { ascending: false })
      .limit(20)
    
    if (error) throw error
    
    const genres = (data || []).map(tag => ({
      genre: tag.tag_name,
      count: tag.play_count,
      percentage: 0 // Would need to calculate based on total
    }))
    
    res.json(genres)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router