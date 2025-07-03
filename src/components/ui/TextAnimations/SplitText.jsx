import React from 'react'
import { motion } from 'framer-motion'

const SplitText = ({ 
  text, 
  className = "",
  delay = 0,
  duration = 0.05,
  variant = "slideUp",
  ...props 
}) => {
  const words = text.split(' ')

  const variants = {
    slideUp: {
      hidden: { y: 20, opacity: 0 },
      visible: { y: 0, opacity: 1 }
    },
    slideDown: {
      hidden: { y: -20, opacity: 0 },
      visible: { y: 0, opacity: 1 }
    },
    scale: {
      hidden: { scale: 0, opacity: 0 },
      visible: { scale: 1, opacity: 1 }
    },
    rotate: {
      hidden: { rotate: 90, opacity: 0 },
      visible: { rotate: 0, opacity: 1 }
    }
  }

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: duration,
        delayChildren: delay
      }
    }
  }

  const item = {
    hidden: variants[variant].hidden,
    visible: {
      ...variants[variant].visible,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200
      }
    }
  }

  return (
    <motion.div
      className={`flex flex-wrap ${className}`}
      variants={container}
      initial="hidden"
      animate="visible"
      {...props}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          variants={item}
          className="mr-2"
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  )
}

export default SplitText