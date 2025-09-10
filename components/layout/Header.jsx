'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '../../app/context/AuthContext'
import { Bell, Menu, X, User, Search, ChevronDown } from 'lucide-react'

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`sticky top-0 z-50 transition-all duration-200 ${
      isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">ServiceHub</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/services" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Find Services
            </Link>
            <Link href="/categories" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Categories
            </Link>
            <Link href="/how-it-works" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              How it Works
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                  <Bell size={20} />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    3
                  </span>
                </button>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <img
                      src={user?.avatar || '/api/placeholder/32/32'}
                      alt={user?.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="font-medium">{user?.name}</span>
                    <ChevronDown size={16} />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      <Link href="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                        Dashboard
                      </Link>
                      <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                        Profile
                      </Link>
                      <Link href="/settings" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                        Settings
                      </Link>
                      <hr className="my-1" />
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 hover:text-gray-900 font-medium">
                  Sign In
                </Link>
                <Link href="/register" className="btn-primary">
                  Join as a Professional
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="space-y-2">
              <Link href="/services" className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors">
                Find Services
              </Link>
              <Link href="/categories" className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors">
                Categories
              </Link>
              <Link href="/how-it-works" className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors">
                How it Works
              </Link>
              
              {isAuthenticated ? (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex items-center px-3 py-2 mb-2">
                    <img
                      src={user?.avatar || '/api/placeholder/32/32'}
                      alt={user?.name}
                      className="w-8 h-8 rounded-full object-cover mr-3"
                    />
                    <span className="font-medium text-gray-900">{user?.name}</span>
                  </div>
                  <Link href="/dashboard" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                    Dashboard
                  </Link>
                  <Link href="/profile" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                    Profile
                  </Link>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
                  <Link href="/login" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                    Sign In
                  </Link>
                  <Link href="/register" className="block mx-3 btn-primary text-center">
                    Join as a Professional
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}