import React, { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Home, TrendingUp, Users, Music, Clock, Settings, Search } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const PremiumNav = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()
  const { scrollY } = useScroll()
  const navOpacity = useTransform(scrollY, [0, 100], [0.8, 1])
  const navBlur = useTransform(scrollY, [0, 100], [10, 20])
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  const navItems = [
    { path: '/', icon: Home, label: 'Overview' },
    { path: '/timeline', icon: Clock, label: 'Timeline' },
    { path: '/artists', icon: Users, label: 'Artists' },
    { path: '/tracks', icon: Music, label: 'Tracks' },
    { path: '/insights', icon: TrendingUp, label: 'Insights' },
  ]
  
  return (
    <motion.nav
      style={{ 
        opacity: navOpacity,
        backdropFilter: `blur(${navBlur}px)`
      }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'py-4' : 'py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Music className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Soundscape</h1>
            </motion.div>
          </Link>
          
          {/* Center Navigation */}
          <div className="hidden md:flex items-center gap-2 bg-white/80 backdrop-blur-xl rounded-2xl p-2 shadow-lg border border-gray-100">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path
              const Icon = item.icon
              
              return (
                <Link key={item.path} to={item.path}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                      isActive 
                        ? 'bg-gray-900 text-white shadow-lg' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gray-900 rounded-xl -z-10"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </motion.button>
                </Link>
              )
            })}
          </div>
          
          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <Search className="w-4 h-4 text-gray-700" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <Settings className="w-4 h-4 text-gray-700" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

export default PremiumNav