import { useQuery, useQueries } from '@tanstack/react-query'
import { lastFmService } from '../services/lastfm'
import { api } from '../services/api'

// ===== EXISTING LAST.FM API HOOKS =====

// User Info Hook
export const useUserInfo = () => {
  return useQuery({
    queryKey: ['userInfo'],
    queryFn: () => lastFmService.getUserInfo(),
    staleTime: 1000 * 60 * 60, // 1 hour
    cacheTime: 1000 * 60 * 60 * 2, // 2 hours
  })
}

// Recent Tracks Hook
export const useRecentTracks = (limit = 10) => {
  return useQuery({
    queryKey: ['recentTracks', limit],
    queryFn: () => lastFmService.getRecentTracks(limit),
    refetchInterval: 1000 * 30, // Refetch every 30 seconds for real-time updates
    staleTime: 1000 * 10, // 10 seconds
  })
}

// Top Artists Hook
export const useTopArtists = (period = 'overall', limit = 50) => {
  return useQuery({
    queryKey: ['topArtists', period, limit],
    queryFn: () => lastFmService.getTopArtists(period, limit),
    staleTime: 1000 * 60 * 30, // 30 minutes
    cacheTime: 1000 * 60 * 60, // 1 hour
  })
}

// Top Tracks Hook
export const useTopTracks = (period = 'overall', limit = 50) => {
  return useQuery({
    queryKey: ['topTracks', period, limit],
    queryFn: () => lastFmService.getTopTracks(period, limit),
    staleTime: 1000 * 60 * 30, // 30 minutes
    cacheTime: 1000 * 60 * 60, // 1 hour
  })
}

// Top Albums Hook
export const useTopAlbums = (period = 'overall', limit = 50) => {
  return useQuery({
    queryKey: ['topAlbums', period, limit],
    queryFn: () => lastFmService.getTopAlbums(period, limit),
    staleTime: 1000 * 60 * 30, // 30 minutes
    cacheTime: 1000 * 60 * 60, // 1 hour
  })
}

// Combined Stats Hook
export const useListeningStats = (period = 'overall') => {
  const queries = useQueries({
    queries: [
      {
        queryKey: ['userInfo'],
        queryFn: () => lastFmService.getUserInfo(),
      },
      {
        queryKey: ['topArtists', period, 1000],
        queryFn: () => lastFmService.getTopArtists(period, 1000),
      },
      {
        queryKey: ['topTracks', period, 1000],
        queryFn: () => lastFmService.getTopTracks(period, 1000),
      },
      {
        queryKey: ['recentTracks', 200],
        queryFn: () => lastFmService.getRecentTracks(200),
      },
    ],
  })

  const [userInfo, topArtists, topTracks, recentTracks] = queries
  
  const isLoading = queries.some(query => query.isLoading)
  const error = queries.find(query => query.error)?.error

  // Calculate stats
  const stats = {
    totalScrobbles: userInfo.data?.user?.playcount || 0,
    uniqueArtists: topArtists.data?.topartists?.['@attr']?.total || 0,
    uniqueTracks: topTracks.data?.toptracks?.['@attr']?.total || 0,
    listeningTime: Math.round((userInfo.data?.user?.playcount || 0) * 3.5 / 60), // Estimate 3.5 min per track
    averageDaily: Math.round((userInfo.data?.user?.playcount || 0) / ((Date.now() - new Date(userInfo.data?.user?.registered?.['#text'] * 1000)) / (1000 * 60 * 60 * 24))) || 0,
    discoveriesThisMonth: 0, // Would need to calculate from recent data
  }

  return {
    data: stats,
    isLoading,
    error,
  }
}

// Weekly Chart List Hook
export const useWeeklyChartList = () => {
  return useQuery({
    queryKey: ['weeklyChartList'],
    queryFn: () => lastFmService.getWeeklyChartList(),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  })
}

// Genre Distribution Hook (calculated from top artists)
export const useGenreDistribution = (period = 'overall') => {
  const { data: artistsData, isLoading, error } = useTopArtists(period, 1000)
  
  const genreData = []
  
  if (artistsData?.topartists?.artist) {
    const genreCounts = {}
    const artists = artistsData.topartists.artist
    
    // In a real app, you'd fetch genres from Last.fm or MusicBrainz
    // For now, we'll create mock genre data based on artist names
    artists.forEach(artist => {
      // This is a simplified approach - in reality, you'd fetch actual genres
      const genre = getArtistGenre(artist.name) // Mock function
      genreCounts[genre] = (genreCounts[genre] || 0) + parseInt(artist.playcount)
    })
    
    // Convert to array and sort
    Object.entries(genreCounts).forEach(([genre, count]) => {
      genreData.push({
        genre,
        count,
        percentage: ((count / artists.reduce((sum, a) => sum + parseInt(a.playcount), 0)) * 100).toFixed(1)
      })
    })
    
    genreData.sort((a, b) => b.count - a.count)
  }
  
  return {
    data: genreData.slice(0, 10), // Top 10 genres
    isLoading,
    error,
  }
}

// Mock genre assignment (replace with real genre API)
function getArtistGenre(artistName) {
  const genreMap = {
    'rock': ['Beatles', 'Pink Floyd', 'Led Zeppelin', 'Queen', 'Rolling Stones', 'AC/DC'],
    'metal': ['Metallica', 'Iron Maiden', 'Black Sabbath'],
    'pop': ['Taylor Swift', 'Ariana Grande', 'Ed Sheeran'],
    'electronic': ['Daft Punk', 'Deadmau5', 'Skrillex'],
    'hip hop': ['Kanye West', 'Drake', 'Kendrick Lamar'],
    'indie': ['Arctic Monkeys', 'Tame Impala', 'Vampire Weekend'],
    'jazz': ['Miles Davis', 'John Coltrane', 'Bill Evans'],
    'classical': ['Mozart', 'Beethoven', 'Bach'],
  }
  
  for (const [genre, artists] of Object.entries(genreMap)) {
    if (artists.some(artist => artistName.toLowerCase().includes(artist.toLowerCase()))) {
      return genre
    }
  }
  
  return 'other'
}

// Listening Trends Hook
export const useListeningTrends = (username, period = '7day') => {
  return useQuery({
    queryKey: ['listeningTrends', username, period],
    queryFn: async () => {
      // Get weekly chart list
      const chartList = await lastFmService.getWeeklyChartList()
      
      // For simplicity, we'll create mock trend data
      // In a real app, you'd fetch weekly data and aggregate it
      const now = Date.now()
      const days = period === '7day' ? 7 : period === '1month' ? 30 : 90
      
      const trendData = []
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now - i * 24 * 60 * 60 * 1000)
        trendData.push({
          date: date.toISOString().split('T')[0],
          playcount: Math.floor(Math.random() * 50) + 20, // Mock data
        })
      }
      
      return trendData
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  })
}

// ===== NEW BACKEND API HOOKS =====

// Backend Overview Stats
export const useBackendStats = () => {
  return useQuery({
    queryKey: ['backendStats'],
    queryFn: api.getOverviewStats,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// Backend Top Artists
export const useBackendTopArtists = (period = 'overall', limit = 50) => {
  return useQuery({
    queryKey: ['backendTopArtists', period, limit],
    queryFn: () => api.getTopArtists(period, limit),
    staleTime: 1000 * 60 * 30, // 30 minutes
  })
}

// Backend Top Tracks
export const useBackendTopTracks = (period = 'overall', limit = 50) => {
  return useQuery({
    queryKey: ['backendTopTracks', period, limit],
    queryFn: () => api.getTopTracks(period, limit),
    staleTime: 1000 * 60 * 30, // 30 minutes
  })
}

// Backend Listening Patterns
export const useBackendListeningPatterns = () => {
  return useQuery({
    queryKey: ['backendListeningPatterns'],
    queryFn: api.getListeningPatterns,
    staleTime: 1000 * 60 * 60, // 1 hour
  })
}

// Backend Genre Distribution
export const useBackendGenreDistribution = () => {
  return useQuery({
    queryKey: ['backendGenreDistribution'],
    queryFn: api.getGenreDistribution,
    staleTime: 1000 * 60 * 60, // 1 hour
  })
}

// Sync Status
export const useSyncStatus = () => {
  return useQuery({
    queryKey: ['syncStatus'],
    queryFn: async () => {
      // This would be a backend endpoint to check sync status
      // For now, return mock data
      return {
        lastSync: new Date().toISOString(),
        totalScrobbles: 0,
        status: 'idle'
      }
    },
    staleTime: 1000 * 60, // 1 minute
  })
}

// Manual Sync Mutation
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useManualSync = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: api.syncNow,
    onSuccess: () => {
      // Invalidate all backend queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['backend'] })
    },
  })
}

// Import All Data Mutation
export const useImportAllData = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: api.importAll,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['backend'] })
    },
  })
}