import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format date utilities
export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: string | Date) {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function formatRelativeTime(date: string | Date) {
  const now = new Date()
  const target = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - target.getTime()) / 1000)
  
  if (diffInSeconds < 60) {
    return 'Hace unos segundos'
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `Hace ${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''}`
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`
  }
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`
  }
  
  return formatDate(date)
}

// Phone number formatting
export function formatPhoneNumber(phone: string) {
  // Remove whatsapp: prefix if present
  const cleanPhone = phone.replace('whatsapp:', '')
  
  // Format international number
  if (cleanPhone.startsWith('+')) {
    return cleanPhone
  }
  
  return `+${cleanPhone}`
}

// Text utilities
export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) {
    return text
  }
  return text.slice(0, maxLength) + '...'
}

export function capitalizeFirst(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

// Number formatting
export function formatNumber(num: number) {
  return new Intl.NumberFormat('es-ES').format(num)
}

export function formatPercentage(num: number) {
  return new Intl.NumberFormat('es-ES', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(num / 100)
}

// Color utilities for status
export function getStatusColor(status: string) {
  switch (status) {
    case 'active':
      return 'text-success-800 bg-success-100 dark:text-success-100 dark:bg-success-800'
    case 'paused':
      return 'text-warning-800 bg-warning-100 dark:text-warning-100 dark:bg-warning-800'
    case 'blocked':
      return 'text-danger-800 bg-danger-100 dark:text-danger-100 dark:bg-danger-800'
    default:
      return 'text-gray-800 bg-gray-100 dark:text-gray-100 dark:bg-gray-800'
  }
}

// File utilities
export function getFileExtension(filename: string) {
  return filename.split('.').pop()?.toLowerCase() || ''
}

export function formatFileSize(bytes: number) {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Array utilities
export function groupBy<T>(array: T[], key: keyof T) {
  return array.reduce((groups, item) => {
    const group = item[key] as unknown as string
    groups[group] = groups[group] || []
    groups[group].push(item)
    return groups
  }, {} as Record<string, T[]>)
}

// Local storage utilities
export function getLocalStorage(key: string, defaultValue: any = null) {
  if (typeof window === 'undefined') {
    return defaultValue
  }
  
  try {
    const item = window.localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error)
    return defaultValue
  }
}

export function setLocalStorage(key: string, value: any) {
  if (typeof window === 'undefined') {
    return
  }
  
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.warn(`Error setting localStorage key "${key}":`, error)
  }
}

export function removeLocalStorage(key: string) {
  if (typeof window === 'undefined') {
    return
  }
  
  try {
    window.localStorage.removeItem(key)
  } catch (error) {
    console.warn(`Error removing localStorage key "${key}":`, error)
  }
} 