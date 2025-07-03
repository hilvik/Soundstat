import React, { useRef } from 'react'
import { motion } from 'framer-motion'

const GlareHover = ({ 
  children, 
  className = "",
  intensity = "medium",
  glareColor = "rgba(255, 255, 255, 0.4)",
  ...props 
}) => {
  const ref = useRef(null)

  const intensities = {
    subtle: "opacity-20",
    medium: "opacity-40", 
    strong: "opacity-60"
  }

  const handleMouseMove = (e) => {
    if (!ref.current) return
    
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    ref.current.style.setProperty('--mouse-x', `${x}px`)
    ref.current.style.setProperty('--mouse-y', `${y}px`)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={`relative overflow-hidden group ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
      
      {/* Glare effect */}
      <div
        className={`absolute inset-0 pointer-events-none ${intensities[intensity]} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${glareColor}, transparent 40%)`
        }}
      />
    </motion.div>
  )
}

export default GlareHover