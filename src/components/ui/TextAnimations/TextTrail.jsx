import React from 'react'
import { motion } from 'framer-motion'

const TextTrail = ({ 
  text, 
  className = "",
  delay = 0,
  trailColor = "rgba(147, 51, 234, 0.3)",
  ...props 
}) => {
  const letters = Array.from(text)

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: delay
      }
    }
  }

  const item = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.3
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200
      }
    }
  }

  return (
    <motion.div
      className={`flex ${className}`}
      variants={container}
      initial="hidden"
      animate="visible"
      {...props}
    >
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          variants={item}
          className={`relative ${letter === ' ' ? 'mr-2' : ''}`}
          style={{
            filter: `drop-shadow(0 0 10px ${trailColor})`
          }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </motion.div>
  )
}

export default TextTrail