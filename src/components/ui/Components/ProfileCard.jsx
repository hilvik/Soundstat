import React from 'react'
import { motion } from 'framer-motion'
import { User, Music, Heart, Play } from 'lucide-react'
import GlareHover from '../Animations/GlareHover'
import FluidGlass from './FluidGlass'

const ProfileCard = ({ 
  name = "Music Lover",
  totalScrobbles = 0,
  topArtist = "Loading...",
  avatar,
  className = "",
  ...props 
}) => {
  return (
    <GlareHover className={className} {...props}>
      <FluidGlass className="p-6" variant="strong">
        <div className="flex items-center gap-4 mb-4">
          {/* Avatar */}
          <motion.div
            className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {avatar ? (
              <img src={avatar} alt={name} className="w-full h-full rounded-full object-cover" />
            ) : (
              <User className="w-8 h-8 text-white" />
            )}
          </motion.div>
          
          {/* User Info */}
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-1">{name}</h3>
            <p className="text-white/70 text-sm">Music Enthusiast</p>
          </div>
          
          {/* Status */}
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-3 h-3 bg-green-500 rounded-full"
          />
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Play className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-lg font-bold text-white">{totalScrobbles.toLocaleString()}</div>
            <div className="text-xs text-white/70">Plays</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Music className="w-4 h-4 text-pink-400" />
            </div>
            <div className="text-lg font-bold text-white">1</div>
            <div className="text-xs text-white/70">Top Artist</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Heart className="w-4 h-4 text-red-400" />
            </div>
            <div className="text-lg font-bold text-white">∞</div>
            <div className="text-xs text-white/70">Love</div>
          </div>
        </div>
        
        {/* Top Artist */}
        <div className="text-center p-3 bg-white/5 rounded-lg">
          <div className="text-sm text-white/70 mb-1">Currently Obsessed With</div>
          <div className="font-semibold text-white">{topArtist}</div>
        </div>
      </FluidGlass>
    </GlareHover>
  )
}

export default ProfileCard