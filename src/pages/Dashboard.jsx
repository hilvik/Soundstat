import React from 'react'

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h2 className="text-3xl font-bold gradient-text mb-4">
          Welcome to Your Music Universe
        </h2>
        <p className="text-gray-300">
          Your musical journey awaits. Let's explore your listening history!
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Placeholder stat cards */}
        <div className="music-card">
          <h3 className="font-semibold text-purple-300">Total Scrobbles</h3>
          <p className="text-2xl font-bold text-white">Loading...</p>
        </div>
        <div className="music-card">
          <h3 className="font-semibold text-purple-300">Top Artist</h3>
          <p className="text-2xl font-bold text-white">Loading...</p>
        </div>
        <div className="music-card">
          <h3 className="font-semibold text-purple-300">Hours Listened</h3>
          <p className="text-2xl font-bold text-white">Loading...</p>
        </div>
        <div className="music-card">
          <h3 className="font-semibold text-purple-300">Artists Discovered</h3>
          <p className="text-2xl font-bold text-white">Loading...</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard