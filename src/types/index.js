// Last.fm API Types
export const LastFmPeriods = {
  WEEK: '7day',
  MONTH: '1month',
  QUARTER: '3month',
  HALF_YEAR: '6month',
  YEAR: '12month',
  ALL_TIME: 'overall',
}

// Track type
export const TrackType = {
  name: '',
  artist: {
    name: '',
    mbid: '',
    '#text': '',
  },
  album: {
    '#text': '',
    mbid: '',
  },
  image: [],
  url: '',
  playcount: 0,
  '@attr': {
    nowplaying: 'false',
    rank: 0,
  },
  date: {
    uts: '',
    '#text': '',
  },
}

// Artist type
export const ArtistType = {
  name: '',
  playcount: 0,
  mbid: '',
  url: '',
  streamable: '',
  image: [],
  '@attr': {
    rank: 0,
  },
}

// Album type
export const AlbumType = {
  name: '',
  playcount: 0,
  mbid: '',
  url: '',
  artist: {
    name: '',
    mbid: '',
    url: '',
  },
  image: [],
  '@attr': {
    rank: 0,
  },
}

// User type
export const UserType = {
  name: '',
  realname: '',
  image: [],
  url: '',
  country: '',
  age: 0,
  playcount: 0,
  playlists: 0,
  bootstrap: '',
  registered: {
    '#text': 0,
    unixtime: 0,
  },
  type: '',
}

// Stats type
export const StatsType = {
  totalScrobbles: 0,
  uniqueArtists: 0,
  uniqueTracks: 0,
  listeningTime: 0,
  averageDaily: 0,
  discoveriesThisMonth: 0,
}

// Chart data type
export const ChartDataType = {
  date: '',
  playcount: 0,
}

// Genre data type
export const GenreDataType = {
  genre: '',
  count: 0,
  percentage: 0,
}