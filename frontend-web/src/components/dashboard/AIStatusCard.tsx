'use client'

import { useState } from 'react'
import { CpuChipIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

export function AIStatusCard() {
  const [aiStatus] = useState({
    online: true,
    lastResponse: '2 segundos',
    tokensUsed: 1234,
    tokensLimit: 10000,
    model: 'GPT-4 Turbo',
    temperature: 0.7,
    responseTime: '2.3s'
  })

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center space-x-3">
          <CpuChipIcon className="h-6 w-6 text-fitness-500" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Estado de la IA
          </h3>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800 dark:bg-success-800 dark:text-success-100">
            <CheckCircleIcon className="h-3 w-3 mr-1" />
            Activo
          </span>
        </div>
      </div>
      <div className="card-body">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Modelo
            </dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white font-semibold">
              {aiStatus.model}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Última respuesta
            </dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white font-semibold">
              Hace {aiStatus.lastResponse}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Tokens usados
            </dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white font-semibold">
              {aiStatus.tokensUsed.toLocaleString()} / {aiStatus.tokensLimit.toLocaleString()}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Tiempo respuesta
            </dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white font-semibold">
              {aiStatus.responseTime}
            </dd>
          </div>
        </div>
        
        {/* Progress bar for tokens */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Uso de tokens</span>
            <span className="text-gray-900 dark:text-white">
              {Math.round((aiStatus.tokensUsed / aiStatus.tokensLimit) * 100)}%
            </span>
          </div>
          <div className="mt-2 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-fitness-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(aiStatus.tokensUsed / aiStatus.tokensLimit) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
} 