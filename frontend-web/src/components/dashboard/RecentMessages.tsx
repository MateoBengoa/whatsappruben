'use client'

import { formatRelativeTime, formatPhoneNumber } from '@/lib/utils'
import type { Contact } from '@/lib/api'

interface RecentMessagesProps {
  contacts?: Contact[]
}

export function RecentMessages({ contacts }: RecentMessagesProps) {
  if (!contacts || contacts.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">No hay actividad reciente</p>
      </div>
    )
  }

  // Filter contacts with recent activity and sort by last message
  const recentContacts = contacts
    .filter(contact => contact.last_message_at)
    .sort((a, b) => new Date(b.last_message_at!).getTime() - new Date(a.last_message_at!).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-4">
      {recentContacts.map((contact) => (
        <div key={contact.id} className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-fitness-100 dark:bg-fitness-900/20 rounded-full flex items-center justify-center">
              <span className="text-fitness-600 dark:text-fitness-400 text-sm font-medium">
                {contact.name ? contact.name.charAt(0).toUpperCase() : 'U'}
              </span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {contact.name || 'Usuario sin nombre'}
              </p>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                contact.status === 'active' 
                  ? 'bg-success-100 text-success-800 dark:bg-success-800 dark:text-success-100'
                  : contact.status === 'paused'
                  ? 'bg-warning-100 text-warning-800 dark:bg-warning-800 dark:text-warning-100'
                  : 'bg-danger-100 text-danger-800 dark:bg-danger-800 dark:text-danger-100'
              }`}>
                {contact.status}
              </span>
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {formatPhoneNumber(contact.phone_number)}
              </p>
              <span className="text-gray-300 dark:text-gray-600">•</span>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {contact.message_count} mensajes
              </p>
            </div>
          </div>
          <div className="flex-shrink-0">
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {contact.last_message_at ? formatRelativeTime(contact.last_message_at) : 'Sin actividad'}
              </p>
              {contact.ai_enabled ? (
                <span className="inline-flex items-center text-xs text-fitness-600 dark:text-fitness-400">
                  <div className="w-2 h-2 bg-fitness-500 rounded-full mr-1"></div>
                  IA activa
                </span>
              ) : (
                <span className="inline-flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mr-1"></div>
                  IA pausada
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
      
      {recentContacts.length === 0 && (
        <div className="text-center py-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No hay contactos con actividad reciente
          </p>
        </div>
      )}
    </div>
  )
} 