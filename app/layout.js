'use client'

import './globals.css'
import { Toaster } from 'react-hot-toast'
import { useEffect, useState } from 'react'
import { Providers } from '@/components/providers/Providers'
import { Header } from '@/components/Header'
import { SellerHeader } from '@/components/sellerHeader'
import Link from 'next/link'

// Utility function to get and parse user cookie
const getUserFromCookie = () => {
  if (typeof window === 'undefined') return null
  
  try {
    const userCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('user='))
      ?.split('=')[1]
    
    if (!userCookie) return null
    
    const decodedUser = decodeURIComponent(userCookie)
    return JSON.parse(decodedUser)
  } catch (error) {
    console.error('Error parsing user cookie:', error)
    return null
  }
}

// Loading component
function LoadingHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-18">
          {/* Loading Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gray-200 rounded-xl animate-pulse"></div>
            <div className="space-y-1">
              <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-24 h-3 bg-gray-100 rounded animate-pulse"></div>
            </div>
          </div>
          
          {/* Loading Right Section */}
          <div className="flex items-center space-x-4">
            <div className="w-32 h-10 bg-gray-200 rounded-xl animate-pulse hidden lg:block"></div>
            <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default function RootLayout({ children }) {
  const [user, setUser] = useState(null)
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const userData = getUserFromCookie()
        setUser(userData)
      } catch (error) {
        console.error('Error initializing user:', error)
      } finally {
        setMounted(true)
        setIsLoading(false)
      }
    }

    initializeUser()
  }, [])

  // Enhanced toast configuration
  const toastOptions = {
    duration: 4000,
    position: 'top-right',
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
      iconTheme: {
        primary: '#059669',
        secondary: '#fff',
      },
    },
    error: {
      iconTheme: {
        primary: '#dc2626',
        secondary: '#fff',
      },
    },
  }

  // Prevent hydration mismatch by showing loading state
  if (!mounted || isLoading) {
    return (
      <html lang="en">
        <body className="bg-gray-50">
          <Providers>
            <LoadingHeader />
            <main className="min-h-screen bg-gray-50">
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-500 border-t-transparent mx-auto mb-4"></div>
                    <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-2 border-teal-300 opacity-20"></div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Loading ServiceHub</h3>
                  <p className="text-gray-600">Please wait while we prepare your experience...</p>
                </div>
              </div>
            </main>
          </Providers>
          <Toaster {...toastOptions} />
        </body>
      </html>
    )
  }

  // Determine which header to show based on user type
  const HeaderComponent = user && user.userType !== 'customer' ? SellerHeader : Header

  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <Providers>
          <HeaderComponent />
          <main className="min-h-screen">
            {children}
          </main>
          
          {/* Enhanced Footer for better UX */}
          <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="text-sm text-gray-600">
                  © 2024 ServiceHub. All rights reserved.
                </div>
                <div className="flex items-center space-x-6 mt-4 md:mt-0">
                  <Link href="/privacy" className="text-sm text-gray-600 hover:text-teal-700 transition-colors">
                    Privacy Policy
                  </Link>
                  <Link href="/terms" className="text-sm text-gray-600 hover:text-teal-700 transition-colors">
                    Terms of Service
                  </Link>
                  <Link href="/contact" className="text-sm text-gray-600 hover:text-teal-700 transition-colors">
                    Contact Support
                  </Link>
                </div>
              </div>
            </div>
          </footer>
        </Providers>
        
        {/* Enhanced Toast Notifications */}
        <Toaster {...toastOptions} />
      </body>
    </html>
  )
}