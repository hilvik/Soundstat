import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Heart, ExternalLink, Music, Pause, MoreVertical } from 'lucide-react'
import { getImageUrl, formatNumber } from '../../../utils/formatters'

const TrackCard = ({ track, rank, delay = 0 }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const imageUrl = getImageUrl(track.image, 'extralarge')
  
  const handlePlayClick = (e) => {
    e.stopPropagation()
    setIsPlaying(!isPlaying)
  }
  
  const handleFavoriteClick = (e) => {
    e.stopPropagation()
    setIsFavorite(!isFavorite)
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -8 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 group cursor-pointer"
    >
      {/* Background Gradient Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      />
      
      {/* Album Art Section */}
      <div className="relative h-64 overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600">
        {imageUrl ? (
          <motion.img
            src={imageUrl}
            alt={track.name}
            className="w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Music className="w-20 h-20 text-white/50" />
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent" />
        
        {/* Play Button */}
        <motion.button
          onClick={handlePlayClick}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isHovered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl"
        >
          <motion.div
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isPlaying ? (
              <Pause className="w-7 h-7 text-gray-900" />
            ) : (
              <Play className="w-7 h-7 text-gray-900 ml-1" />
            )}
          </motion.div>
        </motion.button>
        
        {/* Rank Badge */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: delay + 0.3, type: "spring", stiffness: 200 }}
          className="absolute top-4 left-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center font-bold text-gray-900 shadow-lg"
        >
          #{rank}
        </motion.div>
        
        {/* More Options */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white"
        >
          <MoreVertical className="w-5 h-5" />
        </motion.button>
      </div>
      
      {/* Content Section */}
      <div className="p-6">
        {/* Track Info */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-1 truncate group-hover:text-indigo-600 transition-colors">
            {track.name}
          </h3>
          <p className="text-gray-600 truncate">
            {track.artist.name || track.artist['#text']}
          </p>
        </div>
        
        {/* Stats */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {formatNumber(track.playcount)}
              </div>
              <div className="text-xs text-gray-500">plays</div>
            </div>
            {track.duration && (
              <div className="text-sm text-gray-500">
                {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
              </div>
            )}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          <motion.button
            onClick={handleFavoriteClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex-1 py-2.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
              isFavorite 
                ? 'bg-pink-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            {isFavorite ? 'Favorited' : 'Favorite'}
          </motion.button>
          
          <motion.a
            href={track.url}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all flex items-center justify-center"
          >
            <ExternalLink className="w-4 h-4" />
          </motion.a>
        </div>
      </div>
      
      {/* Playing Indicator */}
      {isPlaying && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-600"
        >
          <motion.div
            className="h-full bg-white/50"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      )}
    </motion.div>
  )
}

export default TrackCard