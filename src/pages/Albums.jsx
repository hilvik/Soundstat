import React, { useState } from 'react'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, Play, ExternalLink, Heart, Disc } from 'lucide-react'
import AnimatedCard from '../components/ui/AnimatedCard'
import GradientText from '../components/ui/GradientText'
import TimeRangePicker from '../components/ui/TimeRangePicker'
import FilterTabs from '../components/ui/FilterTabs'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { useTopAlbums } from '../hooks/useLastFm'
import { formatNumber, getImageUrl, getArtistNames } from '../utils/formatters'

const Albums = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('overall')
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState('grid')
  const { data, isLoading, error } = useTopAlbums(selectedPeriod, 50)
  
  const albums = data?.topalbums?.album || []
  const filteredAlbums = searchTerm 
    ? albums.filter(album => 
        album.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        album.artist.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : albums

  const viewTabs = [
    { value: 'grid', label: 'Grid', icon: <div className="w-3 h-3 bg-current rounded-sm" /> },
    { value: 'list', label: 'List', icon: <div className="w-3 h-1 bg-current rounded-full" /> }
  ]

  const AlbumCard = ({ album, index }) => (
    <Motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.6 }}
      whileHover={{ scale: 1.02 }}
      className="group"
    >
      <AnimatedCard className="p-4 h-full hover:shadow-2xl transition-all duration-300">
        <div className="aspect-square mb-4 relative overflow-hidden rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
          {getImageUrl(album.image, 'extralarge') ? (
            <img 
              src={getImageUrl(album.image, 'extralarge')} 
              alt={album.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Disc className="w-16 h-16 text-white/50" />
            </div>
          )}
          
          {/* Play overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-4 bg-white/20 backdrop-blur-sm rounded-full text-white"
            >
              <Play className="w-8 h-8" />
            </Motion.button>
          </div>
          
          {/* Rank badge */}
          <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-full text-white font-bold text-sm">
            #{index + 1}
          </div>
        </div>
        
        <div>
          <h3 className="font-bold text-white text-lg mb-1 truncate group-hover:text-purple-300 transition-colors">
            {album.name}
          </h3>
          <p className="text-white/70 text-sm mb-2 truncate">
            {album.artist.name}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white/70 text-sm">
              <Play className="w-4 h-4" />
              <span>{formatNumber(album.playcount)} plays</span>
            </div>
            <div className="flex items-center gap-1">
              <Motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 bg-white/10 rounded-full text-white/70 hover:text-white hover:bg-white/20 transition-all"
              >
                <Heart className="w-4 h-4" />
              </Motion.button>
              <Motion.a
                href={album.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 bg-white/10 rounded-full text-white/70 hover:text-white hover:bg-white/20 transition-all"
              >
                <ExternalLink className="w-4 h-4" />
              </Motion.a>
            </div>
          </div>
        </div>
      </AnimatedCard>
    </Motion.div>
  )

  const AlbumListItem = ({ album, index }) => (
    <Motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03, duration: 0.4 }}
      whileHover={{ scale: 1.01 }}
      className="group"
    >
      <AnimatedCard className="p-4 flex items-center gap-4 hover:shadow-lg transition-all duration-300">
        {/* Rank */}
        <div className="text-2xl font-bold text-white/30 w-12 text-center">
          #{index + 1}
        </div>
        
        {/* Album Art */}
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white overflow-hidden flex-shrink-0">
          {getImageUrl(album.image) ? (
            <img 
              src={getImageUrl(album.image)} 
              alt={album.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <Disc className="w-8 h-8" />
          )}
        </div>
        
        {/* Album Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-white text-lg truncate group-hover:text-purple-300 transition-colors">
            {album.name}
          </h3>
          <p className="text-white/70 text-sm truncate">
            {album.artist.name}
          </p>
        </div>
        
        {/* Playcount */}
        <div className="text-right text-white/70 text-sm">
          <div>{formatNumber(album.playcount)} plays</div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-2">
          <Motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 bg-white/10 rounded-full text-white/70 hover:text-white hover:bg-white/20 transition-all"
          >
            <Heart className="w-4 h-4" />
          </Motion.button>
          <Motion.a
            href={album.url}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 bg-white/10 rounded-full text-white/70 hover:text-white hover:bg-white/20 transition-all"
          >
            <ExternalLink className="w-4 h-4" />
          </Motion.a>
        </div>
      </AnimatedCard>
    </Motion.div>
  )

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <LoadingSpinner size="xl" className="mx-auto mb-4" />
          <p className="text-white/70">Loading your top albums...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4">😢</div>
          <h3 className="text-xl font-bold text-white mb-2">Something went wrong</h3>
          <p className="text-white/70">{error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <Motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <GradientText className="text-4xl mb-2">
          Your Top Albums
        </GradientText>
        <Motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-white/70"
        >
          The collections that captured your heart
        </Motion.p>
      </Motion.div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <Motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="relative flex-1 max-w-md"
        >
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
          <input
            type="text"
            placeholder="Search albums..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
        </Motion.div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <TimeRangePicker
            selectedPeriod={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
          />
          <FilterTabs
            tabs={viewTabs}
            activeTab={viewMode}
            onTabChange={setViewMode}
            variant="pills"
          />
        </div>
      </div>

      {/* Results Count */}
      <Motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-white/70 text-sm"
      >
        Showing {filteredAlbums.length} of {albums.length} albums
      </Motion.div>

      {/* Albums Grid/List */}
      <AnimatePresence mode="wait">
        <Motion.div
          key={`${viewMode}-${selectedPeriod}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={
            viewMode === 'grid' 
              ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'
              : 'space-y-3'
          }
        >
          {filteredAlbums.map((album, index) => (
            viewMode === 'grid' ? (
              <AlbumCard key={`${album.mbid}-${index}`} album={album} index={index} />
            ) : (
              <AlbumListItem key={`${album.mbid}-${index}`} album={album} index={index} />
            )
          ))}
        </Motion.div>
      </AnimatePresence>

      {/* Empty State */}
      {filteredAlbums.length === 0 && !isLoading && (
        <Motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <div className="text-6xl mb-4">💿</div>
          <h3 className="text-xl font-bold text-white mb-2">No albums found</h3>
          <p className="text-white/70">Try adjusting your search or time period</p>
        </Motion.div>
      )}
    </div>
  )
}

export default Albums