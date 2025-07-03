import React, { useState } from 'react'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import { Calendar, ChevronDown, Clock } from 'lucide-react'

const TimeRangePicker = ({ selectedPeriod, onPeriodChange, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false)
  
  const periods = [
    { value: 'overall', label: 'All Time', icon: '∞', description: 'Your complete listening history' },
    { value: '12month', label: '12 Months', icon: '📅', description: 'Last 12 months' },
    { value: '6month', label: '6 Months', icon: '📊', description: 'Last 6 months' },
    { value: '3month', label: '3 Months', icon: '📈', description: 'Last 3 months' },
    { value: '1month', label: '1 Month', icon: '📋', description: 'Last 30 days' },
    { value: '7day', label: '7 Days', icon: '🔥', description: 'Last 7 days' }
  ]

  const selectedPeriodData = periods.find(p => p.value === selectedPeriod) || periods[0]

  const handleSelect = (period) => {
    onPeriodChange(period.value)
    setIsOpen(false)
  }

  return (
    <div className={`relative ${className}`}>
      <Motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-200 min-w-48"
      >
        <Calendar className="w-4 h-4" />
        <div className="flex-1 text-left">
          <div className="font-medium text-sm">{selectedPeriodData.label}</div>
          <div className="text-xs text-white/70">{selectedPeriodData.description}</div>
        </div>
        <Motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4" />
        </Motion.div>
      </Motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />
            
            {/* Dropdown */}
            <Motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full mt-2 left-0 right-0 bg-black/90 backdrop-blur-sm border border-white/20 rounded-lg shadow-2xl z-50 overflow-hidden"
            >
              {periods.map((period, index) => (
                <Motion.button
                  key={period.value}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleSelect(period)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/10 transition-all duration-200 ${
                    selectedPeriod === period.value 
                      ? 'bg-white/20 border-l-2 border-purple-500' 
                      : ''
                  }`}
                >
                  <span className="text-lg">{period.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium text-sm text-white">{period.label}</div>
                    <div className="text-xs text-white/70">{period.description}</div>
                  </div>
                  {selectedPeriod === period.value && (
                    <Motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 bg-purple-500 rounded-full"
                    />
                  )}
                </Motion.button>
              ))}
            </Motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default TimeRangePicker
