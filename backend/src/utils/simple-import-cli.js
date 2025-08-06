#!/usr/bin/env node
import dotenv from 'dotenv'
import { SimpleFastImportService } from '../services/simple-fast-import.service.js'

dotenv.config()

async function main() {
  console.log('=== Simplified Fast Import ===')
  console.log('Using Supabase client for reliability\n')
  
  const importer = new SimpleFastImportService()
  
  try {
    const result = await importer.importAllData(progress => {
      process.stdout.write(`\rProgress: ${progress.current}/${progress.total} pages (${progress.scrobbles} scrobbles)`)
    })
    
    console.log('\n\n✅ Import completed!')
    console.log(`Total scrobbles: ${result.totalScrobbles}`)
    console.log(`Time: ${result.duration.toFixed(2)} minutes`)
  } catch (error) {
    console.error('\n\n❌ Import failed:', error.message)
    process.exit(1)
  }
}

main()