import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ClickSpark = ({ 
  children, 
  className = "",
  sparkCount = 12,
  colors = ["#8b5cf6", "#ec4899", "#06b6d4", "#10b981"],
  size = "md",
  ...props 
}) => {
  const [sparks, setSparks] = useState([])

  const sizes = {
    sm: { width: 2, height: 2, distance: 30 },
    md: { width: 3, height: 3, distance: 50 },
    lg: { width: 4, height: 4, distance: 70 }
  }

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const newSparks = Array.from({ length: sparkCount }, (_, i) => ({
      id: Date.now() + i,
      x,
      y,
      angle: (360 / sparkCount) * i,
      delay: i * 0.02,
      color: colors[Math.floor(Math.random() * colors.length)]
    }))
    
    setSparks(prev => [...prev, ...newSparks])
    
    // Clean up sparks after animation
    setTimeout(() => {
      setSparks(prev => prev.filter(spark => !newSparks.includes(spark)))
    }, 1000)
  }

  return (
    <motion.div
      onClick={handleClick}
      className={`relative overflow-hidden ${className}`}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {children}
      
      <AnimatePresence>
        {sparks.map((spark) => (
          <motion.div
            key={spark.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              backgroundColor: spark.color,
              width: sizes[size].width,
              height: sizes[size].height,
              left: spark.x - sizes[size].width / 2,
              top: spark.y - sizes[size].height / 2,
              boxShadow: `0 0 10px ${spark.color}`
            }}
            initial={{
              scale: 0,
              x: 0,
              y: 0,
              opacity: 1
            }}
            animate={{
              scale: [0, 1, 0],
              x: Math.cos((spark.angle * Math.PI) / 180) * sizes[size].distance,
              y: Math.sin((spark.angle * Math.PI) / 180) * sizes[size].distance,
              opacity: [1, 1, 0]
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.8,
              delay: spark.delay,
              ease: "easeOut"
            }}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  )
}

export default ClickSpark