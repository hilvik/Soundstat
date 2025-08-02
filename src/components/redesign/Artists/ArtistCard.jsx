import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, ExternalLink, TrendingUp } from 'lucide-react'
import { getImageUrl } from '../../../utils/formatters'

const ArtistCard = ({ artist, rank, delay = 0 }) => {
  const [isHovered, setIsHovered] = useState(false)
  const imageUrl = getImageUrl(artist.image, 'large')
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -8 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 group"
    >
      {/* Background Image with Overlay */}
      <div className="aspect-square relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
          style={{
            backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
            backgroundColor: !imageUrl ? '#E5E7EB' : 'transparent'
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent opacity-60" />
        
        {/* Rank Badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: delay + 0.3 }}
          className="absolute top-4 left-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center font-bold text-gray-900 shadow-lg"
        >
          #{rank}
        </motion.div>
        
        {/* Play Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isHovered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl"
        >
          <Play className="w-6 h-6 text-gray-900 ml-1" />
        </motion.button>
        
        {/* Artist Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h3 className="text-2xl font-bold mb-2">{artist.name}</h3>
          <p className="text-white/80">{parseInt(artist.playcount).toLocaleString()} plays</p>
        </div>
      </div>
      
      {/* Actions Bar */}
      <motion.div
        initial={{ height: 0 }}
        animate={isHovered ? { height: 'auto' } : { height: 0 }}
        className="bg-gray-50 overflow-hidden"
      >
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <TrendingUp className="w-4 h-4" />
            <span>Trending up</span>
          </div>
          <motion.a
            href={artist.url}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-lg bg-white hover:bg-gray-100 transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-gray-700" />
          </motion.a>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ArtistCard