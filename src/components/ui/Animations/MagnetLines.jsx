import React, { useRef, useState } from 'react'
import { motion } from 'framer-motion'

const MagnetLines = ({ 
  children, 
  className = "",
  lineCount = 8,
  color = "rgba(147, 51, 234, 0.5)",
  ...props 
}) => {
  const ref = useRef(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e) => {
    if (!ref.current) return
    
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    
    setMousePosition({ x, y })
  }

  const lines = Array.from({ length: lineCount }, (_, i) => {
    const angle = (360 / lineCount) * i
    const length = isHovered ? 100 : 0
    
    return {
      angle,
      length,
      x: Math.cos((angle * Math.PI) / 180) * length,
      y: Math.sin((angle * Math.PI) / 180) * length
    }
  })

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative ${className}`}
      {...props}
    >
      {children}
      
      {/* Magnetic lines */}
      <svg
        className="absolute inset-0 pointer-events-none"
        style={{ overflow: 'visible' }}
      >
        {lines.map((line, index) => (
          <motion.line
            key={index}
            x1="50%"
            y1="50%"
            x2={`calc(50% + ${line.x}px)`}
            y2={`calc(50% + ${line.y}px)`}
            stroke={color}
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: isHovered ? 1 : 0,
              opacity: isHovered ? 1 : 0
            }}
            transition={{ 
              duration: 0.3,
              delay: index * 0.05
            }}
          />
        ))}
      </svg>
    </motion.div>
  )
}

export default MagnetLines