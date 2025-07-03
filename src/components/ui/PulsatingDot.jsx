import React from 'react'
import { motion } from 'framer-motion'

const PulsatingDot = ({ 
  size = "md",
  color = "green", 
  speed = "medium",
  className = "",
  ...props 
}) => {
  const sizes = {
    xs: "w-2 h-2",
    sm: "w-3 h-3",
    md: "w-4 h-4", 
    lg: "w-6 h-6",
    xl: "w-8 h-8"
  }

  const colors = {
    green: "bg-green-500",
    red: "bg-red-500",
    blue: "bg-blue-500",
    purple: "bg-purple-500",
    pink: "bg-pink-500",
    yellow: "bg-yellow-500"
  }

  const speeds = {
    slow: 2,
    medium: 1.5,
    fast: 1
  }

  return (
    <div className={`relative ${className}`} {...props}>
      {/* Main dot */}
      <motion.div
        className={`${sizes[size]} ${colors[color]} rounded-full`}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [1, 0.8, 1]
        }}
        transition={{
          duration: speeds[speed],
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Pulse rings */}
      {[1, 2].map((ring) => (
        <motion.div
          key={ring}
          className={`absolute inset-0 ${colors[color]} rounded-full opacity-20`}
          animate={{
            scale: [1, 2, 3],
            opacity: [0.3, 0.1, 0]
          }}
          transition={{
            duration: speeds[speed] * 2,
            repeat: Infinity,
            delay: ring * 0.2,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  )
}

export default PulsatingDot