'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { analyticsApi, contactsApi, trainingDataApi } from '@/lib/api'
import { StatsGrid } from '@/components/dashboard/StatsGrid'
import { ActivityChart } from '@/components/dashboard/ActivityChart'
import { TopContacts } from '@/components/dashboard/TopContacts'
import { RecentMessages } from '@/components/dashboard/RecentMessages'
import { AIStatusCard } from '@/components/dashboard/AIStatusCard'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'

export default function DashboardPage() {
  const [realTimeStats, setRealTimeStats] = useState(null)

  // Fetch analytics data
  const { 
    data: analytics, 
    isLoading: analyticsLoading, 
    error: analyticsError,
    refetch: refetchAnalytics 
  } = useQuery({
    queryKey: ['analytics'],
    queryFn: analyticsApi.getData,
    refetchInterval: 30000, // Refresh every 30 seconds
  })

  // Fetch recent contacts for quick overview
  const { 
    data: recentContacts, 
    isLoading: contactsLoading 
  } = useQuery({
    queryKey: ['contacts', 'recent'],
    queryFn: () => contactsApi.getAll({ limit: 5 }),
    refetchInterval: 60000, // Refresh every minute
  })

  // Fetch training data stats
  const { 
    data: trainingData, 
    isLoading: trainingLoading 
  } = useQuery({
    queryKey: ['training-data', 'stats'],
    queryFn: () => trainingDataApi.getAll({ limit: 1 }),
  })

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      refetchAnalytics()
    }, 15000) // Refresh every 15 seconds

    return () => clearInterval(interval)
  }, [refetchAnalytics])

  if (analyticsLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (analyticsError) {
    return (
      <div className="p-6">
        <ErrorMessage 
          title="Error cargando el dashboard"
          message="No se pudieron cargar las estadísticas del bot. Verifica tu conexión e intenta de nuevo."
          onRetry={refetchAnalytics}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Bienvenido al panel de control del Bot Rubén 💪
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-fitness-100 text-fitness-800 dark:bg-fitness-800 dark:text-fitness-100">
            🔥 Sistema Activo
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <StatsGrid 
        analytics={analytics}
        isLoading={contactsLoading || trainingLoading}
      />

      {/* Quick Actions */}
      <QuickActions />

      {/* AI Status */}
      <AIStatusCard />

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Actividad de los últimos 7 días
            </h3>
          </div>
          <div className="card-body">
            <ActivityChart data={analytics?.daily_stats} />
          </div>
        </div>

        {/* Top Contacts */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Contactos más activos
            </h3>
          </div>
          <div className="card-body">
            <TopContacts contacts={analytics?.top_contacts} />
          </div>
        </div>
      </div>

      {/* Recent Messages */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Actividad reciente
          </h3>
        </div>
        <div className="card-body">
          <RecentMessages contacts={recentContacts} />
        </div>
      </div>

      {/* Footer Stats */}
      <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
        <div className="px-6 py-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-fitness-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">R</span>
              </div>
            </div>
            <div className="ml-4 flex-1">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                Bot Rubén - Entrenador Fitness IA
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Transformando vidas a través de la tecnología y el fitness 💪
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                v1.0.0
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 