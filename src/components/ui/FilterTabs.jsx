import React, { useState } from 'react'
import { motion as Motion, AnimatePresence } from 'framer-motion'

const FilterTabs = ({ 
  tabs, 
  activeTab, 
  onTabChange, 
  className = "",
  variant = "default" // "default", "pills", "underline"
}) => {
  const [hoveredTab, setHoveredTab] = useState(null)

  const baseClasses = {
    default: "bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-1",
    pills: "bg-white/5 backdrop-blur-sm rounded-full p-1",
    underline: "border-b border-white/20"
  }

  const tabClasses = {
    default: "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
    pills: "px-6 py-2 rounded-full text-sm font-medium transition-all duration-200",
    underline: "px-4 py-3 text-sm font-medium transition-all duration-200 relative"
  }

  const activeClasses = {
    default: "bg-white/20 text-white shadow-lg",
    pills: "bg-white/20 text-white shadow-lg",
    underline: "text-white"
  }

  const inactiveClasses = {
    default: "text-white/70 hover:text-white hover:bg-white/10",
    pills: "text-white/70 hover:text-white hover:bg-white/10",
    underline: "text-white/70 hover:text-white"
  }

  return (
    <div className={`${baseClasses[variant]} ${className}`}>
      <div className="flex">
        {tabs.map((tab) => (
          <Motion.button
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            onMouseEnter={() => setHoveredTab(tab.value)}
            onMouseLeave={() => setHoveredTab(null)}
            className={`${tabClasses[variant]} ${
              activeTab === tab.value 
                ? activeClasses[variant] 
                : inactiveClasses[variant]
            } flex items-center gap-2 relative`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Icon */}
            {tab.icon && (
              <Motion.div
                animate={{ 
                  rotate: hoveredTab === tab.value ? 10 : 0,
                  scale: activeTab === tab.value ? 1.1 : 1
                }}
                transition={{ duration: 0.2 }}
                className="w-4 h-4"
              >
                {tab.icon}
              </Motion.div>
            )}
            
            {/* Label */}
            <span>{tab.label}</span>
            
            {/* Badge */}
            {tab.badge && (
              <Motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full"
              >
                {tab.badge}
              </Motion.span>
            )}

            {/* Active indicator for underline variant */}
            {variant === 'underline' && activeTab === tab.value && (
              <Motion.div
                layoutId="activeTabIndicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500 rounded-full"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}

            {/* Hover effect */}
            {hoveredTab === tab.value && variant !== 'underline' && (
              <Motion.div
                layoutId="hoverBackground"
                className="absolute inset-0 bg-white/5 rounded-md"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </Motion.button>
        ))}
      </div>
    </div>
  )
}

export default FilterTabs
