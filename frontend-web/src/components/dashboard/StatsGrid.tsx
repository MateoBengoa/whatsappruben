'use client'

import { 
  UsersIcon,
  ChatBubbleLeftRightIcon,
  CpuChipIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { formatNumber, formatPercentage } from '@/lib/utils'
import type { AnalyticsData } from '@/lib/api'

interface StatsGridProps {
  analytics?: AnalyticsData
  isLoading?: boolean
}

export function StatsGrid({ analytics, isLoading }: StatsGridProps) {
  if (isLoading || !analytics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="card-body">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const stats = [
    {
      name: 'Total Contactos',
      value: formatNumber(analytics.total_contacts),
      change: `${analytics.active_contacts} activos`,
      changeType: 'positive' as const,
      icon: UsersIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'Mensajes Total',
      value: formatNumber(analytics.total_messages),
      change: `${formatNumber(analytics.ai_responses)} de IA`,
      changeType: 'positive' as const,
      icon: ChatBubbleLeftRightIcon,
      color: 'bg-fitness-500',
    },
    {
      name: 'Tasa de Respuesta',
      value: formatPercentage(analytics.response_rate),
      change: 'IA respondiendo',
      changeType: 'positive' as const,
      icon: CpuChipIcon,
      color: 'bg-success-500',
    },
    {
      name: 'Tiempo Promedio',
      value: `${analytics.avg_response_time}s`,
      change: 'Respuesta rápida',
      changeType: 'positive' as const,
      icon: ClockIcon,
      color: 'bg-warning-500',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={stat.name} className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`w-8 h-8 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="h-5 w-5 text-white" aria-hidden="true" />
                </div>
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    {stat.name}
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {stat.value}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm">
                <span className={`
                  inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                  ${stat.changeType === 'positive' 
                    ? 'bg-success-100 text-success-800 dark:bg-success-800 dark:text-success-100' 
                    : 'bg-danger-100 text-danger-800 dark:bg-danger-800 dark:text-danger-100'
                  }
                `}>
                  {stat.change}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 