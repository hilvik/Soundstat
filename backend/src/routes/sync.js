import express from 'express'
import { lastfmService } from '../services/lastfm.service.js'
import { supabaseService } from '../services/supabase.service.js'
import { processScrobbles } from '../services/aggregation.service.js'
import { BatchImportService } from '../services/batch-import.service.js'

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

// Optimized full import
router.post('/import-all-optimized', async (req, res) => {
  try {
    const batchImporter = new BatchImportService()
    
    // Return immediately and run in background
    res.json({ 
      message: 'Optimized import started. Check logs for progress.',
      note: 'This uses batch processing and should be much faster!'
    })
    
    // Run import in background
    batchImporter.importAllData(progress => {
      console.log(`Import progress: ${progress.current}/${progress.total} pages (${progress.scrobbles} scrobbles)`)
    }).then(result => {
      console.log('Import completed successfully:', result)
    }).catch(error => {
      console.error('Import failed:', error)
    })
    
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Full historical import (old method - kept for compatibility)
router.post('/import-all', async (req, res) => {
  try {
    // This is a long operation - in production, use a job queue
    res.json({ 
      message: 'Import started. Check logs for progress.',
      note: 'This will take several minutes for large libraries. Use /import-all-optimized for faster import.'
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

// Get import status
router.get('/status', async (req, res) => {
  try {
    const { count: totalScrobbles } = await supabaseService.supabase
      .from('scrobbles')
      .select('*', { count: 'exact', head: true })
    
    const latestScrobble = await supabaseService.getLatestScrobbleTime()
    
    res.json({
      totalScrobbles: totalScrobbles || 0,
      latestScrobble: latestScrobble,
      status: 'ready'
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router