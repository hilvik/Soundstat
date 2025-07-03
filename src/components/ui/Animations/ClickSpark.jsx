import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ClickSpark = ({ 
  children, 
  className = "",
  sparkCount = 8,
  color = "#8b5cf6",
  ...props 
}) => {
  const [sparks, setSparks] = useState([])

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const newSparks = Array.from({ length: sparkCount }, (_, i) => ({
      id: Date.now() + i,
      x,
      y,
      angle: (360 / sparkCount) * i,
      delay: i * 0.02
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
            className="absolute w-1 h-1 rounded-full pointer-events-none"
            style={{
              backgroundColor: color,
              left: spark.x,
              top: spark.y
            }}
            initial={{
              scale: 0,
              x: 0,
              y: 0,
              opacity: 1
            }}
            animate={{
              scale: [0, 1, 0],
              x: Math.cos((spark.angle * Math.PI) / 180) * 50,
              y: Math.sin((spark.angle * Math.PI) / 180) * 50,
              opacity: [1, 1, 0]
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.6,
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