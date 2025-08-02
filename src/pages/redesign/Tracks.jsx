import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Play, Heart, ExternalLink, Music } from 'lucide-react'
import PremiumNav from '../../components/redesign/Navigation/PremiumNav'
import TrackCard from '../../components/redesign/Tracks/TrackCard'
import { useTopTracks } from '../../hooks/useLastFm'

const Tracks = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('overall')
  const [searchTerm, setSearchTerm] = useState('')
  const { data, isLoading } = useTopTracks(selectedPeriod, 50)
  
  const tracks = data?.toptracks?.track || []
  const filteredTracks = searchTerm
    ? tracks.filter(track => 
        track.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        track.artist.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : tracks
  
  return (
    <div className="min-h-screen bg-gray-50">
      <PremiumNav />
      
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Your Top Tracks
            </h1>
            <p className="text-xl text-gray-600">
              The songs that keep you coming back
            </p>
          </motion.div>
          
          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto mb-12"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search tracks or artists..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl shadow-lg border border-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
          </motion.div>
          
          {/* Tracks List */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
          >
            <div className="p-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                All Tracks ({filteredTracks.length})
              </h3>
              
              <div className="space-y-4">
                {filteredTracks.map((track, index) => (
                  <TrackListItem
                    key={`${track.mbid || track.url}-${index}`}
                    track={track}
                    rank={index + 1}
                    delay={index * 0.03}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

// Track List Item Component
const TrackListItem = ({ track, rank, delay }) => {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(delay, 0.3), duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-all group"
    >
      {/* Rank */}
      <div className="w-8 text-center font-medium text-gray-500">
        {rank}
      </div>
      
      {/* Play Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Play className="w-4 h-4 ml-0.5" />
      </motion.button>
      
      {/* Track Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 truncate">{track.name}</h4>
        <p className="text-sm text-gray-600 truncate">{track.artist.name}</p>
      </div>
      
      {/* Play Count */}
      <div className="text-sm text-gray-500">
        {parseInt(track.playcount).toLocaleString()} plays
      </div>
      
      {/* Actions */}
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Heart className="w-4 h-4 text-gray-600" />
        </motion.button>
        <motion.a
          href={track.url}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ExternalLink className="w-4 h-4 text-gray-600" />
        </motion.a>
      </div>
    </motion.div>
  )
}

export default Tracks