import cron from 'node-cron'
import { lastfmService } from '../services/lastfm.service.js'
import { supabaseService } from '../services/supabase.service.js'
import { processScrobbles, calculateDailyStats } from '../services/aggregation.service.js'

export function startCronJobs() {
  // Sync new scrobbles every 30 minutes
  cron.schedule('*/30 * * * *', async () => {
    console.log('Running scheduled sync...')
    try {
      const latestTime = await supabaseService.getLatestScrobbleTime()
      const recentData = await lastfmService.getRecentTracks(
        latestTime ? new Date(latestTime) : null
      )
      await processScrobbles(recentData.recenttracks.track)
    } catch (error) {
      console.error('Scheduled sync failed:', error)
    }
  })

  // Calculate daily stats at midnight
  cron.schedule('0 0 * * *', async () => {
    console.log('Calculating daily stats...')
    try {
      await calculateDailyStats(new Date())
    } catch (error) {
      console.error('Daily stats calculation failed:', error)
    }
  })
}