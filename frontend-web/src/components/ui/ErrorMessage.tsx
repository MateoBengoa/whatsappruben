'use client'

import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { ArrowPathIcon } from '@heroicons/react/24/solid'

interface ErrorMessageProps {
  title?: string
  message: string
  onRetry?: () => void
  className?: string
}

export function ErrorMessage({ 
  title = "Error", 
  message, 
  onRetry, 
  className = "" 
}: ErrorMessageProps) {
  return (
    <div className={`rounded-lg bg-danger-50 dark:bg-danger-900/20 p-4 ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <ExclamationTriangleIcon 
            className="h-5 w-5 text-danger-400" 
            aria-hidden="true" 
          />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-danger-800 dark:text-danger-200">
            {title}
          </h3>
          <div className="mt-2 text-sm text-danger-700 dark:text-danger-300">
            <p>{message}</p>
          </div>
          {onRetry && (
            <div className="mt-4">
              <div className="-mx-2 -my-1.5 flex">
                <button
                  type="button"
                  onClick={onRetry}
                  className="flex items-center space-x-2 rounded-md bg-danger-50 dark:bg-danger-900/20 px-2 py-1.5 text-sm font-medium text-danger-800 dark:text-danger-200 hover:bg-danger-100 dark:hover:bg-danger-900/40 focus:outline-none focus:ring-2 focus:ring-danger-600 focus:ring-offset-2 focus:ring-offset-danger-50 transition-colors"
                >
                  <ArrowPathIcon className="h-4 w-4" />
                  <span>Reintentar</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function ErrorBoundaryFallback({ 
  error, 
  resetErrorBoundary 
}: { 
  error: Error; 
  resetErrorBoundary: () => void 
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full">
        <ErrorMessage
          title="Algo salió mal"
          message={error.message || "Ha ocurrido un error inesperado. Por favor recarga la página."}
          onRetry={resetErrorBoundary}
          className="shadow-lg"
        />
      </div>
    </div>
  )
} 