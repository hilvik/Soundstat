import React, { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'

const AnimatedStatCard = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color = 'indigo',
  delay = 0 
}) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [isHovered, setIsHovered] = useState(false)
  
  const colorClasses = {
    indigo: 'from-indigo-500 to-purple-600',
    pink: 'from-pink-500 to-rose-600',
    emerald: 'from-emerald-500 to-green-600',
    amber: 'from-amber-500 to-orange-600'
  }
  
  const formatValue = (val) => {
    if (typeof val === 'number') {
      if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`
      if (val >= 1000) return `${(val / 1000).toFixed(1)}K`
      return val.toLocaleString()
    }
    return val
  }
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative"
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 overflow-hidden"
      >
        {/* Background decoration */}
        <motion.div
          className={`absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br ${colorClasses[color]} rounded-full opacity-10`}
          animate={{
            scale: isHovered ? 1.2 : 1,
            rotate: isHovered ? 45 : 0
          }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Icon */}
        <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color]} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        
        {/* Title */}
        <h4 className="text-sm font-medium text-gray-500 mb-2">{title}</h4>
        
        {/* Value with animation */}
        <div className="flex items-end justify-between">
          <motion.div
            className="text-3xl font-bold text-gray-900"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.5, delay: delay + 0.2 }}
          >
            {formatValue(value)}
          </motion.div>
          
          {/* Change indicator */}
          {change && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
              transition={{ duration: 0.5, delay: delay + 0.3 }}
              className={`flex items-center gap-1 text-sm font-medium ${
                change > 0 ? 'text-emerald-600' : 'text-red-600'
              }`}
            >
              {change > 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>{Math.abs(change)}%</span>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default AnimatedStatCard