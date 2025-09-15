'use client'

import { useAuth } from '../app/context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { HelpCircle } from 'lucide-react'

const SellerHeader = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  if (!isAuthenticated) return null

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/dashboard">
            <span className="text-2xl font-bold text-gray-900">Service Hub</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex space-x-6">
          <Link href="/dashboard" className="text-gray-700 hover:text-gray-900 font-medium">Dashboard</Link>
          <Link href="/dashboard/leads" className="text-gray-700 hover:text-gray-900 font-medium">Leads</Link>
          <Link href="/dashboard/my-responses" className="text-gray-700 hover:text-gray-900 font-medium">My Responses</Link>
          <Link href="/dashboard/settings" className="text-gray-700 hover:text-gray-900 font-medium">Settings</Link>
          <Link href="/help" className="text-gray-700 hover:text-gray-900 font-medium">Help</Link>
        </nav>

        {/* User Profile/Help */}
        <div className="flex items-center space-x-4">
          <Link href="/help" className="text-gray-500 hover:text-gray-700">
            <HelpCircle className="w-6 h-6" />
          </Link>
          {user && (
            <span className="text-sm text-gray-700">
              {user.name} <button onClick={handleLogout} className="ml-2 text-red-500 hover:text-red-700">Logout</button>
            </span>
          )}
        </div>
      </div>
    </header>
  )
}

export default SellerHeader