import express from 'express'
import { lastfmService } from '../services/lastfm.service.js'
import { supabaseService } from '../services/supabase.service.js'
import { processScrobbles } from '../services/aggregation.service.js'

const router = express.Router()

// Manual sync endpoint
router.post('/manual', async (req, res) => {
  try {
    console.log('Starting manual sync...')
    
    // Get latest scrobble time from DB
    const latestTime = await supabaseService.getLatestScrobbleTime()
    
    // Fetch new scrobbles
    const recentData = await lastfmService.getRecentTracks(
      latestTime ? new Date(latestTime) : null
    )
    
    // Process and save
    const processed = await processScrobbles(recentData.recenttracks.track)
    
    res.json({
      success: true,
      newScrobbles: processed.length,
      latestScrobble: processed[0]
    })
  } catch (error) {
    console.error('Sync error:', error)
    res.status(500).json({ error: error.message })
  }
})

// Full historical import
router.post('/import-all', async (req, res) => {
  try {
    // This is a long operation - in production, use a job queue
    res.json({ 
      message: 'Import started. Check logs for progress.',
      note: 'This will take several minutes for large libraries'
    })
    
    // Import in background
    lastfmService.getAllScrobbles(progress => {
      console.log(`Import progress: ${progress.current}/${progress.total} pages`)
    }).then(async allScrobbles => {
      console.log(`Processing ${allScrobbles.length} total scrobbles...`)
      await processScrobbles(allScrobbles)
      console.log('Import complete!')
    }).catch(error => {
      console.error('Import failed:', error)
    })
    
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router