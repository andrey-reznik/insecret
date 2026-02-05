'use client'

import { AuthUIProvider } from '@daveyplate/better-auth-ui'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { queryClient } from '@/utils/orpc'
import { ThemeProvider } from './theme-provider'
import { Toaster } from './ui/sonner'

export default function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      disableTransitionOnChange
      enableSystem
    >
      <QueryClientProvider client={queryClient}>
        <AuthUIProvider
          account={{
            basePath: '/dashboard/account',
          }}
          authClient={authClient}
          Link={Link}
          navigate={router.push}
          onSessionChange={() => {
            // Clear router cache (protected routes)
            router.refresh()
          }}
          replace={router.replace}
        >
          {children}
        </AuthUIProvider>
        <ReactQueryDevtools />
      </QueryClientProvider>
      <Toaster richColors />
    </ThemeProvider>
  )
}
