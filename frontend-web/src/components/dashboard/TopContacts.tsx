'use client'

import { formatPhoneNumber } from '@/lib/utils'

interface TopContactsProps {
  contacts?: Array<{
    name?: string
    phone_number: string
    message_count: number
  }>
}

export function TopContacts({ contacts }: TopContactsProps) {
  if (!contacts || contacts.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">No hay contactos activos</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {contacts.slice(0, 5).map((contact, index) => (
        <div key={contact.phone_number} className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-fitness-100 dark:bg-fitness-900/20 rounded-full flex items-center justify-center">
              <span className="text-fitness-600 dark:text-fitness-400 text-sm font-medium">
                #{index + 1}
              </span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {contact.name || 'Sin nombre'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {formatPhoneNumber(contact.phone_number)}
            </p>
          </div>
          <div className="flex-shrink-0">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
              {contact.message_count} mensajes
            </span>
          </div>
        </div>
      ))}
    </div>
  )
} 