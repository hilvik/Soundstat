import React from 'react'
import { motion as Motion } from 'framer-motion'

const LoadingSpinner = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8", 
    lg: "w-12 h-12",
    xl: "w-16 h-16"
  }

  return (
    <Motion.div
      className={`${sizeClasses[size]} ${className}`}
      animate={{ rotate: 360 }}
      transition={{ 
        duration: 1, 
        repeat: Infinity, 
        ease: "linear" 
      }}
    >
      <div className="w-full h-full border-2 border-purple-500/30 border-t-purple-500 rounded-full"></div>
    </Motion.div>
  )
}

export default LoadingSpinner
