import React, { useState } from 'react'
import { motion as Motion } from 'framer-motion'
import { TrendingUp, Users, Music, Clock, Calendar, Award, Zap, Heart } from 'lucide-react'
import AnimatedCard from '../components/ui/AnimatedCard'
import GradientText from '../components/ui/GradientText'
import TimeRangePicker from '../components/ui/TimeRangePicker'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import DetailedStats from '../components/stats/DetailedStats'
import TopArtistsChart from '../components/charts/TopArtistsChart'
import ListeningTrendsChart from '../components/charts/ListeningTrendsChart'
import GenreDistributionChart from '../components/charts/GenreDistributionChart'
import { useListeningStats, useTopArtists, useTopTracks, useListeningTrends, useGenreDistribution } from '../hooks/useLastFm'
import { formatNumber, calculateListeningTime, getPeriodLabel } from '../utils/formatters'

const Insights = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('overall')
  
  // Fetch all necessary data
  const { data: stats, isLoading: statsLoading } = useListeningStats(selectedPeriod)
  const { data: topArtists, isLoading: artistsLoading } = useTopArtists(selectedPeriod, 10)
  const { data: topTracks, isLoading: tracksLoading } = useTopTracks(selectedPeriod, 10)
  const { data: listeningTrends, isLoading: trendsLoading } = useListeningTrends(null, selectedPeriod === 'overall' ? '3month' : selectedPeriod)
  const { data: genreData, isLoading: genreLoading } = useGenreDistribution(selectedPeriod)
  
  const loading = statsLoading || artistsLoading || tracksLoading || trendsLoading || genreLoading
  
  // Calculate insights
  const insights = {
    topGenre: genreData?.[0]?.genre || 'Unknown',
    favoriteArtist: topArtists?.topartists?.artist?.[0]?.name || 'Unknown',
    favoriteTrack: topTracks?.toptracks?.track?.[0]?.name || 'Unknown',
    listeningDiversity: genreData?.length > 5 ? 'High' : genreData?.length > 2 ? 'Medium' : 'Low',
    mostActiveDay: 'Saturday', // Would need to calculate from real data
    averageTrackLength: '3:30', // Would need to calculate from real data
  }

  const InsightCard = ({ icon: Icon, title, value, description, color, delay = 0 }) => (
    <Motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
    >
      <AnimatedCard className="p-6 h-full">
        <div className="flex items-start gap-4">
          <div className={`p-3 bg-gradient-to-r ${color} rounded-xl`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-white/70 mb-1">{title}</h3>
            <p className="text-xl font-bold text-white mb-2">{value}</p>
            <p className="text-sm text-white/60">{description}</p>
          </div>
        </div>
      </AnimatedCard>
    </Motion.div>
  )

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <LoadingSpinner size="xl" className="mx-auto mb-4" />
          <p className="text-white/70">Analyzing your music data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <Motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <GradientText className="text-4xl mb-2">
          Music Insights
        </GradientText>
        <Motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-white/70"
        >
          Deep dive into your listening patterns and habits
        </Motion.p>
      </Motion.div>

      {/* Period Selector */}
      <Motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7 }}
        className="flex justify-center"
      >
        <TimeRangePicker
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
        />
      </Motion.div>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <InsightCard
          icon={Heart}
          title="Favorite Genre"
          value={insights.topGenre}
          description="Your most played music style"
          color="from-purple-500 to-pink-500"
          delay={0.1}
        />
        <InsightCard
          icon={Users}
          title="Top Artist"
          value={insights.favoriteArtist}
          description="You can't get enough of them"
          color="from-blue-500 to-purple-500"
          delay={0.2}
        />
        <InsightCard
          icon={Music}
          title="Favorite Track"
          value={insights.favoriteTrack}
          description="Your most played song"
          color="from-green-500 to-blue-500"
          delay={0.3}
        />
        <InsightCard
          icon={Zap}
          title="Music Diversity"
          value={insights.listeningDiversity}
          description="How varied your taste is"
          color="from-orange-500 to-red-500"
          delay={0.4}
        />
        <InsightCard
          icon={Calendar}
          title="Most Active Day"
          value={insights.mostActiveDay}
          description="When you listen the most"
          color="from-pink-500 to-purple-500"
          delay={0.5}
        />
        <InsightCard
          icon={Clock}
          title="Average Track Length"
          value={insights.averageTrackLength}
          description="Your preferred song duration"
          color="from-cyan-500 to-blue-500"
          delay={0.6}
        />
      </div>

      {/* Detailed Stats */}
      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <DetailedStats 
          data={stats} 
          period={selectedPeriod}
        />
      </Motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Genre Distribution */}
        <Motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 }}
        >
          <GenreDistributionChart
            data={genreData}
            loading={genreLoading}
          />
        </Motion.div>

        {/* Listening Trends */}
        <Motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.1 }}
        >
          <ListeningTrendsChart
            data={listeningTrends}
            loading={trendsLoading}
            period={selectedPeriod === 'overall' ? '3month' : selectedPeriod}
          />
        </Motion.div>
      </div>

      {/* Top Artists Chart */}
      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <TopArtistsChart
          data={topArtists?.topartists?.artist}
          loading={artistsLoading}
          period={selectedPeriod}
        />
      </Motion.div>

      {/* Fun Facts */}
      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3 }}
      >
        <AnimatedCard gradient className="p-6">
          <div className="text-center">
            <Award className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <GradientText className="text-2xl mb-4">
              Fun Facts About Your Music
            </GradientText>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-white mb-2">
                  {calculateListeningTime(stats?.totalScrobbles || 0)}
                </div>
                <div className="text-white/70">Total listening time</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-2">
                  {Math.round((stats?.totalScrobbles || 0) / 365)}
                </div>
                <div className="text-white/70">Songs per day average</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-2">
                  {stats?.uniqueArtists > 1000 ? '1000+' : stats?.uniqueArtists || 0}
                </div>
                <div className="text-white/70">Different artists explored</div>
              </div>
            </div>
          </div>
        </AnimatedCard>
      </Motion.div>
    </div>
  )
}

export default Insights