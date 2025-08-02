import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Music, TrendingUp, Clock } from 'lucide-react'
import PremiumNav from '../../components/redesign/Navigation/PremiumNav'
import ListeningTimeline from '../../components/redesign/DataViz/ListeningTimeline'
import TimelineEvent from '../../components/redesign/Timeline/TimelineEvent'
import { useListeningTrends, useTopArtists, useTopTracks } from '../../hooks/useLastFm'

const Timeline = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('3month')
  const { data: trends } = useListeningTrends(null, selectedPeriod)
  const { data: topArtists } = useTopArtists(selectedPeriod, 5)
  const { data: topTracks } = useTopTracks(selectedPeriod, 5)
  
  const periods = [
    { value: '7day', label: 'Week' },
    { value: '1month', label: 'Month' },
    { value: '3month', label: '3 Months' },
    { value: '6month', label: '6 Months' },
    { value: '12month', label: 'Year' }
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
              Your Musical Timeline
            </h1>
            <p className="text-xl text-gray-600">
              Track your listening journey through time
            </p>
          </motion.div>
          
          {/* Period Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center mb-12"
          >
            <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-100 flex gap-2">
              {periods.map((period) => (
                <button
                  key={period.value}
                  onClick={() => setSelectedPeriod(period.value)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all ${
                    selectedPeriod === period.value
                      ? 'bg-gray-900 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>
          </motion.div>
          
          {/* Timeline Chart */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <ListeningTimeline data={trends || []} />
          </motion.div>
          
          {/* Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Top Artists */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Top Artists</h3>
              <div className="space-y-4">
                {topArtists?.topartists?.artist?.slice(0, 5).map((artist, index) => (
                  <motion.div
                    key={artist.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{artist.name}</div>
                        <div className="text-sm text-gray-500">{parseInt(artist.playcount).toLocaleString()} plays</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Top Tracks */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Top Tracks</h3>
              <div className="space-y-4">
                {topTracks?.toptracks?.track?.slice(0, 5).map((track, index) => (
                  <motion.div
                    key={track.url}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg flex items-center justify-center text-white font-semibold">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">{track.name}</div>
                        <div className="text-sm text-gray-500 truncate">{track.artist.name}</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 ml-4">
                      {parseInt(track.playcount).toLocaleString()}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

export default Timeline