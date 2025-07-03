import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Music, Users, TrendingUp, Heart, Clock, Sparkles, Play } from 'lucide-react'

// Import React Bits components
import SplitText from '../ui/ReactBits/SplitText'
import BlurText from '../ui/ReactBits/BlurText'
import GlareHover from '../ui/ReactBits/GlareHover'
import ClickSpark from '../ui/ReactBits/ClickSpark'
import FluidGlass from '../ui/ReactBits/FluidGlass'
import MetaBalls from '../ui/ReactBits/MetaBalls'

const EnhancedMusicStoryIntro = ({ onContinue }) => {
  const [currentPhase, setCurrentPhase] = useState(0)
  const [showContinue, setShowContinue] = useState(false)

  const storyPhases = [
    {
      title: "Every song tells a story...",
      subtitle: "But what story do 5 years of your music tell?",
      delay: 0
    },
    {
      title: "Welcome to your Musical Universe",
      subtitle: "A journey through sound, emotion, and time",
      delay: 3
    },
    {
      title: "This is more than data...",
      subtitle: "This is the soundtrack to your life",
      delay: 6
    }
  ]

  useEffect(() => {
    const timers = [
      setTimeout(() => setCurrentPhase(1), 3000),
      setTimeout(() => setCurrentPhase(2), 6000),
      setTimeout(() => setShowContinue(true), 9000)
    ]

    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* Enhanced Background with Meta Balls */}
      <MetaBalls 
        count={6} 
        colors={["#8b5cf6", "#ec4899", "#06b6d4", "#10b981"]}
        size="xl"
        speed="slow"
      />
      
      {/* Floating particles */}
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0]
          }}
          transition={{
            duration: Math.random() * 4 + 3,
            repeat: Infinity,
            delay: Math.random() * 2
          }}
        />
      ))}

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        {/* Central Music Icon with Glare Effect */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, type: "spring", stiffness: 100 }}
          className="mb-12 flex justify-center"
        >
          <GlareHover intensity="strong">
            <motion.div
              className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(147, 51, 234, 0.5)",
                  "0 0 40px rgba(147, 51, 234, 0.8)",
                  "0 0 20px rgba(147, 51, 234, 0.5)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Music className="w-16 h-16 text-white" />
            </motion.div>
          </GlareHover>
        </motion.div>

        {/* Story Phases with Enhanced Text Animations */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPhase}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <SplitText
              text={storyPhases[currentPhase].title}
              className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-4 justify-center"
              variant="slideUp"
              duration={0.1}
            />
            <BlurText
              text={storyPhases[currentPhase].subtitle}
              className="text-xl md:text-2xl text-white/70 justify-center"
              delay={0.5}
            />
          </motion.div>
        </AnimatePresence>

        {/* Progress Indicators */}
        <div className="flex justify-center space-x-4 mb-12">
          {storyPhases.map((_, index) => (
            <motion.div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index <= currentPhase ? 'bg-purple-500' : 'bg-white/30'
              }`}
              animate={index === currentPhase ? {
                scale: [1, 1.3, 1],
                opacity: [0.7, 1, 0.7]
              } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          ))}
        </div>

        {/* Enhanced Continue Button */}
        <AnimatePresence>
          {showContinue && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <ClickSpark sparkCount={16} size="lg">
                <GlareHover>
                  <motion.button
                    onClick={onContinue}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl font-semibold text-white text-lg shadow-2xl overflow-hidden"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.6 }}
                    />
                    <span className="relative z-10 flex items-center gap-3">
                      Begin Your Musical Journey
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <Play className="w-5 h-5" />
                      </motion.div>
                    </span>
                  </motion.button>
                </GlareHover>
              </ClickSpark>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-6 h-6 text-purple-400/50" />
          </motion.div>
        </div>
        
        <div className="absolute bottom-20 right-20">
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          >
            <Heart className="w-8 h-8 text-pink-400/50" />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default EnhancedMusicStoryIntro