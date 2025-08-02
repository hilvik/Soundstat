import React from 'react'
import { motion } from 'framer-motion'
import { Radar } from 'recharts'

const MusicDNA = ({ genres, stats }) => {
  // Calculate music traits based on data
  const traits = [
    { trait: 'Diversity', value: Math.min(genres?.length || 0, 10) * 10 },
    { trait: 'Consistency', value: Math.min((stats?.averageDaily || 0) / 50 * 100, 100) },
    { trait: 'Discovery', value: Math.min((stats?.uniqueArtists || 0) / 1000 * 100, 100) },
    { trait: 'Dedication', value: Math.min((stats?.totalScrobbles || 0) / 50000 * 100, 100) },
    { trait: 'Exploration', value: Math.min((stats?.uniqueTracks || 0) / 10000 * 100, 100) },
    { trait: 'Intensity', value: Math.min((stats?.listeningTime || 0) / 5000 * 100, 100) }
  ]
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100"
    >
      <h3 className="text-2xl font-semibold text-gray-900 mb-6">Your Music DNA</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Radar Chart Placeholder */}
        <div className="aspect-square bg-gray-50 rounded-2xl flex items-center justify-center">
          <p className="text-gray-500">Radar visualization here</p>
        </div>
        
        {/* Traits List */}
        <div className="space-y-4">
          {traits.map((trait, index) => (
            <motion.div
              key={trait.trait}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex justify-between mb-2">
                <span className="font-medium text-gray-900">{trait.trait}</span>
                <span className="text-gray-600">{trait.value}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${trait.value}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default MusicDNA