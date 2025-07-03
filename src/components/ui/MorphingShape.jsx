import React from 'react'
import { motion } from 'framer-motion'

const MorphingShape = ({ 
  variant = "blob",
  size = "md",
  color = "purple",
  speed = "medium",
  className = "",
  ...props 
}) => {
  const sizes = {
    sm: "w-16 h-16",
    md: "w-32 h-32", 
    lg: "w-48 h-48",
    xl: "w-64 h-64"
  }

  const colors = {
    purple: "bg-gradient-to-br from-purple-400/20 to-purple-600/20",
    pink: "bg-gradient-to-br from-pink-400/20 to-pink-600/20",
    blue: "bg-gradient-to-br from-blue-400/20 to-blue-600/20",
    green: "bg-gradient-to-br from-green-400/20 to-green-600/20"
  }

  const speeds = {
    slow: 8,
    medium: 5,
    fast: 3
  }

  const variants = {
    blob: {
      borderRadius: [
        "60% 40% 30% 70%/60% 30% 70% 40%",
        "30% 60% 70% 40%/50% 60% 30% 60%", 
        "60% 40% 30% 70%/60% 30% 70% 40%"
      ]
    },
    circle: {
      borderRadius: ["50%", "40%", "50%"]
    },
    square: {
      borderRadius: ["0%", "25%", "0%"]
    }
  }

  return (
    <motion.div
      className={`
        ${sizes[size]} ${colors[color]} ${className}
        absolute blur-3xl opacity-30
      `}
      animate={variants[variant]}
      transition={{
        duration: speeds[speed],
        repeat: Infinity,
        ease: "easeInOut"
      }}
      {...props}
    />
  )
}

export default MorphingShape