import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Music, Play, Users, Clock, TrendingUp, Sparkles, Volume2, Heart } from 'lucide-react'
import { useUserInfo, useRecentTracks, useListeningStats } from '../../hooks/useLastFm'
import { formatNumber, formatRelativeTime, isNowPlaying, getArtistNames, getImageUrl } from '../../utils/formatters'

// Import new components
import SplitText from '../ui/TextAnimations/SplitText'
import BlurText from '../ui/TextAnimations/BlurText'
import GradientText from '../ui/TextAnimations/GradientText'
import TextTrail from '../ui/TextAnimations/TextTrail'
import GlareHover from '../ui/Animations/GlareHover'
import MagnetLines from '../ui/Animations/MagnetLines'
import ClickSpark from '../ui/Animations/ClickSpark'
import FluidGlass from '../ui/Components/FluidGlass'
import TiltedCard from '../ui/Components/TiltedCard'
import ProfileCard from '../ui/Components/ProfileCard'
import SpotlightCard from '../ui/Components/SpotlightCard'
import MagneticButton from '../ui/MagneticButton'

// Animated Counter Component
const AnimatedCounter = ({ value, duration = 2000 }) => {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    let startTime = null
    const startValue = 0
    const endValue = parseInt(value) || 0
    
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentCount = Math.floor(startValue + (endValue - startValue) * easeOutQuart)
      
      setCount(currentCount)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    requestAnimationFrame(animate)
  }, [value, duration])
  
  return <span>{count.toLocaleString()}</span>
}

// Music Wave Visualizer
const MusicWaveVisualizer = () => {
  const bars = Array.from({ length: 12 }, (_, i) => i)
  
  return (
    <div className="flex items-center justify-center space-x-1">
      {bars.map((bar) => (
        <motion.div
          key={bar}
          className="w-1 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full"
          animate={{
            height: [10, 30, 10],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: bar * 0.1,
          }}
        />
      ))}
    </div>
  )
}

// Enhanced Hero Section with real user data
const EnhancedHero = ({ username }) => {
  return (
    <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-purple-900/20 rounded-3xl" />
      
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center mb-6">
            <MagnetLines>
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-2xl"
              >
                <Music className="h-12 w-12 text-white" />
              </motion.div>
            </MagnetLines>
          </div>
          
          <div className="mb-4">
            <TextTrail
              text={username ? `${username}'s Music Universe` : "Your Music Universe"}
              className="text-5xl md:text-7xl font-bold justify-center"
            />
          </div>
          
          <BlurText
            text="Discover the rhythm of your soul through data"
            className="text-xl md:text-2xl text-gray-300 mb-8 justify-center"
            delay={1}
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <ClickSpark>
            <MagneticButton size="lg" className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Explore Your Journey
            </MagneticButton>
          </ClickSpark>
          
          <MagneticButton variant="secondary" size="lg" className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            View Analytics
          </MagneticButton>
        </motion.div>
        
        {/* Music Visualizer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-8"
        >
          <MusicWaveVisualizer />
        </motion.div>
      </div>
    </div>
  )
}

// Enhanced Stats Card
const EnhancedStatsCard = ({ title, value, icon, gradient, delay = 0 }) => {
  const Icon = icon
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="relative group"
    >
      <TiltedCard tiltIntensity={10}>
        <SpotlightCard className="p-6 h-full">
          <div className="flex items-center justify-between mb-4">
            <GlareHover>
              <div className={`p-3 rounded-xl bg-gradient-to-r ${gradient}`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
            </GlareHover>
            <Sparkles className="h-5 w-5 text-purple-400 opacity-60" />
          </div>
          
          <h3 className="text-sm font-medium text-gray-400 mb-2">{title}</h3>
          <p className="text-3xl font-bold text-white">
            <AnimatedCounter value={value} />
          </p>
        </SpotlightCard>
      </TiltedCard>
    </motion.div>
  )
}

// Enhanced Now Playing Card with real data
const EnhancedNowPlayingCard = () => {
  const { data: recentTracks, isLoading } = useRecentTracks(1)
  const currentTrack = recentTracks?.recenttracks?.track?.[0]
  const isPlaying = currentTrack && isNowPlaying(currentTrack)
  
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <FluidGlass className="p-6" variant="strong">
          <div className="animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-xl" />
              <div className="flex-1">
                <div className="h-4 bg-white/20 rounded w-24 mb-2" />
                <div className="h-5 bg-white/20 rounded w-48 mb-1" />
                <div className="h-4 bg-white/20 rounded w-32" />
              </div>
            </div>
          </div>
        </FluidGlass>
      </motion.div>
    )
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="relative group"
    >
      <GlareHover>
        <FluidGlass className="p-6" variant="strong">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center overflow-hidden">
                {currentTrack ? (
                  getImageUrl(currentTrack.image, 'medium') ? (
                    <img 
                      src={getImageUrl(currentTrack.image, 'medium')} 
                      alt={currentTrack.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Music className="h-8 w-8 text-white" />
                  )
                ) : (
                  <Music className="h-8 w-8 text-white" />
                )}
              </div>
              {isPlaying && (
                <motion.div
                  className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Volume2 className="h-4 w-4 text-green-400" />
                <SplitText 
                  text={isPlaying ? "Now Playing" : "Last Played"} 
                  className="text-sm font-medium text-green-400"
                  variant="scale"
                  duration={0.1}
                />
              </div>
              {currentTrack ? (
                <>
                  <h4 className="font-semibold text-white mb-1 truncate">{currentTrack.name}</h4>
                  <p className="text-sm text-gray-400 truncate">{getArtistNames(currentTrack)}</p>
                  {!isPlaying && currentTrack.date && (
                    <p className="text-xs text-gray-500 mt-1">
                      {formatRelativeTime(currentTrack.date.uts)}
                    </p>
                  )}
                </>
              ) : (
                <>
                  <h4 className="font-semibold text-white mb-1">No recent tracks</h4>
                  <p className="text-sm text-gray-400">Start scrobbling to see your music here</p>
                </>
              )}
            </div>
          </div>
        </FluidGlass>
      </GlareHover>
    </motion.div>
  )
}

// Main Enhanced Dashboard with real data
const EnhancedDashboard = () => {
  const { data: userInfo, isLoading: userLoading } = useUserInfo()
  const { data: stats, isLoading: statsLoading } = useListeningStats('overall')
  const { data: recentTracks } = useRecentTracks(10)
  
  const loading = userLoading || statsLoading
  
  const statsData = [
    { 
      title: "Total Scrobbles", 
      value: stats?.totalScrobbles || 0, 
      icon: Music, 
      gradient: "from-purple-500 to-pink-500", 
      delay: 0.1 
    },
    { 
      title: "Unique Artists", 
      value: stats?.uniqueArtists || 0, 
      icon: Users, 
      gradient: "from-blue-500 to-purple-500", 
      delay: 0.2 
    },
    { 
      title: "Hours Listened", 
      value: stats?.listeningTime || 0, 
      icon: Clock, 
      gradient: "from-green-500 to-blue-500", 
      delay: 0.3 
    },
    { 
      title: "Daily Average", 
      value: stats?.averageDaily || 0, 
      icon: TrendingUp, 
      gradient: "from-orange-500 to-red-500", 
      delay: 0.4 
    },
  ]
  
  if (loading) {
    return (
      <div className="space-y-8 p-6">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-t-2 border-purple-500 rounded-full mx-auto mb-4"
            />
            <p className="text-white/70">Loading your music universe...</p>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-8 p-6">
      {/* Hero Section */}
      <FluidGlass className="p-8 relative overflow-hidden" variant="strong">
        <EnhancedHero username={userInfo?.user?.name} />
      </FluidGlass>
      
      {/* Profile Card */}
      <ProfileCard 
        name={userInfo?.user?.name || "Music Explorer"}
        totalScrobbles={stats?.totalScrobbles || 0}
        topArtist={recentTracks?.recenttracks?.track?.[0]?.artist?.['#text'] || "Loading..."}
        avatar={getImageUrl(userInfo?.user?.image)}
      />
      
      {/* Now Playing Section */}
      <EnhancedNowPlayingCard />
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <EnhancedStatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            gradient={stat.gradient}
            delay={stat.delay}
          />
        ))}
      </div>
      
      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <FluidGlass className="p-6" variant="strong">
          <GradientText className="text-2xl mb-6" shimmer>
            Quick Actions
          </GradientText>
          <div className="flex flex-wrap gap-4">
            <ClickSpark>
              <MagneticButton variant="secondary" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                View Top Artists
              </MagneticButton>
            </ClickSpark>
            <ClickSpark>
              <MagneticButton variant="secondary" className="flex items-center gap-2">
                <Music className="h-4 w-4" />
                Browse Top Tracks
              </MagneticButton>
            </ClickSpark>
            <ClickSpark>
              <MagneticButton variant="secondary" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Analyze Trends
              </MagneticButton>
            </ClickSpark>
          </div>
        </FluidGlass>
      </motion.div>
    </div>
  )
}

export default EnhancedDashboard