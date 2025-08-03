import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, Music, Users, TrendingUp, Star, Award, Zap } from 'lucide-react'

const TimelineEvent = ({ event, index, delay = 0 }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'artist':
        return Users
      case 'track':
        return Music
      case 'milestone':
        return TrendingUp
      case 'achievement':
        return Award
      case 'discovery':
        return Star
      case 'streak':
        return Zap
      default:
        return Calendar
    }
  }
  
  const getGradient = (type) => {
    switch (type) {
      case 'artist':
        return 'from-purple-500 to-pink-500'
      case 'track':
        return 'from-blue-500 to-purple-500'
      case 'milestone':
        return 'from-green-500 to-blue-500'
      case 'achievement':
        return 'from-yellow-500 to-orange-500'
      default:
        return 'from-indigo-500 to-purple-600'
    }
  }
  
  const Icon = getIcon(event.type)
  const gradient = getGradient(event.type)
  
  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: delay + index * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'} mb-8 relative`}
    >
      {/* Timeline line */}
      <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gray-200" />
      
      <div className={`relative w-full md:w-1/2 ${index % 2 === 0 ? 'pr-8 text-right md:text-left' : 'pl-8'}`}>
        {/* Timeline dot */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: delay + index * 0.1 + 0.3, type: "spring", stiffness: 200 }}
          className={`absolute top-6 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gradient-to-br ${gradient} rounded-full shadow-lg ring-4 ring-white`}
        />
        
        {/* Event card */}
        <motion.div
          whileHover={{ scale: 1.02, y: -4 }}
          className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 relative overflow-hidden group"
        >
          {/* Background decoration */}
          <div className={`absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br ${gradient} rounded-full opacity-10 group-hover:scale-110 transition-transform duration-300`} />
          
          <div className="relative z-10">
            <div className="flex items-start gap-4">
              <motion.div
                whileHover={{ rotate: 5, scale: 1.1 }}
                className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center text-white shadow-lg flex-shrink-0`}
              >
                <Icon className="w-6 h-6" />
              </motion.div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 text-lg">{event.title}</h4>
                  <time className="text-sm text-gray-500 font-medium">{event.date}</time>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{event.description}</p>
                
                {event.details && (
                  <div className="mt-4 flex flex-wrap gap-3">
                    {event.details.map((detail, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: delay + index * 0.1 + 0.5 + i * 0.1 }}
                        className="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-full"
                      >
                        <span className="font-semibold text-gray-900 text-sm">{detail.value}</span>
                        <span className="text-gray-500 text-xs">{detail.label}</span>
                      </motion.div>
                    ))}
                  </div>
                )}
                
                {event.link && (
                  <motion.a
                    href={event.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                  >
                    View Details
                    <ExternalLink className="w-3 h-3" />
                  </motion.a>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default TimelineEvent