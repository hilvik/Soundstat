import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { useThemeStore } from './store/themeStore'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Artists from './pages/Artists'
import Tracks from './pages/Tracks'
import Albums from './pages/Albums'
import Insights from './pages/Insights'

function App() {
  const { isDarkMode } = useThemeStore()

  return (
    <div className={`min-h-screen transition-all duration-500 ${isDarkMode ? 'dark' : ''}`}>
      <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-black dark:via-purple-950 dark:to-black min-h-screen">
        {/* Background Pattern */}
        <div className="fixed inset-0 opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(255,255,255,0.1)_1px,_transparent_0)] bg-[size:20px_20px]" />
        </div>
        
        {/* Animated Background Orbs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        </div>
        
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/artists" element={<Artists />} />
            <Route path="/tracks" element={<Tracks />} />
            <Route path="/albums" element={<Albums />} />
            <Route path="/insights" element={<Insights />} />
          </Routes>
        </Layout>
      </div>
    </div>
  )
}

export default App