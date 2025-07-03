import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const ParallaxText = ({ 
  children, 
  speed = 0.5, 
  className = "",
  direction = "up",
  ...props 
}) => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const directions = {
    up: useTransform(scrollYProgress, [0, 1], [0, -100 * speed]),
    down: useTransform(scrollYProgress, [0, 1], [0, 100 * speed]),
    left: useTransform(scrollYProgress, [0, 1], [0, -100 * speed]),
    right: useTransform(scrollYProgress, [0, 1], [0, 100 * speed])
  }

  const transform = direction === 'left' || direction === 'right' 
    ? { x: directions[direction] }
    : { y: directions[direction] }

  return (
    <motion.div
      ref={ref}
      style={transform}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default ParallaxText