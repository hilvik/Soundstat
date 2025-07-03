import React from 'react'
import { motion } from 'framer-motion'
import StaggeredText from '../ui/StaggeredText'
import GlowingOrb from '../ui/GlowingOrb'

const ChapterTransition = ({ 
  chapterNumber, 
  title, 
  subtitle, 
  icon: Icon,
  color = "purple",
  onComplete 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
    >
      <div className="text-center max-w-2xl mx-auto px-6">
        {/* Chapter Number */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
          className="mb-8"
        >
          <GlowingOrb size="lg" color={color} intensity="strong">
            <Icon className="w-12 h-12" />
          </GlowingOrb>
        </motion.div>

        {/* Chapter Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mb-4"
        >
          <div className="text-sm font-medium text-white/60 mb-2">
            Chapter {chapterNumber}
          </div>
          <StaggeredText
            text={title}
            className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent"
            delay={1.2}
            duration={0.08}
          />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="text-lg text-white/70 mb-8"
        >
          {subtitle}
        </motion.p>

        {/* Continue Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.5 }}
          onClick={onComplete}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white font-medium hover:bg-white/20 transition-all duration-300"
        >
          Continue
        </motion.button>
      </div>
    </motion.div>
  )
}

export default ChapterTransition