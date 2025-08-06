import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

async function testConnection() {
  console.log('Testing database connections...\n')
  
  // Method 1: Using connection string
  try {
    console.log('Method 1: Connection string from .env')
    const pool1 = new pg.Pool({
      connectionString: process.env.SUPABASE_DB_URL,
      ssl: { rejectUnauthorized: false }
    })
    
    const result = await pool1.query('SELECT NOW()')
    console.log('✅ Success! Connected at:', result.rows[0].now)
    await pool1.end()
  } catch (error) {
    console.log('❌ Failed:', error.message)
  }
  
  // Method 2: Using Supabase URL parsing
  try {
    console.log('\nMethod 2: Parsing Supabase URL')
    const url = new URL(process.env.SUPABASE_URL)
    const projectRef = url.hostname.split('.')[0]
    
    const pool2 = new pg.Pool({
      host: `db.${projectRef}.supabase.co`,
      database: 'postgres',
      user: 'postgres',
      password: process.env.SUPABASE_SERVICE_KEY,
      port: 5432,
      ssl: { rejectUnauthorized: false }
    })
    
    const result = await pool2.query('SELECT NOW()')
    console.log('✅ Success! Connected at:', result.rows[0].now)
    await pool2.end()
  } catch (error) {
    console.log('❌ Failed:', error.message)
  }
  
  // Method 3: Manual connection
  try {
    console.log('\nMethod 3: Manual connection')
    // Extract project ref from your Supabase URL
    const projectRef = 'hkhpulldwqkhccmkuw' // from your screenshot
    
    const pool3 = new pg.Pool({
      host: `db.${projectRef}.supabase.co`,
      database: 'postgres',
      user: 'postgres',
      password: process.env.SUPABASE_SERVICE_KEY, // Try using service key
      port: 5432,
      ssl: { rejectUnauthorized: false }
    })
    
    const result = await pool3.query('SELECT NOW()')
    console.log('✅ Success! Connected at:', result.rows[0].now)
    await pool3.end()
  } catch (error) {
    console.log('❌ Failed:', error.message)
  }
}

testConnection()