import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/redesign/Dashboard'
import Timeline from './pages/redesign/Timeline'
import Artists from './pages/redesign/Artists'
import Tracks from './pages/redesign/Tracks'
import Insights from './pages/redesign/Insights'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Redesigned Routes */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/artists" element={<Artists />} />
        <Route path="/tracks" element={<Tracks />} />
        <Route path="/insights" element={<Insights />} />
        
        {/* Redirect old routes to new ones */}
        <Route path="/dashboard/*" element={<Navigate to="/" replace />} />
        <Route path="/albums" element={<Navigate to="/tracks" replace />} />
        
        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

// 404 Component
const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-9xl font-bold text-gray-200">404</h1>
      <p className="text-xl text-gray-600 mt-4">Page not found</p>
      <a href="/" className="mt-6 inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors">
        Go Home
      </a>
    </div>
  </div>
)

export default App