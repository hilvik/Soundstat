import React from 'react'
import { motion } from 'framer-motion'

const BlurText = ({ 
  text, 
  className = "",
  delay = 0,
  duration = 0.8,
  stagger = 0.03,
  ...props 
}) => {
  const letters = Array.from(text)

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: delay
      }
    }
  }

  const item = {
    hidden: {
      opacity: 0,
      filter: "blur(10px)",
      y: 20
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        duration: duration,
        ease: [0.25, 0.46, 0.45, 0.94]
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
          className={letter === ' ' ? 'mr-2' : ''}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </motion.div>
  )
}

export default BlurText