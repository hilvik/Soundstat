import React from 'react'
import { motion as Motion } from 'framer-motion'

const AnimatedCard = ({ 
  children, 
  className = "", 
  delay = 0, 
  hover = true,
  gradient = false,
  ...props 
}) => {
  const baseClasses = "backdrop-blur-sm border border-white/10 rounded-xl p-6 transition-all duration-300"
  const gradientClasses = gradient ? "bg-gradient-to-br from-purple-500/10 to-pink-500/10" : "bg-white/5"
  
  return (
    <Motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: delay,
        type: "spring",
        stiffness: 100 
      }}
      whileHover={hover ? { 
        y: -5,
        scale: 1.02,
        boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
      } : {}}
      className={`${baseClasses} ${gradientClasses} ${className}`}
      {...props}
    >
      {children}
    </Motion.div>
  )
}

export default AnimatedCard
