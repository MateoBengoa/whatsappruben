import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Bot Rubén - Panel de Administración',
  description: 'Panel de administración para el bot de WhatsApp de Rubén, entrenador fitness',
  keywords: 'whatsapp, bot, fitness, entrenador, ruben, ai, inteligencia artificial',
  author: 'Rubén Fitness Bot',
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="h-full">
      <body className={`${inter.className} h-full bg-gray-50 dark:bg-gray-900`}>
        <Providers>
          <div className="flex h-full">
            {/* Sidebar */}
            <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
              <Sidebar />
            </div>

            {/* Main content area */}
            <div className="flex flex-col flex-1 lg:pl-64">
              {/* Header */}
              <Header />

              {/* Page content */}
              <main className="flex-1 overflow-y-auto">
                <div className="py-6">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {children}
                  </div>
                </div>
              </main>
            </div>
          </div>

          {/* Toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                style: {
                  background: '#059669',
                },
              },
              error: {
                style: {
                  background: '#DC2626',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
} 