import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Music, Users, TrendingUp, Heart, Clock, Sparkles } from 'lucide-react'
import EnhancedMusicStoryIntro from '../components/story/EnhancedMusicStoryIntro'
import ChapterTransition from '../components/story/ChapterTransition'
import Dashboard from './Dashboard'
import Artists from './Artists'

const EnhancedMusicStory = () => {
  const [currentChapter, setCurrentChapter] = useState('intro')
  const [showTransition, setShowTransition] = useState(false)

  const chapters = {
    intro: {
      component: EnhancedMusicStoryIntro,
      props: { onContinue: () => handleChapterTransition('overview') }
    },
    overview: {
      component: Dashboard,
      props: {}
    },
    artists: {
      component: Artists, 
      props: {}
    }
  }

  const chapterData = {
    overview: {
      number: 1,
      title: "The Numbers Behind Your Passion",
      subtitle: "Every play, every skip, every repeat tells your story",
      icon: Music,
      color: "purple"
    },
    artists: {
      number: 2, 
      title: "The Voices That Move You",
      subtitle: "The artists who soundtrack your life",
      icon: Users,
      color: "pink"
    }
  }

  const handleChapterTransition = (nextChapter) => {
    if (nextChapter === 'overview') {
      setCurrentChapter(nextChapter)
      return
    }
    
    setShowTransition(true)
    setTimeout(() => {
      setCurrentChapter(nextChapter)
      setShowTransition(false)
    }, 3000)
  }

  const CurrentComponent = chapters[currentChapter].component
  const currentProps = chapters[currentChapter].props

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Effects */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(255,255,255,0.1)_1px,_transparent_0)] bg-[size:20px_20px]" />
      </div>

      {/* Chapter Navigation */}
      {currentChapter !== 'intro' && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-6 left-1/2 transform -translate-x-1/2 z-40"
        >
          <div className="flex items-center gap-4 px-6 py-3 bg-black/50 backdrop-blur-xl border border-white/20 rounded-full">
            <button
              onClick={() => handleChapterTransition('overview')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                currentChapter === 'overview' 
                  ? 'bg-purple-500 text-white' 
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => handleChapterTransition('artists')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                currentChapter === 'artists' 
                  ? 'bg-purple-500 text-white' 
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              Artists
            </button>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentChapter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          <CurrentComponent {...currentProps} />
        </motion.div>
      </AnimatePresence>

      {/* Chapter Transitions */}
      <AnimatePresence>
        {showTransition && chapterData[currentChapter] && (
          <ChapterTransition
            chapterNumber={chapterData[currentChapter].number}
            title={chapterData[currentChapter].title}
            subtitle={chapterData[currentChapter].subtitle}
            icon={chapterData[currentChapter].icon}
            color={chapterData[currentChapter].color}
            onComplete={() => setShowTransition(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default EnhancedMusicStory