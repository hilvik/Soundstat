import React from 'react'
import { motion } from 'framer-motion'
import { Sun, Moon, Coffee, Sunset } from 'lucide-react'

const ListeningPatterns = ({ stats }) => {
  const timeOfDay = [
    { period: 'Morning', icon: Coffee, percentage: 25, time: '6AM - 12PM' },
    { period: 'Afternoon', icon: Sun, percentage: 35, time: '12PM - 6PM' },
    { period: 'Evening', icon: Sunset, percentage: 30, time: '6PM - 12AM' },
    { period: 'Night', icon: Moon, percentage: 10, time: '12AM - 6AM' }
  ]
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100"
    >
      <h3 className="text-2xl font-semibold text-gray-900 mb-8">Listening Patterns</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {timeOfDay.map((period, index) => {
          const Icon = period.icon
          return (
            <motion.div
              key={period.period}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                <Icon className="w-8 h-8" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">{period.period}</h4>
              <p className="text-sm text-gray-600 mb-2">{period.time}</p>
              <p className="text-2xl font-bold text-gray-900">{period.percentage}%</p>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

export default ListeningPatterns