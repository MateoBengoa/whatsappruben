'use client'

import { useState } from 'react'
import { 
  MagnifyingGlassIcon,
  BellIcon,
  SunIcon,
  MoonIcon,
  Bars3Icon,
  UserCircleIcon
} from '@heroicons/react/24/outline'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

export function Header() {
  const [searchQuery, setSearchQuery] = useState('')
  const { theme, setTheme } = useTheme()
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-fitness-500"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <span className="sr-only">Abrir menú principal</span>
              <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-lg lg:max-w-xs">
            <label htmlFor="search" className="sr-only">
              Buscar
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                id="search"
                name="search"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-fitness-500 focus:border-fitness-500 sm:text-sm"
                placeholder="Buscar contactos, mensajes..."
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Right side items */}
          <div className="flex items-center space-x-4">
            {/* Theme toggle */}
            <button
              type="button"
              className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-fitness-500 rounded-lg"
              onClick={toggleTheme}
            >
              <span className="sr-only">Cambiar tema</span>
              {theme === 'dark' ? (
                <SunIcon className="h-5 w-5" aria-hidden="true" />
              ) : (
                <MoonIcon className="h-5 w-5" aria-hidden="true" />
              )}
            </button>

            {/* Notifications */}
            <button
              type="button"
              className="relative p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-fitness-500 rounded-lg"
            >
              <span className="sr-only">Ver notificaciones</span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
              {/* Notification badge */}
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-fitness-500 ring-2 ring-white dark:ring-gray-800"></span>
            </button>

            {/* User menu */}
            <div className="relative">
              <button
                type="button"
                className="flex items-center space-x-3 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-fitness-500 p-2"
              >
                <UserCircleIcon className="h-8 w-8 text-gray-400" aria-hidden="true" />
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    Administrador
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    admin@rubenbot.com
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {showMobileMenu && (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-50 flex">
            <div 
              className="fixed inset-0 bg-gray-600 bg-opacity-75"
              onClick={() => setShowMobileMenu(false)}
            />
            <div className="relative flex flex-col flex-1 w-full max-w-xs bg-white dark:bg-gray-900">
              {/* Mobile sidebar content would go here */}
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div className="flex-shrink-0 flex items-center px-4">
                  <div className="w-8 h-8 bg-fitness-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">R</span>
                  </div>
                  <span className="ml-2 text-lg font-semibold text-gray-900 dark:text-white">
                    Bot Rubén
                  </span>
                </div>
                <nav className="mt-5 flex-1 px-2 space-y-1">
                  {/* Mobile navigation items would go here */}
                  <p className="text-center text-gray-500 dark:text-gray-400 text-sm py-4">
                    Menú móvil en desarrollo
                  </p>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
} 