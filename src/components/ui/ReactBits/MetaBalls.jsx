import React from 'react'
import { motion } from 'framer-motion'

const MetaBalls = ({ 
  count = 5,
  colors = ["#8b5cf6", "#ec4899", "#06b6d4"],
  size = "lg",
  speed = "medium",
  className = "",
  ...props 
}) => {
  const sizes = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
    xl: "w-48 h-48"
  }

  const speeds = {
    slow: 15,
    medium: 10,
    fast: 6
  }

  const balls = Array.from({ length: count }, (_, i) => ({
    id: i,
    color: colors[i % colors.length],
    delay: i * 0.5,
    x: Math.random() * 100,
    y: Math.random() * 100
  }))

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} {...props}>
      {balls.map((ball) => (
        <motion.div
          key={ball.id}
          className={`absolute ${sizes[size]} rounded-full blur-2xl opacity-30`}
          style={{
            background: `radial-gradient(circle, ${ball.color}40 0%, transparent 70%)`,
            left: `${ball.x}%`,
            top: `${ball.y}%`
          }}
          animate={{
            x: [0, 100, -50, 0],
            y: [0, -100, 50, 0],
            scale: [1, 1.2, 0.8, 1]
          }}
          transition={{
            duration: speeds[speed],
            repeat: Infinity,
            delay: ball.delay,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  )
}

export default MetaBalls