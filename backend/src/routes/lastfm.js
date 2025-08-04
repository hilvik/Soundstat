import express from 'express'
import { lastfmService } from '../services/lastfm.service.js'

const router = express.Router()

// Get user info directly from Last.fm
router.get('/user', async (req, res) => {
  try {
    const data = await lastfmService.getUserInfo()
    res.json(data.user)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get recent tracks from Last.fm
router.get('/recent', async (req, res) => {
  try {
    const { limit = 50 } = req.query
    const data = await lastfmService.getRecentTracks(null, limit)
    res.json(data.recenttracks)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get top artists from Last.fm (for comparison)
router.get('/top/artists', async (req, res) => {
  try {
    const { period = 'overall', limit = 50 } = req.query
    const data = await lastfmService.getTopArtists(period, limit)
    res.json(data.topartists)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router