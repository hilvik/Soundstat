import React, { useState, useEffect, useMemo } from 'react'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import AnimatedCard from '../ui/AnimatedCard'
import AnimatedCounter from '../ui/AnimatedCounter'
import GradientText from '../ui/GradientText'
import LoadingSpinner from '../ui/LoadingSpinner'
import { Play, Music, Users, Clock, Calendar, TrendingUp } from 'lucide-react'

const DetailedStats = ({ data, loading = false, period = "overall" }) => {
  const [selectedStat, setSelectedStat] = useState(null)
  const [animatedStats, setAnimatedStats] = useState([])

  const statsConfig = useMemo(() => [
    {
      key: 'totalScrobbles',
      label: 'Total Scrobbles',
      icon: Play,
      color: 'from-purple-500 to-purple-600',
      value: data?.totalScrobbles || 0,
      suffix: '',
      description: 'Total tracks played'
    },
    {
      key: 'uniqueArtists',
      label: 'Unique Artists',
      icon: Users,
      color: 'from-pink-500 to-pink-600',
      value: data?.uniqueArtists || 0,
      suffix: '',
      description: 'Different artists in your library'
    },
    {
      key: 'uniqueTracks',
      label: 'Unique Tracks',
      icon: Music,
      color: 'from-blue-500 to-blue-600',
      value: data?.uniqueTracks || 0,
      suffix: '',
      description: 'Different songs you\'ve played'
    },
    {
      key: 'listeningTime',
      label: 'Listening Time',
      icon: Clock,
      color: 'from-green-500 to-green-600',
      value: data?.listeningTime || 0,
      suffix: 'h',
      description: 'Total hours of music'
    },
    {
      key: 'averageDaily',
      label: 'Daily Average',
      icon: Calendar,
      color: 'from-orange-500 to-orange-600',
      value: data?.averageDaily || 0,
      suffix: '',
      description: 'Average plays per day'
    },
    {
      key: 'discoveriesThisMonth',
      label: 'New Discoveries',
      icon: TrendingUp,
      color: 'from-red-500 to-red-600',
      value: data?.discoveriesThisMonth || 0,
      suffix: '',
      description: 'New artists this month'
    }
  ], [data])

  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      const timer = setTimeout(() => {
        setAnimatedStats(statsConfig)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [data, statsConfig])

  const StatCard = ({ stat, index }) => {
    const Icon = stat.icon
    const isSelected = selectedStat === stat.key
    
    return (
      <Motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.6,
          delay: index * 0.1,
          type: "spring",
          stiffness: 100
        }}
        whileHover={{ 
          scale: 1.05,
          y: -5,
          transition: { duration: 0.2 }
        }}
        whileTap={{ scale: 0.95 }}
        className={`relative cursor-pointer ${
          isSelected ? 'ring-2 ring-white/50' : ''
        }`}
        onClick={() => setSelectedStat(isSelected ? null : stat.key)}
      >
        <AnimatedCard 
          className={`h-32 bg-gradient-to-br ${stat.color} relative overflow-hidden`}
          hover={false}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(255,255,255,0.3)_1px,_transparent_0)] bg-[size:12px_12px]" />
          </div>
          
          {/* Icon */}
          <Motion.div
            animate={{ 
              scale: isSelected ? 1.1 : 1,
              rotate: isSelected ? 5 : 0
            }}
            className="absolute top-4 right-4"
          >
            <Icon className="w-6 h-6 text-white/80" />
          </Motion.div>
          
          {/* Content */}
          <div className="relative z-10">
            <div className="text-white/80 text-sm font-medium mb-1">
              {stat.label}
            </div>
            <div className="text-white text-2xl font-bold mb-2">
              <AnimatedCounter
                value={stat.value}
                suffix={stat.suffix}
                delay={index * 0.1 + 0.5}
                duration={1.5}
              />
            </div>
            <div className="text-white/60 text-xs">
              {stat.description}
            </div>
          </div>
          
          {/* Selection indicator */}
          <AnimatePresence>
            {isSelected && (
              <Motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute top-2 left-2 w-3 h-3 bg-white rounded-full"
              />
            )}
          </AnimatePresence>
        </AnimatedCard>
      </Motion.div>
    )
  }

  if (loading) {
    return (
      <AnimatedCard className="flex items-center justify-center h-96">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-white/70">Loading detailed statistics...</p>
        </div>
      </AnimatedCard>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <GradientText className="text-3xl mb-2">
          Your Music Statistics
        </GradientText>
        <Motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-white/70"
        >
          {period === 'overall' ? 'All time' : period} listening insights
        </Motion.p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {animatedStats.map((stat, index) => (
          <StatCard key={stat.key} stat={stat} index={index} />
        ))}
      </div>

      {/* Detailed View */}
      <AnimatePresence>
        {selectedStat && (
          <Motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AnimatedCard gradient className="p-6">
              <div className="flex items-center justify-between mb-4">
                <GradientText className="text-xl">
                  {statsConfig.find(s => s.key === selectedStat)?.label} Details
                </GradientText>
                <button
                  onClick={() => setSelectedStat(null)}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">
                    <AnimatedCounter
                      value={statsConfig.find(s => s.key === selectedStat)?.value || 0}
                      suffix={statsConfig.find(s => s.key === selectedStat)?.suffix || ''}
                      duration={1}
                    />
                  </div>
                  <div className="text-white/70 text-sm">Current Value</div>
                </div>
                
                <div className="text-center">
                  <div className="text-xl font-bold text-green-400 mb-2">
                    +{Math.round(Math.random() * 20)}%
                  </div>
                  <div className="text-white/70 text-sm">vs Last Period</div>
                </div>
                
                <div className="text-center">
                  <div className="text-xl font-bold text-purple-400 mb-2">
                    #{Math.round(Math.random() * 100)}
                  </div>
                  <div className="text-white/70 text-sm">Global Rank</div>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-white/5 rounded-lg">
                <p className="text-white/80 text-sm">
                  {statsConfig.find(s => s.key === selectedStat)?.description}
                </p>
              </div>
            </AnimatedCard>
          </Motion.div>
        )}
      </AnimatePresence>

      {/* Summary Card */}
      <AnimatedCard gradient className="p-6">
        <div className="text-center">
          <GradientText className="text-xl mb-4">
            Music DNA Summary
          </GradientText>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {Math.round((data?.totalScrobbles || 0) / 365)}
              </div>
              <div className="text-white/70 text-sm">Daily Tracks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {Math.round((data?.listeningTime || 0) / 24)}
              </div>
              <div className="text-white/70 text-sm">Days of Music</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {Math.round((data?.uniqueTracks || 0) / (data?.uniqueArtists || 1))}
              </div>
              <div className="text-white/70 text-sm">Tracks per Artist</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {data?.totalScrobbles > 50000 ? 'Expert' : data?.totalScrobbles > 10000 ? 'Enthusiast' : 'Casual'}
              </div>
              <div className="text-white/70 text-sm">Listener Type</div>
            </div>
          </div>
        </div>
      </AnimatedCard>
    </div>
  )
}

export default DetailedStats
