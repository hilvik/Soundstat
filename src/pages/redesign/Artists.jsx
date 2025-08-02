import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, ExternalLink, Play, TrendingUp } from 'lucide-react'
import PremiumNav from '../../components/redesign/Navigation/PremiumNav'
import ArtistCard from '../../components/redesign/Artists/ArtistCard'
import { useTopArtists } from '../../hooks/useLastFm'

const Artists = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('overall')
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState('grid')
  const { data, isLoading } = useTopArtists(selectedPeriod, 50)
  
  const artists = data?.topartists?.artist || []
  const filteredArtists = searchTerm
    ? artists.filter(artist => 
        artist.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : artists
  
  const periods = [
    { value: 'overall', label: 'All Time' },
    { value: '12month', label: 'This Year' },
    { value: '6month', label: '6 Months' },
    { value: '3month', label: '3 Months' },
    { value: '1month', label: 'This Month' },
    { value: '7day', label: 'This Week' }
  ]
  
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
              Your Top Artists
            </h1>
            <p className="text-xl text-gray-600">
              The voices that define your musical taste
            </p>
          </motion.div>
          
          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 mb-8"
          >
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search artists..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>
              
              {/* Period Selector */}
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              >
                {periods.map(period => (
                  <option key={period.value} value={period.value}>
                    {period.label}
                  </option>
                ))}
              </select>
              
              {/* View Mode */}
              <div className="flex bg-gray-50 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    viewMode === 'grid'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    viewMode === 'list'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  List
                </button>
              </div>
            </div>
          </motion.div>
          
          {/* Results Count */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 mb-6"
          >
            Showing {filteredArtists.length} artists
          </motion.div>
          
          {/* Artists Grid/List */}
          <AnimatePresence mode="wait">
            {viewMode === 'grid' ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filteredArtists.map((artist, index) => (
                  <ArtistCard
                    key={artist.mbid || artist.name}
                    artist={artist}
                    rank={index + 1}
                    delay={index * 0.05}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {filteredArtists.map((artist, index) => (
                  <ArtistListItem
                    key={artist.mbid || artist.name}
                    artist={artist}
                    rank={index + 1}
                    delay={index * 0.05}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}

// Artist List Item Component
const ArtistListItem = ({ artist, rank, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ scale: 1.01 }}
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 flex items-center gap-6"
    >
      {/* Rank */}
      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
        {rank}
      </div>
      
      {/* Artist Info */}
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900">{artist.name}</h3>
        <p className="text-gray-600">{parseInt(artist.playcount).toLocaleString()} plays</p>
      </div>
      
      {/* Actions */}
      <div className="flex gap-2">
        <motion.a
          href={artist.url}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <ExternalLink className="w-4 h-4 text-gray-700" />
        </motion.a>
      </div>
    </motion.div>
  )
}

export default Artists