import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Music, Users, Clock, Headphones, TrendingUp, Award } from 'lucide-react'
import PremiumNav from '../../components/redesign/Navigation/PremiumNav'
import MusicIdentityCard from '../../components/redesign/Hero/MusicIdentityCard'
import AnimatedStatCard from '../../components/redesign/Stats/AnimatedStatCard'
import ListeningTimeline from '../../components/redesign/DataViz/ListeningTimeline'
import { useUserInfo, useRecentTracks, useListeningStats, useListeningTrends } from '../../hooks/useLastFm'

const Dashboard = () => {
  const { data: userInfo, isLoading: userLoading } = useUserInfo()
  const { data: recentTracks } = useRecentTracks(1)
  const { data: stats, isLoading: statsLoading } = useListeningStats('overall')
  const { data: trends } = useListeningTrends(null, '1month')
  
  const currentTrack = recentTracks?.recenttracks?.track?.[0]
  const loading = userLoading || statsLoading
  
  // Smooth loading transition
  const [showContent, setShowContent] = useState(false)
  useEffect(() => {
    if (!loading) {
      setTimeout(() => setShowContent(true), 100)
    }
  }, [loading])
  
  const statsData = [
    {
      title: 'Total Scrobbles',
      value: stats?.totalScrobbles || 0,
      change: 12,
      icon: Music,
      color: 'indigo'
    },
    {
      title: 'Unique Artists',
      value: stats?.uniqueArtists || 0,
      change: 8,
      icon: Users,
      color: 'pink'
    },
    {
      title: 'Hours Listened',
      value: stats?.listeningTime || 0,
      change: -3,
      icon: Clock,
      color: 'emerald'
    },
    {
      title: 'Daily Average',
      value: stats?.averageDaily || 0,
      change: 15,
      icon: Headphones,
      color: 'amber'
    }
  ]
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-3 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600">Loading your music universe...</p>
        </motion.div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <PremiumNav />
      
      <AnimatePresence>
        {showContent && (
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="pt-32 pb-20 px-6"
          >
            <div className="max-w-7xl mx-auto space-y-12">
              {/* Hero Section */}
              <motion.section
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="text-center mb-8">
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-5xl font-bold text-gray-900 mb-4"
                  >
                    Welcome back, {userInfo?.user?.name}
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-xl text-gray-600"
                  >
                    Your musical journey continues...
                  </motion.p>
                </div>
                
                {/* Music Identity Card */}
                <MusicIdentityCard
                  userData={userInfo?.user}
                  currentTrack={currentTrack}
                  stats={stats}
                />
              </motion.section>
              
              {/* Stats Grid */}
              <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {statsData.map((stat, index) => (
                    <AnimatedStatCard
                      key={stat.title}
                      {...stat}
                      delay={index * 0.1}
                    />
                  ))}
                </div>
              </motion.section>
              
              {/* Listening Timeline */}
              <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <ListeningTimeline data={trends || []} />
              </motion.section>
              
              {/* Quick Actions */}
              <motion.section
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 text-white"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-semibold mb-2">Ready to explore more?</h3>
                    <p className="text-white/80">Dive deeper into your music analytics</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-white text-indigo-600 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-shadow"
                  >
                    View Insights
                  </motion.button>
                </div>
              </motion.section>
            </div>
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Dashboard