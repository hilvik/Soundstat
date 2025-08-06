#!/usr/bin/env node
import dotenv from 'dotenv'
import { BatchImportService } from '../services/batch-import.service.js'

dotenv.config()

async function main() {
  console.log('=== Last.fm Batch Import Tool ===')
  console.log('This will import all your Last.fm data in an optimized way.')
  console.log('Press Ctrl+C to cancel at any time.\n')
  
  const importer = new BatchImportService()
  
  try {
    const result = await importer.importAllData(progress => {
      process.stdout.write(`\rProgress: ${progress.current}/${progress.total} pages (${progress.scrobbles} scrobbles)`)
    })
    
    console.log('\n\n✅ Import completed successfully!')
    console.log(`Total scrobbles imported: ${result.totalScrobbles}`)
    console.log(`Time taken: ${result.duration.toFixed(2)} minutes`)
  } catch (error) {
    console.error('\n\n❌ Import failed:', error.message)
    process.exit(1)
  }
}

main()