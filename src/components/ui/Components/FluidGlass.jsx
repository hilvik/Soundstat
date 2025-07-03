import React from 'react'
import { motion } from 'framer-motion'

const FluidGlass = ({ 
  children, 
  className = "",
  variant = "default",
  intensity = "medium",
  ...props 
}) => {
  const variants = {
    default: "bg-white/10 border-white/20",
    strong: "bg-white/20 border-white/30",
    subtle: "bg-white/5 border-white/10"
  }

  const intensities = {
    subtle: "backdrop-blur-sm",
    medium: "backdrop-blur-md",
    strong: "backdrop-blur-xl"
  }

  return (
    <motion.div
      className={`
        ${variants[variant]} ${intensities[intensity]}
        border rounded-2xl shadow-2xl relative overflow-hidden
        ${className}
      `}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 25px 50px rgba(0, 0, 0, 0.25)"
      }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {/* Fluid animation overlay */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            "radial-gradient(circle at 20% 50%, rgba(147, 51, 234, 0.3) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.3) 0%, transparent 50%)",
            "radial-gradient(circle at 40% 80%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 50%, rgba(147, 51, 234, 0.3) 0%, transparent 50%)"
          ]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  )
}

export default FluidGlass