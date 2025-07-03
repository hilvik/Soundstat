import React, { useRef } from 'react'
import { motion } from 'framer-motion'

const SpotlightCard = ({ 
  children, 
  className = "",
  spotlightColor = "rgba(147, 51, 234, 0.3)",
  ...props 
}) => {
  const ref = useRef(null)

  const handleMouseMove = (e) => {
    if (!ref.current) return
    
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    ref.current.style.setProperty('--spotlight-x', `${x}px`)
    ref.current.style.setProperty('--spotlight-y', `${y}px`)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={`
        relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 
        rounded-2xl group cursor-pointer ${className}
      `}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {/* Spotlight effect */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(300px circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), ${spotlightColor}, transparent 70%)`
        }}
      />
      
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  )
}

export default SpotlightCard