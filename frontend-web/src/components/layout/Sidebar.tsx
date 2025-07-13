'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  HomeIcon,
  UsersIcon,
  ChatBubbleLeftRightIcon,
  CogIcon,
  BookOpenIcon,
  ChartBarIcon,
  MegaphoneIcon,
  BeakerIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Contactos', href: '/contacts', icon: UsersIcon },
  { name: 'Conversaciones', href: '/conversations', icon: ChatBubbleLeftRightIcon },
  { name: 'Entrenamiento IA', href: '/training', icon: BookOpenIcon },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
  { name: 'Difusión', href: '/broadcast', icon: MegaphoneIcon },
  { name: 'Configuración', href: '/config', icon: CogIcon },
  { name: 'Testing', href: '/testing', icon: BeakerIcon },
]

const secondaryNavigation = [
  { name: 'Ayuda', href: '/help', icon: QuestionMarkCircleIcon },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-fitness-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              Bot Rubén
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Entrenador Fitness IA
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/' && pathname.startsWith(item.href))
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                  isActive
                    ? 'bg-fitness-100 text-fitness-700 dark:bg-fitness-900/20 dark:text-fitness-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                )}
              >
                <item.icon
                  className={cn(
                    'mr-3 h-5 w-5 flex-shrink-0',
                    isActive
                      ? 'text-fitness-500 dark:text-fitness-400'
                      : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400'
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            )
          })}
        </div>

        {/* Separator */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
          <div className="space-y-1">
            {secondaryNavigation.map((item) => {
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                    isActive
                      ? 'bg-fitness-100 text-fitness-700 dark:bg-fitness-900/20 dark:text-fitness-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                  )}
                >
                  <item.icon
                    className={cn(
                      'mr-3 h-5 w-5 flex-shrink-0',
                      isActive
                        ? 'text-fitness-500 dark:text-fitness-400'
                        : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400'
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Status indicator */}
      <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Sistema conectado
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 