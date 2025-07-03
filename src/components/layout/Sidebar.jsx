import React from 'react'
import { NavLink } from 'react-router-dom'
import { Home, Users, Music, Disc, BarChart3 } from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Artists', href: '/artists', icon: Users },
  { name: 'Tracks', href: '/tracks', icon: Music },
  { name: 'Albums', href: '/albums', icon: Disc },
  { name: 'Insights', href: '/insights', icon: BarChart3 },
]

const Sidebar = () => {
  return (
    <aside className="w-64 glass-card m-4 p-4">
      <nav className="space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                isActive
                  ? 'bg-purple-500/30 text-purple-300'
                  : 'text-gray-300 hover:bg-purple-500/20 hover:text-purple-300'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar