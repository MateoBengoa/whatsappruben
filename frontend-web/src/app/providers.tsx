'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ThemeProvider } from 'next-themes'
import { useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            cacheTime: 10 * 60 * 1000, // 10 minutes
            retry: (failureCount, error: any) => {
              // Don't retry for 4xx errors except 408, 429
              if (error?.response?.status >= 400 && error?.response?.status < 500) {
                if (error?.response?.status === 408 || error?.response?.status === 429) {
                  return failureCount < 3
                }
                return false
              }
              // Retry up to 3 times for other errors
              return failureCount < 3
            },
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
          },
          mutations: {
            retry: 1,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider 
        attribute="class" 
        defaultTheme="system" 
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <ReactQueryDevtools 
          initialIsOpen={false}
          buttonPosition="bottom-left"
        />
      </ThemeProvider>
    </QueryClientProvider>
  )
} 