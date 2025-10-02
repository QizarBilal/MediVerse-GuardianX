import './globals.css'
import { Providers } from './providers'
import { Toaster } from 'react-hot-toast'

export const metadata = {
  title: 'MediVerse Guardian X',
  description: 'Healthcare AI Compliance Platform with HIPAA monitoring, blockchain integration, and advanced analytics',
  keywords: ['healthcare', 'AI', 'HIPAA', 'compliance', 'blockchain', 'medical'],
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen medical-pattern transition-colors duration-300" 
            style={{ 
              backgroundColor: 'rgb(var(--background-base))', 
              color: 'rgb(var(--text-primary))' 
            }}>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'rgb(var(--background-secondary))',
                color: 'rgb(var(--text-primary))',
                border: '1px solid rgb(var(--border-color))',
              },
              success: {
                style: {
                  background: '#22c55e',
                  color: '#fff',
                },
              },
              error: {
                style: {
                  background: '#ef4444',
                  color: '#fff',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}
