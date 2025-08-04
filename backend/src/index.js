import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { startCronJobs } from './jobs/sync.job.js'

// Routes
import lastfmRoutes from './routes/lastfm.js'
import statsRoutes from './routes/stats.js'
import syncRoutes from './routes/sync.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Your Vite frontend
  credentials: true
}))
app.use(express.json())

// Routes
app.use('/api/lastfm', lastfmRoutes)
app.use('/api/stats', statsRoutes)
app.use('/api/sync', syncRoutes)

// Start cron jobs
startCronJobs()

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`)
})