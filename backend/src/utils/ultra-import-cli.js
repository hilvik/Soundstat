#!/usr/bin/env node
import dotenv from 'dotenv'
import { UltraFastImportService } from '../services/ultra-fast-import.service.js'

dotenv.config()

async function main() {
  console.log('=== ULTRA FAST Last.fm Import ===')
  console.log('This uses PostgreSQL COPY for maximum speed!\n')
  
  const importer = new UltraFastImportService()
  
  try {
    const result = await importer.importAllData(progress => {
      process.stdout.write(`\rProgress: ${progress.current}/${progress.total} pages (${progress.scrobbles} scrobbles)`)
    })
    
    console.log('\n\n✅ Import completed!')
    console.log(`Total scrobbles: ${result.totalScrobbles}`)
    console.log(`Artists: ${result.stats.artists}`)
    console.log(`Albums: ${result.stats.albums}`)
    console.log(`Tracks: ${result.stats.tracks}`)
    console.log(`Time: ${result.duration.toFixed(2)} minutes`)
    console.log(`Speed: ${Math.round(result.totalScrobbles / result.duration / 60)} scrobbles/second`)
  } catch (error) {
    console.error('\n\n❌ Import failed:', error.message)
    process.exit(1)
  } finally {
    await importer.close()
  }
}

main()