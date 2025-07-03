import React from 'react'
import { useThemeStore } from '../../store/themeStore'
import { Sun, Moon, Music } from 'lucide-react'

const Header = () => {
  const { isDarkMode, toggleTheme } = useThemeStore()

  return (
    <header className="glass-card m-4 p-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <Music className="h-8 w-8 text-purple-400" />
        <h1 className="text-2xl font-bold gradient-text">
          Music Dashboard
        </h1>
      </div>
      
      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 transition-colors duration-200"
      >
        {isDarkMode ? (
          <Sun className="h-5 w-5 text-yellow-400" />
        ) : (
          <Moon className="h-5 w-5 text-purple-400" />
        )}
      </button>
    </header>
  )
}

export default Header