'use client'

interface ActivityChartProps {
  data?: Record<string, number>
}

export function ActivityChart({ data }: ActivityChartProps) {
  if (!data) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">No hay datos disponibles</p>
      </div>
    )
  }

  // Convert data to array for visualization
  const chartData = Object.entries(data).map(([date, count]) => ({
    date,
    count
  })).slice(-7) // Last 7 days

  const maxCount = Math.max(...chartData.map(d => d.count))

  return (
    <div className="h-64">
      <div className="flex items-end justify-between h-full space-x-2">
        {chartData.map((item, index) => (
          <div key={item.date} className="flex flex-col items-center flex-1">
            <div 
              className="w-full bg-fitness-500 rounded-t-sm hover:bg-fitness-600 transition-colors cursor-pointer"
              style={{ 
                height: `${maxCount > 0 ? (item.count / maxCount) * 100 : 0}%`,
                minHeight: item.count > 0 ? '4px' : '2px'
              }}
              title={`${item.count} mensajes`}
            />
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
              {new Date(item.date).toLocaleDateString('es-ES', { 
                weekday: 'short',
                day: 'numeric'
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Mensajes por día (últimos 7 días)
        </p>
      </div>
    </div>
  )
} 