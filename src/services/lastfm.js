const API_KEY = import.meta.env.VITE_LASTFM_API_KEY
const BASE_URL = import.meta.env.VITE_LASTFM_BASE_URL
const USERNAME = import.meta.env.VITE_LASTFM_USERNAME

class LastFmService {
  async request(method, params = {}) {
    const url = new URL(BASE_URL)
    url.searchParams.append('method', method)
    url.searchParams.append('api_key', API_KEY)
    url.searchParams.append('format', 'json')
    url.searchParams.append('user', USERNAME)
    
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value)
    })

    try {
      const response = await fetch(url)
      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.message || 'API Error')
      }
      
      return data
    } catch (error) {
      console.error('Last.fm API Error:', error)
      throw error
    }
  }

  // User Info
  async getUserInfo() {
    return this.request('user.getinfo')
  }

  // Recent Tracks
  async getRecentTracks(limit = 10) {
    return this.request('user.getrecenttracks', { limit })
  }

  // Top Artists
  async getTopArtists(period = 'overall', limit = 50) {
    return this.request('user.gettopartists', { period, limit })
  }

  // Top Tracks
  async getTopTracks(period = 'overall', limit = 50) {
    return this.request('user.gettoptracks', { period, limit })
  }

  // Top Albums
  async getTopAlbums(period = 'overall', limit = 50) {
    return this.request('user.gettopalbums', { period, limit })
  }

  // Weekly Charts
  async getWeeklyChartList() {
    return this.request('user.getweeklychartlist')
  }
}

export const lastFmService = new LastFmService()