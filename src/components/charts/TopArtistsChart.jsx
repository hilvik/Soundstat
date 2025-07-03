import React, { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import AnimatedCard from '../ui/AnimatedCard'
import GradientText from '../ui/GradientText'
import LoadingSpinner from '../ui/LoadingSpinner'

const TopArtistsChart = ({ data, loading = false, period = "overall" }) => {
  const [animatedData, setAnimatedData] = useState([])
  const [hoveredIndex, setHoveredIndex] = useState(null)

  const colors = [
    '#8b5cf6', '#a855f7', '#c084fc', '#d8b4fe', '#e9d5ff',
    '#ec4899', '#f472b6', '#fb7185', '#fda4af', '#fecaca'
  ]

  useEffect(() => {
    if (data && data.length > 0) {
      // Animate data entry
      const timer = setTimeout(() => {
        setAnimatedData(data.slice(0, 10))
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [data])

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-black/80 backdrop-blur-sm border border-white/20 rounded-lg p-3 text-white"
        >
          <p className="font-semibold">{label}</p>
          <p className="text-purple-300">
            {payload[0].value.toLocaleString()} plays
          </p>
        </Motion.div>
      )
    }
    return null
  }

  const CustomBar = (props) => {
    const { index, x, y, width, height, fill } = props
    return (
      <Motion.rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        rx={4}
        initial={{ height: 0, y: y + height }}
        animate={{ height, y }}
        transition={{
          duration: 0.8,
          delay: index * 0.1,
          type: "spring",
          stiffness: 100
        }}
        whileHover={{ 
          filter: "brightness(1.2)",
          scale: 1.05,
          transition: { duration: 0.2 }
        }}
        onMouseEnter={() => setHoveredIndex(index)}
        onMouseLeave={() => setHoveredIndex(null)}
      />
    )
  }

  if (loading) {
    return (
      <AnimatedCard className="flex items-center justify-center h-96">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-white/70">Loading your top artists...</p>
        </div>
      </AnimatedCard>
    )
  }

  return (
    <AnimatedCard gradient className="h-96">
      <div className="mb-6">
        <GradientText className="text-2xl">
          Top Artists
        </GradientText>
        <Motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-white/70 text-sm mt-2"
        >
          Your most played artists ({period})
        </Motion.p>
      </div>

      <AnimatePresence mode="wait">
        <Motion.div
          key={period}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
          className="h-80"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={animatedData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="name"
                stroke="#fff"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
              />
              <YAxis
                stroke="#fff"
                fontSize={12}
                tickFormatter={(value) => value.toLocaleString()}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="playcount"
                shape={<CustomBar />}
                radius={[4, 4, 0, 0]}
              >
                {animatedData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Motion.div>
      </AnimatePresence>

      {/* Artist highlight cards */}
      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="mt-4 flex gap-2 overflow-x-auto pb-2"
      >
        {animatedData.slice(0, 5).map((artist, index) => (
          <Motion.div
            key={artist.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2 + index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs ${
              hoveredIndex === index 
                ? 'bg-white/20 border border-white/30' 
                : 'bg-white/10 border border-white/20'
            } transition-all duration-200`}
          >
            <div className="text-white font-medium">{artist.name}</div>
            <div className="text-purple-300">{artist.playcount.toLocaleString()}</div>
          </Motion.div>
        ))}
      </Motion.div>
    </AnimatedCard>
  )
}

export default TopArtistsChart
