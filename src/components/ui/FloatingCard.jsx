import React from 'react'
import { motion } from 'framer-motion'

const FloatingCard = ({ 
  children, 
  className = "", 
  delay = 0,
  direction = "up",
  intensity = "medium",
  hover = true,
  ...props 
}) => {
  const directions = {
    up: { y: 20 },
    down: { y: -20 },
    left: { x: 20 },
    right: { x: -20 },
    scale: { scale: 0.8 }
  }

  const intensities = {
    subtle: { duration: 0.4, y: -2, scale: 1.01 },
    medium: { duration: 0.3, y: -8, scale: 1.03 },
    strong: { duration: 0.2, y: -12, scale: 1.05 }
  }

  const hoverEffect = hover ? {
    y: intensities[intensity].y,
    scale: intensities[intensity].scale,
    transition: { duration: intensities[intensity].duration }
  } : {}

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        ...directions[direction] 
      }}
      animate={{ 
        opacity: 1, 
        x: 0, 
        y: 0, 
        scale: 1 
      }}
      transition={{ 
        duration: 0.6, 
        delay,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      whileHover={hoverEffect}
      className={`
        backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl
        shadow-2xl transition-all duration-300
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default FloatingCard