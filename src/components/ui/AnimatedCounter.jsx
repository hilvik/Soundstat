import React, { useEffect, useState } from 'react'
import { motion as Motion, useMotionValue, animate } from 'framer-motion'

const AnimatedCounter = ({ 
  value, 
  duration = 2, 
  className = "",
  suffix = "",
  prefix = "",
  delay = 0
}) => {
  const [displayValue, setDisplayValue] = useState(0)
  const motionValue = useMotionValue(0)

  useEffect(() => {
    const timeout = setTimeout(() => {
      const controls = animate(motionValue, value, {
        duration: duration,
        ease: "easeOut",
        onUpdate: (latest) => {
          setDisplayValue(latest)
        }
      })
      return controls.stop
    }, delay * 1000)

    return () => clearTimeout(timeout)
  }, [value, duration, delay, motionValue])

  return (
    <Motion.span
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay: delay,
        type: "spring",
        stiffness: 200
      }}
      className={`font-bold tabular-nums ${className}`}
    >
      {prefix}
      {Math.round(displayValue).toLocaleString()}
      {suffix}
    </Motion.span>
  )
}

export default AnimatedCounter
