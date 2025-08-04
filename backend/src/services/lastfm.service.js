import axios from 'axios'

const LASTFM_API_KEY = process.env.LASTFM_API_KEY
const LASTFM_USERNAME = process.env.LASTFM_USERNAME
const BASE_URL = 'https://ws.audioscrobbler.com/2.0/'

export const lastfmService = {
  async makeRequest(method, params = {}) {
    try {
      const response = await axios.get(BASE_URL, {
        params: {
          method,
          user: LASTFM_USERNAME,
          api_key: LASTFM_API_KEY,
          format: 'json',
          ...params
        }
      })
      return response.data
    } catch (error) {
      console.error(`Last.fm API error for ${method}:`, error)
      throw error
    }
  },

  async getRecentTracks(from = null, limit = 200) {
    const params = { limit, extended: 1 }
    if (from) params.from = Math.floor(from / 1000)
    
    return this.makeRequest('user.getrecenttracks', params)
  },

  async getTopArtists(period = 'overall', limit = 1000) {
    return this.makeRequest('user.gettopartists', { period, limit })
  },

  async getUserInfo() {
    return this.makeRequest('user.getinfo')
  },

  // Fetch all listening history
  async getAllScrobbles(onProgress) {
    const allScrobbles = []
    let page = 1
    let totalPages = 1
    
    while (page <= totalPages) {
      const data = await this.makeRequest('user.getrecenttracks', {
        page,
        limit: 1000
      })
      
      totalPages = parseInt(data.recenttracks['@attr'].totalPages)
      const tracks = data.recenttracks.track.filter(t => t.date) // Skip now playing
      
      allScrobbles.push(...tracks)
      
      if (onProgress) {
        onProgress({
          current: page,
          total: totalPages,
          scrobbles: allScrobbles.length
        })
      }
      
      page++
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 200))
    }
    
    return allScrobbles
  }
}