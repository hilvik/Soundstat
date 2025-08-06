#!/usr/bin/env node
import dotenv from 'dotenv'
import { supabase } from '../services/supabase.service.js'
import { BatchImportService } from '../services/batch-import.service.js'
import readline from 'readline'

dotenv.config()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.toLowerCase().trim())
    })
  })
}

async function resetDatabase() {
  console.log('🗑️  Clearing existing data...')
  
  // Delete in correct order due to foreign keys
  await supabase.from('scrobbles').delete().gte('id', 0)
  await supabase.from('tracks').delete().gte('id', 0)
  await supabase.from('albums').delete().gte('id', 0)
  await supabase.from('artists').delete().gte('id', 0)
  await supabase.from('daily_stats').delete().gte('date', '1900-01-01')
  await supabase.from('hourly_stats').delete().gte('hour', 0)
  await supabase.from('tag_stats').delete().gte('play_count', 0)
  
  console.log('✅ Database cleared')
}

async function main() {
  console.log('=== Last.fm Import Tool ===\n')
  
  const answer = await askQuestion('Do you want to clear existing data before import? (yes/no): ')
  
  if (answer === 'yes' || answer === 'y') {
    await resetDatabase()
  }
  
  rl.close()
  
  console.log('\nStarting import...\n')
  
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