'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Bell, Search, Menu, X, User } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary-600">
              ServiceHub
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/services" className="text-gray-600 hover:text-gray-900 font-medium">
              Explore
            </Link>
            <Link href="/categories" className="text-gray-600 hover:text-gray-900 font-medium">
              Categories
            </Link>
            <Link href="/how-it-works" className="text-gray-600 hover:text-gray-900 font-medium">
              How it works
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <button className="p-2 text-gray-600 hover:text-gray-900 relative">
                  <Bell size={20} />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    3
                  </span>
                </button>
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                    <User size={20} />
                    <span>{user?.name || 'User'}</span>
                  </button>
                  {/* Dropdown menu would go here */}
                </div>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-gray-600 hover:text-gray-900 font-medium">
                  Login
                </Link>
                <Link href="/auth/register" className="btn-primary">
                  Join as a Professional
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              <Link href="/explore" className="block px-3 py-2 text-gray-600 hover:text-gray-900">
                Explore
              </Link>
              <Link href="/categories" className="block px-3 py-2 text-gray-600 hover:text-gray-900">
                Categories
              </Link>
              <Link href="/how-it-works" className="block px-3 py-2 text-gray-600 hover:text-gray-900">
                How it works
              </Link>
              <div className="border-t border-gray-200 pt-4">
                {isLoggedIn ? (
                  <div className="space-y-2">
                    <Link href="/dashboard" className="block px-3 py-2 text-gray-600 hover:text-gray-900">
                      Dashboard
                    </Link>
                    <Link href="/logout" className="block px-3 py-2 text-gray-600 hover:text-gray-900">
                      Logout
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link href="/auth/login" className="block px-3 py-2 text-gray-600 hover:text-gray-900">
                      Login
                    </Link>
                    <Link href="/register" className="block px-3 py-2 btn-primary text-center">
                      Join as a Professional
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}