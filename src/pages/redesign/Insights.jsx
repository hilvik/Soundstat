import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Award, Zap, Target } from 'lucide-react'
import PremiumNav from '../../components/redesign/Navigation/PremiumNav'
import AnimatedStatCard from '../../components/redesign/Stats/AnimatedStatCard'
import MusicDNA from '../../components/redesign/Insights/MusicDNA'
import ListeningPatterns from '../../components/redesign/Insights/ListeningPatterns'
import { useListeningStats, useGenreDistribution } from '../../hooks/useLastFm'

const Insights = () => {
  const { data: stats } = useListeningStats('overall')
  const { data: genres } = useGenreDistribution('overall')
  
  const insights = [
    {
      title: 'Music Diversity Score',
      value: '87%',
      icon: Zap,
      color: 'indigo',
      description: 'You explore a wide range of music'
    },
    {
      title: 'Discovery Rate',
      value: '23',
      icon: Target,
      color: 'pink',
      description: 'New artists per month'
    },
    {
      title: 'Listening Streak',
      value: '127',
      icon: Award,
      color: 'emerald',
      description: 'Days in a row'
    },
    {
      title: 'Top Listener Rank',
      value: '#42',
      icon: TrendingUp,
      color: 'amber',
      description: 'Among your favorite artist fans'
    }
  ]
  
  return (
    <div className="min-h-screen bg-gray-50">
      <PremiumNav />
      
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Music Insights
            </h1>
            <p className="text-xl text-gray-600">
              Deep dive into your listening behavior
            </p>
          </motion.div>
          
          {/* Key Insights */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            {insights.map((insight, index) => (
              <AnimatedStatCard
                key={insight.title}
                {...insight}
                delay={index * 0.1}
              />
            ))}
          </motion.section>
          
          {/* Music DNA */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-12"
          >
            <MusicDNA genres={genres} stats={stats} />
          </motion.section>
          
          {/* Listening Patterns */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <ListeningPatterns stats={stats} />
          </motion.section>
        </div>
      </main>
    </div>
  )
}

export default Insights