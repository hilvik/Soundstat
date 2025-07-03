import React, { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import AnimatedCard from '../ui/AnimatedCard'
import GradientText from '../ui/GradientText'
import LoadingSpinner from '../ui/LoadingSpinner'

const GenreDistributionChart = ({ data, loading = false }) => {
  const [animatedData, setAnimatedData] = useState([])
  const [activeIndex, setActiveIndex] = useState(null)
  const [viewMode, setViewMode] = useState('donut') // 'donut' or 'pie'

  const colors = [
    '#8b5cf6', '#a855f7', '#c084fc', '#d8b4fe', '#e9d5ff',
    '#ec4899', '#f472b6', '#fb7185', '#fda4af', '#fecaca',
    '#06b6d4', '#0891b2', '#0e7490', '#155e75', '#164e63',
    '#10b981', '#059669', '#047857', '#065f46', '#064e3b'
  ]

  useEffect(() => {
    if (data && data.length > 0) {
      // Animate data entry
      const timer = setTimeout(() => {
        setAnimatedData(data)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [data])

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <Motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-black/90 backdrop-blur-sm border border-white/20 rounded-lg p-4 text-white shadow-2xl"
        >
          <p className="font-semibold text-purple-300">{data.genre}</p>
          <p className="text-lg">{data.count.toLocaleString()} tracks</p>
          <p className="text-sm text-white/70">{data.percentage}%</p>
          <div 
            className="w-full h-1 rounded-full mt-2"
            style={{ backgroundColor: data.color }}
          />
        </Motion.div>
      )
    }
    return null
  }

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    if (percent < 0.05) return null // Don't show labels for slices < 5%
    
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <Motion.text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 + index * 0.1 }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </Motion.text>
    )
  }

  const CustomCell = ({ index, ...props }) => {
    return (
      <motion.g
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.6,
          delay: index * 0.1,
          type: "spring",
          stiffness: 100
        }}
        whileHover={{ scale: 1.05 }}
        onMouseEnter={() => setActiveIndex(index)}
        onMouseLeave={() => setActiveIndex(null)}
      >
        <Cell
          {...props}
          fill={colors[index % colors.length]}
          stroke={activeIndex === index ? '#fff' : 'none'}
          strokeWidth={activeIndex === index ? 2 : 0}
        />
      </motion.g>
    )
  }

  if (loading) {
    return (
      <AnimatedCard className="flex items-center justify-center h-96">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-white/70">Loading genre distribution...</p>
        </div>
      </AnimatedCard>
    )
  }

  return (
    <AnimatedCard gradient className="h-96">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <GradientText className="text-2xl">
            Genre Distribution
          </GradientText>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-white/70 text-sm mt-2"
          >
            Your musical taste breakdown
          </motion.p>
        </div>
        
        {/* View Mode Toggle */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="flex bg-white/10 rounded-lg p-1"
        >
          <button
            onClick={() => setViewMode('donut')}
            className={`px-3 py-1 rounded text-xs font-medium transition-all duration-200 ${
              viewMode === 'donut' 
                ? 'bg-purple-500 text-white' 
                : 'text-white/70 hover:text-white'
            }`}
          >
            Donut
          </button>
          <button
            onClick={() => setViewMode('pie')}
            className={`px-3 py-1 rounded text-xs font-medium transition-all duration-200 ${
              viewMode === 'pie' 
                ? 'bg-purple-500 text-white' 
                : 'text-white/70 hover:text-white'
            }`}
          >
            Pie
          </button>
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5 }}
          className="h-80 flex"
        >
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={animatedData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={<CustomLabel />}
                  outerRadius={viewMode === 'donut' ? 100 : 110}
                  innerRadius={viewMode === 'donut' ? 60 : 0}
                  fill="#8884d8"
                  dataKey="count"
                  paddingAngle={2}
                >
                  {animatedData.map((entry, index) => (
                    <CustomCell key={`cell-${index}`} index={index} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Legend */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="w-40 pl-4 overflow-y-auto"
          >
            <div className="space-y-2">
              {animatedData.map((entry, index) => (
                <motion.div
                  key={entry.genre}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.05 }}
                  className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-all duration-200 ${
                    activeIndex === index 
                      ? 'bg-white/20 scale-105' 
                      : 'hover:bg-white/10'
                  }`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: colors[index % colors.length] }}
                  />
                  <div className="flex-1 text-xs">
                    <div className="text-white font-medium truncate">{entry.genre}</div>
                    <div className="text-white/70">{entry.count.toLocaleString()}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="mt-4 flex justify-between items-center text-sm"
      >
        <div className="flex gap-4">
          <div className="text-center">
            <div className="text-white/70 text-xs">Total Genres</div>
            <div className="text-white font-bold">{animatedData.length}</div>
          </div>
          <div className="text-center">
            <div className="text-white/70 text-xs">Top Genre</div>
            <div className="text-white font-bold">
              {animatedData.length > 0 ? animatedData[0].genre : 'N/A'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-white/70 text-xs">Diversity</div>
            <div className="text-white font-bold">
              {animatedData.length > 5 ? 'High' : animatedData.length > 2 ? 'Medium' : 'Low'}
            </div>
          </div>
        </div>
        
        <motion.div
          animate={{ 
            rotate: activeIndex !== null ? 180 : 0,
            scale: activeIndex !== null ? 1.2 : 1
          }}
          className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
        />
      </motion.div>
    </AnimatedCard>
  )
}

export default GenreDistributionChart
