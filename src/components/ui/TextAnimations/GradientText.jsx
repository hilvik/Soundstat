import React from 'react'
import { motion } from 'framer-motion'

const GradientText = ({ 
  children, 
  className = "",
  gradient = "from-purple-400 via-pink-500 to-purple-600",
  animated = true,
  delay = 0,
  shimmer = false,
  ...props 
}) => {
  const baseClasses = "bg-gradient-to-r bg-clip-text text-transparent font-bold"
  
  return (
    <motion.span
      className={`${baseClasses} ${gradient} ${className} ${shimmer ? 'relative overflow-hidden' : ''}`}
      initial={animated ? { opacity: 0, y: 20 } : {}}
      animate={animated ? { opacity: 1, y: 0 } : {}}
      transition={animated ? { 
        duration: 0.6, 
        delay: delay,
        type: "spring",
        stiffness: 100 
      } : {}}
      {...props}
    >
      {shimmer && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      )}
      {children}
    </motion.span>
  )
}

export default GradientText