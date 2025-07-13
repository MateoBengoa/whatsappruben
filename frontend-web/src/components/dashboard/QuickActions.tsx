'use client'

import Link from 'next/link'
import { 
  PlusIcon,
  PaperAirplaneIcon,
  BeakerIcon,
  CogIcon,
  DocumentTextIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

const quickActions = [
  {
    name: 'Nuevo Contacto',
    description: 'Agregar un contacto manualmente',
    href: '/contacts/new',
    icon: PlusIcon,
    color: 'bg-fitness-500 hover:bg-fitness-600',
  },
  {
    name: 'Enviar Mensaje',
    description: 'Difusión a múltiples contactos',
    href: '/broadcast',
    icon: PaperAirplaneIcon,
    color: 'bg-blue-500 hover:bg-blue-600',
  },
  {
    name: 'Probar IA',
    description: 'Testear respuestas del bot',
    href: '/testing',
    icon: BeakerIcon,
    color: 'bg-purple-500 hover:bg-purple-600',
  },
  {
    name: 'Entrenar IA',
    description: 'Subir nuevos datos de entrenamiento',
    href: '/training',
    icon: DocumentTextIcon,
    color: 'bg-success-500 hover:bg-success-600',
  },
  {
    name: 'Configurar',
    description: 'Ajustar configuración de IA',
    href: '/config',
    icon: CogIcon,
    color: 'bg-gray-500 hover:bg-gray-600',
  },
  {
    name: 'Ver Analytics',
    description: 'Reportes detallados',
    href: '/analytics',
    icon: ChartBarIcon,
    color: 'bg-indigo-500 hover:bg-indigo-600',
  },
]

export function QuickActions() {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Acciones Rápidas
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Tareas comunes para gestionar tu bot
        </p>
      </div>
      <div className="card-body">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              href={action.href}
              className="relative group bg-white dark:bg-gray-800 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-fitness-500 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors"
            >
              <div>
                <span className={`rounded-lg inline-flex p-3 ${action.color} text-white`}>
                  <action.icon className="h-6 w-6" aria-hidden="true" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  <span className="absolute inset-0" aria-hidden="true" />
                  {action.name}
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {action.description}
                </p>
              </div>
              <span
                className="pointer-events-none absolute top-6 right-6 text-gray-300 dark:text-gray-600 group-hover:text-gray-400 dark:group-hover:text-gray-500"
                aria-hidden="true"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="m11.293 17.293 1.414 1.414L19.414 12l-6.707-6.707-1.414 1.414L15.586 11H5v2h10.586l-4.293 4.293z" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
} 