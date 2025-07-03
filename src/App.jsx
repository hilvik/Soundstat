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
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}>
      <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-black dark:via-purple-950 dark:to-black min-h-screen">
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