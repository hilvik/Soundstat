import React, { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import AnimatedCard from '../ui/AnimatedCard'
import GradientText from '../ui/GradientText'
import LoadingSpinner from '../ui/LoadingSpinner'

const ListeningTrendsChart = ({ data, loading = false, period = "7day" }) => {
  const [animatedData, setAnimatedData] = useState([])
  const [chartType, setChartType] = useState('area') // 'line' or 'area'
  const [activePoint, setActivePoint] = useState(null)

  useEffect(() => {
    if (data && data.length > 0) {
      // Animate data entry with staggered effect
      const timer = setTimeout(() => {
        setAnimatedData(data)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [data])

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-black/90 backdrop-blur-sm border border-white/20 rounded-lg p-4 text-white shadow-2xl"
        >
          <p className="font-semibold text-purple-300">{label}</p>
          <p className="text-lg">
            {payload[0].value.toLocaleString()} plays
          </p>
          <div className="w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mt-2" />
        </Motion.div>
      )
    }
    return null
  }

  const CustomDot = (props) => {
    const { cx, cy, index } = props
    return (
      <Motion.circle
        cx={cx}
        cy={cy}
        r={4}
        fill="#8b5cf6"
        stroke="#fff"
        strokeWidth={2}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.3,
          delay: index * 0.05,
          type: "spring",
          stiffness: 200
        }}
        whileHover={{ 
          scale: 1.5,
          fill: "#a855f7",
          transition: { duration: 0.2 }
        }}
        onMouseEnter={() => setActivePoint(index)}
        onMouseLeave={() => setActivePoint(null)}
      />
    )
  }

  const chartVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  }

  if (loading) {
    return (
      <AnimatedCard className="flex items-center justify-center h-96">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-white/70">Loading listening trends...</p>
        </div>
      </AnimatedCard>
    )
  }

  return (
    <AnimatedCard gradient className="h-96">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <GradientText className="text-2xl">
            Listening Trends
          </GradientText>
          <Motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-white/70 text-sm mt-2"
          >
            Your listening activity over time
          </Motion.p>
        </div>
        
        {/* Chart Type Toggle */}
        <Motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="flex bg-white/10 rounded-lg p-1"
        >
          <button
            onClick={() => setChartType('area')}
            className={`px-3 py-1 rounded text-xs font-medium transition-all duration-200 ${
              chartType === 'area' 
                ? 'bg-purple-500 text-white' 
                : 'text-white/70 hover:text-white'
            }`}
          >
            Area
          </button>
          <button
            onClick={() => setChartType('line')}
            className={`px-3 py-1 rounded text-xs font-medium transition-all duration-200 ${
              chartType === 'line' 
                ? 'bg-purple-500 text-white' 
                : 'text-white/70 hover:text-white'
            }`}
          >
            Line
          </button>
        </Motion.div>
      </div>

      <AnimatePresence mode="wait">
        <Motion.div
          key={`${period}-${chartType}`}
          variants={chartVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.5 }}
          className="h-80"
        >
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'area' ? (
              <AreaChart
                data={animatedData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis
                  dataKey="date"
                  stroke="#fff"
                  fontSize={12}
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <YAxis
                  stroke="#fff"
                  fontSize={12}
                  tickFormatter={(value) => value.toLocaleString()}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="playcount"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  fill="url(#colorGradient)"
                  dot={<CustomDot />}
                  activeDot={{ r: 6, fill: "#a855f7" }}
                />
              </AreaChart>
            ) : (
              <LineChart
                data={animatedData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis
                  dataKey="date"
                  stroke="#fff"
                  fontSize={12}
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <YAxis
                  stroke="#fff"
                  fontSize={12}
                  tickFormatter={(value) => value.toLocaleString()}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="playcount"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={<CustomDot />}
                  activeDot={{ r: 6, fill: "#a855f7" }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </Motion.div>
      </AnimatePresence>

      {/* Stats Summary */}
      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="mt-4 flex justify-between items-center"
      >
        <div className="flex gap-4">
          <div className="text-center">
            <div className="text-white/70 text-xs">Total Plays</div>
            <div className="text-white font-bold">
              {animatedData.reduce((sum, item) => sum + item.playcount, 0).toLocaleString()}
            </div>
          </div>
          <div className="text-center">
            <div className="text-white/70 text-xs">Daily Average</div>
            <div className="text-white font-bold">
              {Math.round(animatedData.reduce((sum, item) => sum + item.playcount, 0) / animatedData.length).toLocaleString()}
            </div>
          </div>
          <div className="text-center">
            <div className="text-white/70 text-xs">Peak Day</div>
            <div className="text-white font-bold">
              {Math.max(...animatedData.map(item => item.playcount)).toLocaleString()}
            </div>
          </div>
        </div>
        
        <Motion.div
          animate={{ 
            scale: activePoint !== null ? 1.1 : 1,
            opacity: activePoint !== null ? 1 : 0.7
          }}
          className="w-3 h-3 bg-purple-500 rounded-full"
        />
      </Motion.div>
    </AnimatedCard>
  )
}

export default ListeningTrendsChart
