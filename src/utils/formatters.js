import { format, formatDistance, formatRelative, parseISO } from 'date-fns'

// Format large numbers with commas
export const formatNumber = (num) => {
  if (!num) return '0'
  return parseInt(num).toLocaleString()
}

// Format duration in seconds to readable format
export const formatDuration = (seconds) => {
  if (!seconds) return '0:00'
  
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

// Format timestamp to relative time
export const formatRelativeTime = (timestamp) => {
  if (!timestamp) return ''
  
  const date = typeof timestamp === 'string' ? parseISO(timestamp) : new Date(timestamp * 1000)
  return formatDistance(date, new Date(), { addSuffix: true })
}

// Format date
export const formatDate = (date, formatStr = 'PPP') => {
  if (!date) return ''
  
  const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date * 1000)
  return format(dateObj, formatStr)
}

// Get image URL from Last.fm image array
export const getImageUrl = (images, size = 'large') => {
  if (!images || !Array.isArray(images)) return null
  
  const sizeMap = {
    small: 0,
    medium: 1,
    large: 2,
    extralarge: 3,
  }
  
  const image = images[sizeMap[size]] || images[images.length - 1]
  return image?.['#text'] || null
}

// Format playcount to human readable
export const formatPlaycount = (count) => {
  if (!count) return '0'
  
  const num = parseInt(count)
  
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  
  return num.toString()
}

// Calculate listening time from playcount
export const calculateListeningTime = (playcount, avgTrackLength = 3.5) => {
  const totalMinutes = playcount * avgTrackLength
  const hours = Math.floor(totalMinutes / 60)
  const days = Math.floor(hours / 24)
  
  if (days > 0) {
    return `${days} days`
  } else if (hours > 0) {
    return `${hours} hours`
  }
  
  return `${Math.round(totalMinutes)} minutes`
}

// Get period label
export const getPeriodLabel = (period) => {
  const periodMap = {
    '7day': 'Last 7 Days',
    '1month': 'Last Month',
    '3month': 'Last 3 Months',
    '6month': 'Last 6 Months',
    '12month': 'Last Year',
    'overall': 'All Time',
  }
  
  return periodMap[period] || period
}

// Extract artist names from track
export const getArtistNames = (track) => {
  if (track?.artist?.name) {
    return track.artist.name
  } else if (track?.artist?.['#text']) {
    return track.artist['#text']
  } else if (typeof track?.artist === 'string') {
    return track.artist
  }
  
  return 'Unknown Artist'
}

// Check if track is currently playing
export const isNowPlaying = (track) => {
  return track?.['@attr']?.nowplaying === 'true'
}

// Get track URL
export const getTrackUrl = (track) => {
  return track?.url || '#'
}

// Format listening stats
export const formatListeningStats = (stats) => {
  return {
    totalScrobbles: formatNumber(stats.totalScrobbles),
    uniqueArtists: formatNumber(stats.uniqueArtists),
    uniqueTracks: formatNumber(stats.uniqueTracks),
    listeningTime: `${formatNumber(stats.listeningTime)}h`,
    averageDaily: formatNumber(stats.averageDaily),
    discoveriesThisMonth: formatNumber(stats.discoveriesThisMonth),
  }
}