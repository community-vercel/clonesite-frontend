import './globals.css'
import { Providers } from '@/components/providers/Providers'
import { Toaster } from 'react-hot-toast'
import { cookies } from 'next/headers'
import ClientLayout from '@/components/ClientLayout'
import { Header } from '@/components/Header'

export default async function RootLayout({ children }) {
  const cookieStore = await cookies()
  const userCookie = cookieStore.get('user')?.value
  let user = null

  try {
    if (userCookie) {
      user = JSON.parse(decodeURIComponent(userCookie))
    }
  } catch (error) {
    console.error('Error parsing user cookie:', error)
  }

  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <Providers>
       <Header />
            {children}
        </Providers>
        <Toaster
          duration={4000}
          position="top-right"
          toastOptions={{
            style: {
              background: '#fff',
              color: '#374151',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              fontSize: '14px',
              fontWeight: '500',
            },
            success: {
              iconTheme: { primary: '#059669', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#dc2626', secondary: '#fff' },
            },
          }}
        />
      </body>
    </html>
  )
}