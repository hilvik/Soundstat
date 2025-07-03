import React from 'react'
import { motion } from 'framer-motion'

const GlowingOrb = ({ 
  size = "md", 
  color = "purple", 
  intensity = "medium",
  animate = true,
  className = "",
  children,
  ...props 
}) => {
  const sizes = {
    xs: "w-4 h-4",
    sm: "w-8 h-8", 
    md: "w-16 h-16",
    lg: "w-24 h-24",
    xl: "w-32 h-32"
  }

  const colors = {
    purple: {
      bg: "bg-gradient-to-br from-purple-400 to-purple-600",
      glow: "shadow-purple-500/50",
      pulse: "shadow-purple-500/75"
    },
    pink: {
      bg: "bg-gradient-to-br from-pink-400 to-pink-600", 
      glow: "shadow-pink-500/50",
      pulse: "shadow-pink-500/75"
    },
    blue: {
      bg: "bg-gradient-to-br from-blue-400 to-blue-600",
      glow: "shadow-blue-500/50", 
      pulse: "shadow-blue-500/75"
    },
    green: {
      bg: "bg-gradient-to-br from-green-400 to-green-600",
      glow: "shadow-green-500/50",
      pulse: "shadow-green-500/75"
    }
  }

  const intensities = {
    subtle: "shadow-lg",
    medium: "shadow-xl", 
    strong: "shadow-2xl"
  }

  const animationProps = animate ? {
    animate: {
      boxShadow: [
        `0 0 20px ${colors[color].glow}`,
        `0 0 40px ${colors[color].pulse}`,
        `0 0 20px ${colors[color].glow}`
      ]
    },
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  } : {}

  return (
    <motion.div
      className={`
        ${sizes[size]} ${colors[color].bg} ${colors[color].glow} ${intensities[intensity]}
        rounded-full flex items-center justify-center relative overflow-hidden
        ${className}
      `}
      {...animationProps}
      {...props}
    >
      {/* Inner glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full" />
      
      {/* Content */}
      <div className="relative z-10 text-white">
        {children}
      </div>
    </motion.div>
  )
}

export default GlowingOrb