import React from 'react'
import { motion } from 'framer-motion'
import { Heart, ExternalLink, Github } from 'lucide-react'
import { formatNumber } from '../../utils/formatters'
import { useUserInfo } from '../../hooks/useLastFm'

const Footer = () => {
  const { data: userInfo } = useUserInfo()
  const totalScrobbles = userInfo?.user?.playcount || 0

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mt-auto"
    >
      <div className="glass-card mx-4 mb-4 p-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-white/70">
            <div className="flex items-center gap-1">
              <span>Total Scrobbles:</span>
              <span className="font-bold text-purple-400">{formatNumber(totalScrobbles)}</span>
            </div>
            <div className="hidden md:block">•</div>
            <div className="flex items-center gap-1">
              <span>Powered by</span>
              <a 
                href="https://www.last.fm" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-red-500 hover:text-red-400 transition-colors flex items-center gap-1"
              >
                Last.fm
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Credits */}
          <div className="flex items-center gap-4 text-sm text-white/70">
            <a 
              href="https://github.com/yourusername/music-dashboard" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <Github className="w-4 h-4" />
              <span className="hidden md:inline">Source</span>
            </a>
            <div>•</div>
            <div className="flex items-center gap-1">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>for music lovers</span>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}

export default Footer