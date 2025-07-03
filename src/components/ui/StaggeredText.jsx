import React from 'react'
import { motion } from 'framer-motion'

const StaggeredText = ({ 
  text, 
  className = "",
  delay = 0,
  duration = 0.05,
  ...props 
}) => {
  const letters = Array.from(text)

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { 
        staggerChildren: duration, 
        delayChildren: delay * i 
      }
    })
  }

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200
      }
    },
    hidden: {
      opacity: 0,
      y: 20,
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
          variants={child}
          key={index}
          className={letter === ' ' ? 'mr-2' : ''}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </motion.div>
  )
}

export default StaggeredText