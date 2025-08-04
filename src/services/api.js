const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

export const api = {
  // Sync endpoints
  syncNow: async () => {
    const response = await fetch(`${API_URL}/sync/manual`, { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
    return response.json()
  },
  
  importAll: async () => {
    const response = await fetch(`${API_URL}/sync/import-all`, { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
    return response.json()
  },
  
  // Stats endpoints
  getOverviewStats: async () => {
    const response = await fetch(`${API_URL}/stats/overview`)
    return response.json()
  },
  
  getDailyStats: async (date) => {
    const response = await fetch(`${API_URL}/stats/daily/${date}`)
    return response.json()
  },
  
  getListeningPatterns: async () => {
    const response = await fetch(`${API_URL}/stats/patterns`)
    return response.json()
  },
  
  // Top items
  getTopArtists: async (period = 'overall', limit = 50) => {
    const response = await fetch(`${API_URL}/stats/top/artists?period=${period}&limit=${limit}`)
    return response.json()
  },
  
  getTopTracks: async (period = 'overall', limit = 50) => {
    const response = await fetch(`${API_URL}/stats/top/tracks?period=${period}&limit=${limit}`)
    return response.json()
  },
  
  getTopAlbums: async (period = 'overall', limit = 50) => {
    const response = await fetch(`${API_URL}/stats/top/albums?period=${period}&limit=${limit}`)
    return response.json()
  },
  
  // Trends
  getTrends: async (period = '7day') => {
    const response = await fetch(`${API_URL}/stats/trends/${period}`)
    return response.json()
  },
  
  // Genre stats
  getGenreDistribution: async () => {
    const response = await fetch(`${API_URL}/stats/genres`)
    return response.json()
  }
}