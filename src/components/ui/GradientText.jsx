import React from 'react'
import { motion } from 'framer-motion'

const GradientText = ({ 
  children, 
  className = "", 
  gradient = "from-purple-400 to-pink-400",
  animated = true,
  delay = 0
}) => {
  const baseClasses = "bg-gradient-to-r bg-clip-text text-transparent font-bold"
  
  const Component = animated ? motion.span : "span"
  
  const animationProps = animated ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { 
      duration: 0.6, 
      delay: delay,
      type: "spring",
      stiffness: 100 
    }
  } : {}

  return (
    <Component
      className={`${baseClasses} ${gradient} ${className}`}
      {...animationProps}
    >
      {children}
    </Component>
  )
}

export default GradientText
