// components/layout/Header.jsx
'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useAuth } from '../app/context/AuthContext'
import { 
  Bell, 
  Menu, 
  X, 
  User, 
  Search, 
  ChevronDown,
  Settings,
  LogOut,
  BarChart3,
  UserCircle,
  Plus,
  Grid3x3,
  HelpCircle
} from 'lucide-react'

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [notificationCount, setNotificationCount] = useState(3)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    document.addEventListener('mousedown', handleClickOutside)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleMobileMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ease-in-out ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-100'
            : 'bg-white border-b border-gray-50'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-18">
            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center space-x-3 group transition-transform duration-200 hover:scale-105"
            >
              <div className="relative">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-[#006666] to-indigo-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200">
                  <span className="text-white font-bold text-lg lg:text-xl">S</span>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-200"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl lg:text-2xl font-bold text-gray-900 tracking-tight">
                  ServiceHub
                </span>
                <span className="text-xs text-gray-500 font-medium -mt-1 hidden sm:block">
                  Professional Services
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              <Link 
                href="/requests/create" 
                className="inline-flex items-center px-4 py-2 bg-[#006666] text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Plus size={18} className="mr-2" />
                Post Request
              </Link>
              
              <Link 
                href="/categories" 
                className="inline-flex items-center px-4 py-2 text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
              >
                <Grid3x3 size={18} className="mr-2" />
                Categories
              </Link>
              
              <Link 
                href="/how-it-works" 
                className="inline-flex items-center px-4 py-2 text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
              >
                <HelpCircle size={18} className="mr-2" />
                How it Works
              </Link>
            </nav>

            {/* Desktop Auth Section */}
            <div className="hidden lg:flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  {/* Search Button */}
                  <button
                    aria-label="Search"
                    className="relative p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
                  >
                    <Search size={20} />
                  </button>

                  {/* Notifications */}
                  <button
                    aria-label="Notifications"
                    className="relative p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
                  >
                    <Bell size={20} />
                    {notificationCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-5 h-5 flex items-center justify-center px-1 animate-pulse">
                        {notificationCount > 9 ? '9+' : notificationCount}
                      </span>
                    )}
                  </button>

                  {/* User Menu */}
                  <div className="relative" ref={menuRef}>
                    <button
                      aria-label="User menu"
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center space-x-3 p-2 pl-3 pr-4 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200 border border-transparent hover:border-gray-200"
                    >
                      <div className="relative">
                        <img
                          src={user?.avatar || '/api/placeholder/36/36'}
                          alt={user?.name || 'User avatar'}
                          className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-100"
                        />
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="font-semibold text-sm leading-tight">
                          {user?.name || 'User'}
                        </span>
                        <span className="text-xs text-gray-500 leading-tight">
                          {user?.role || 'Member'}
                        </span>
                      </div>
                      <ChevronDown 
                        size={16} 
                        className={`transition-transform duration-200 ${
                          isUserMenuOpen ? 'rotate-180' : ''
                        }`} 
                      />
                    </button>

                    {/* User Dropdown */}
                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl ring-1 ring-black/5 border border-gray-100 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="font-semibold text-gray-900">{user?.name}</p>
                          <p className="text-sm text-gray-500">{user?.email}</p>
                        </div>
                        
                        <div className="py-2">
                          <Link 
                            href="/dashboard" 
                            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <BarChart3 size={18} className="mr-3 text-gray-400" />
                            Dashboard
                          </Link>
                          <Link 
                            href="/profile" 
                            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <UserCircle size={18} className="mr-3 text-gray-400" />
                            Profile
                          </Link>
                          <Link 
                            href="/settings" 
                            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Settings size={18} className="mr-3 text-gray-400" />
                            Settings
                          </Link>
                        </div>
                        
                        <div className="border-t border-gray-100 pt-2">
                          <button 
                            onClick={() => {
                              logout()
                              setIsUserMenuOpen(false)
                            }}
                            className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 transition-colors duration-150"
                          >
                            <LogOut size={18} className="mr-3" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link 
                    href="/auth/login" 
                    className="px-4 py-2 text-gray-700 font-medium hover:text-gray-900 transition-colors duration-200"
                  >
                    Sign In
                  </Link>
                  <Link 
                    href="/auth/register" 
                    className="inline-flex items-center px-6 py-2.5 bg-[#006666] text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Join as Professional
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              aria-label="Toggle menu"
              onClick={handleMobileMenuToggle}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div 
          className={`lg:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen 
              ? 'max-h-96 opacity-100' 
              : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <div className="bg-gray-50 border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-3">
              {/* Mobile Navigation Links */}
              <div className="space-y-2">
                <Link 
                  href="/requests/create" 
                  className="flex items-center w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-md"
                  onClick={closeMobileMenu}
                >
                  <Plus size={20} className="mr-3" />
                  Post a Request
                </Link>
                
                <Link 
                  href="/categories" 
                  className="flex items-center w-full px-4 py-3 text-gray-700 font-medium bg-white rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  onClick={closeMobileMenu}
                >
                  <Grid3x3 size={20} className="mr-3" />
                  Categories
                </Link>
                
                <Link 
                  href="/how-it-works" 
                  className="flex items-center w-full px-4 py-3 text-gray-700 font-medium bg-white rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  onClick={closeMobileMenu}
                >
                  <HelpCircle size={20} className="mr-3" />
                  How it Works
                </Link>
              </div>

              {/* Mobile Auth Section */}
              {isAuthenticated ? (
                <div className="pt-4 border-t border-gray-200 space-y-2">
                  {/* User Info */}
                  <div className="flex items-center px-4 py-3 bg-white rounded-lg">
                    <img
                      src={user?.avatar || '/api/placeholder/40/40'}
                      alt={user?.name || 'User'}
                      className="w-10 h-10 rounded-full object-cover mr-3"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">{user?.name}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                  </div>

                  {/* Mobile User Menu Items */}
                  <Link 
                    href="/dashboard" 
                    className="flex items-center w-full px-4 py-3 text-gray-700 font-medium bg-white rounded-lg"
                    onClick={closeMobileMenu}
                  >
                    <BarChart3 size={20} className="mr-3" />
                    Dashboard
                  </Link>
                  <Link 
                    href="/profile" 
                    className="flex items-center w-full px-4 py-3 text-gray-700 font-medium bg-white rounded-lg"
                    onClick={closeMobileMenu}
                  >
                    <UserCircle size={20} className="mr-3" />
                    Profile
                  </Link>
                  <Link 
                    href="/settings" 
                    className="flex items-center w-full px-4 py-3 text-gray-700 font-medium bg-white rounded-lg"
                    onClick={closeMobileMenu}
                  >
                    <Settings size={20} className="mr-3" />
                    Settings
                  </Link>
                  <button 
                    onClick={() => {
                      logout()
                      closeMobileMenu()
                    }}
                    className="flex items-center w-full px-4 py-3 text-red-600 font-medium bg-white rounded-lg"
                  >
                    <LogOut size={20} className="mr-3" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <Link 
                    href="/auth/login" 
                    className="flex items-center justify-center w-full px-4 py-3 text-gray-700 font-medium bg-white rounded-lg"
                    onClick={closeMobileMenu}
                  >
                    Sign In
                  </Link>
                  <Link 
                    href="/auth/register" 
                    className="flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg"
                    onClick={closeMobileMenu}
                  >
                    Join as Professional
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}
    </>
  )
}