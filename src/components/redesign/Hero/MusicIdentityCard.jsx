import React, { useRef, useState } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Play, Pause, SkipForward, Share2, Download } from 'lucide-react'

const MusicIdentityCard = ({ userData, currentTrack, stats }) => {
  const cardRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  
  // 3D tilt effect
  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = (y - centerY) / 20
    const rotateY = (centerX - x) / 20
    
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
  }
  
  const handleMouseLeave = () => {
    if (!cardRef.current) return
    cardRef.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)'
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsHovered(true)}
      onMouseOut={() => setIsHovered(false)}
      className="relative w-full max-w-lg mx-auto"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Glassmorphic Card */}
      <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-100 overflow-hidden">
        {/* Animated Background Gradient */}
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, #6366F1 0%, transparent 50%)',
              'radial-gradient(circle at 80% 80%, #EC4899 0%, transparent 50%)',
              'radial-gradient(circle at 50% 20%, #10B981 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, #6366F1 0%, transparent 50%)',
            ]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
        
        {/* User Profile Section */}
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg"
              >
                {userData?.name?.charAt(0) || 'M'}
              </motion.div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{userData?.name || 'Music Lover'}</h2>
                <p className="text-sm text-gray-500">Listening since {new Date(userData?.registered?.unixtime * 1000).getFullYear() || '2020'}</p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <Share2 className="w-4 h-4 text-gray-700" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <Download className="w-4 h-4 text-gray-700" />
              </motion.button>
            </div>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gray-50 rounded-2xl p-4 text-center"
            >
              <motion.div
                className="text-2xl font-bold text-gray-900"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {(stats?.totalScrobbles || 0).toLocaleString()}
              </motion.div>
              <div className="text-xs text-gray-500 mt-1">Total Plays</div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gray-50 rounded-2xl p-4 text-center"
            >
              <motion.div
                className="text-2xl font-bold text-gray-900"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {(stats?.uniqueArtists || 0).toLocaleString()}
              </motion.div>
              <div className="text-xs text-gray-500 mt-1">Artists</div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gray-50 rounded-2xl p-4 text-center"
            >
              <motion.div
                className="text-2xl font-bold text-gray-900"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {stats?.listeningTime || 0}h
              </motion.div>
              <div className="text-xs text-gray-500 mt-1">Listening Time</div>
            </motion.div>
          </div>
          
          {/* Now Playing */}
          {currentTrack && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-4 text-white"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <motion.div
                      animate={{ scale: isPlaying ? [1, 1.2, 1] : 1 }}
                      transition={{ duration: 1, repeat: isPlaying ? Infinity : 0 }}
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </motion.div>
                  </div>
                  <div>
                    <div className="font-medium text-sm">{currentTrack.name}</div>
                    <div className="text-xs text-white/70">{currentTrack.artist['#text']}</div>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2"
                >
                  <SkipForward className="w-4 h-4" />
                </motion.button>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-3 h-1 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: '60%' }}
                  transition={{ duration: 2, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          )}
        </div>
        
        {/* Hover Effect */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
              style={{
                background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.7) 50%, transparent 60%)',
                transform: 'translateX(-100%)',
                animation: 'shimmer 1s ease-out forwards'
              }}
            />
          )}
        </AnimatePresence>
      </div>
      
      <style jsx>{`
        @keyframes shimmer {
          to {
            transform: translateX(100%);
          }
        }
      `}</style>
    </motion.div>
  )
}

export default MusicIdentityCard