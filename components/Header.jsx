// Enhanced Header Component with Conditional Rendering
'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useAuth } from '../app/context/AuthContext'
import { SellerHeader } from './sellerHeader' // Import your SellerHeader component
import { 
  Bell, 
  Menu, 
  X, 
  Search, 
  ChevronDown,
  Settings,
  LogOut,
  BarChart3,
  UserCircle,
  Plus,
  Grid3x3,
  HelpCircle,
  Briefcase,
  CreditCard,
  Star,
  MessageCircle,
  Shield,
  Zap
} from 'lucide-react'

export function Header() {
  const { user, logout, isAuthenticated } = useAuth()
 if (user?.userType === 'service_provider') {
    return <SellerHeader />
  }
 

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [notificationCount, setNotificationCount] = useState(3)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const menuRef = useRef(null)
  const searchRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false)
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchFocused(false)
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
            ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200'
            : 'bg-white border-b border-gray-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-18">
            {/* Enhanced Logo */}
            <Link 
              href="/" 
              className="flex items-center space-x-3 group transition-all duration-300 hover:scale-105"
            >
              <div className="relative">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:rotate-3">
                  <span className="text-white font-bold text-lg lg:text-xl">S</span>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-teal-600 to-teal-800 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-teal-700 to-teal-900 bg-clip-text text-transparent tracking-tight">
                  ServiceHub
                </span>
                <span className="text-xs text-gray-500 font-medium -mt-1 hidden sm:block">
                  Professional Network
                </span>
              </div>
            </Link>

            {/* Enhanced Desktop Search */}
            <div className="hidden lg:flex flex-1 max-w-xl mx-8" ref={searchRef}>
              <div className={`relative w-full transition-all duration-300 ${
                isSearchFocused ? 'transform scale-105' : ''
              }`}>
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search services, professionals, or categories..."
                  className={`w-full pl-12 pr-4 py-3 border rounded-xl transition-all duration-300 ${
                    isSearchFocused 
                      ? 'border-teal-500 ring-2 ring-teal-100 shadow-lg' 
                      : 'border-gray-200 hover:border-gray-300'
                  } focus:outline-none bg-gray-50 focus:bg-white`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Enhanced Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-2">
              <Link 
                href="/requests/create" 
                className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 text-white font-semibold rounded-xl hover:from-teal-700 hover:to-teal-800 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Plus size={18} className="mr-2" />
                Post Request
              </Link>
              
              <Link 
                href="/categories" 
                className="inline-flex items-center px-4 py-2.5 text-gray-700 font-medium rounded-xl hover:bg-gray-50 hover:text-teal-700 transition-all duration-200"
              >
                <Grid3x3 size={18} className="mr-2" />
                Categories
              </Link>
              
              <Link 
                href="/how-it-works" 
                className="inline-flex items-center px-4 py-2.5 text-gray-700 font-medium rounded-xl hover:bg-gray-50 hover:text-teal-700 transition-all duration-200"
              >
                <HelpCircle size={18} className="mr-2" />
                How it Works
              </Link>
            </nav>

            {/* Enhanced Desktop Auth Section */}
            <div className="hidden lg:flex items-center space-x-3">
              {isAuthenticated ? (
                <>
                  {/* Enhanced Notifications */}
                  <button
                    aria-label="Notifications"
                    className="relative p-2.5 text-gray-600 hover:text-teal-700 hover:bg-teal-50 rounded-xl transition-all duration-200 group"
                  >
                    <Bell size={20} />
                    {notificationCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full min-w-5 h-5 flex items-center justify-center px-1 animate-pulse shadow-md">
                        {notificationCount > 9 ? '9+' : notificationCount}
                      </span>
                    )}
                  </button>

                  {/* Enhanced User Menu */}
                  <div className="relative" ref={menuRef}>
                    <button
                      aria-label="User menu"
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center space-x-3 p-2 pl-3 pr-4 text-gray-700 hover:text-teal-700 hover:bg-teal-50 rounded-xl transition-all duration-200 border border-transparent hover:border-teal-200"
                    >
                      <div className="relative">
                        <img
                          src={user?.avatar || '/api/placeholder/36/36'}
                          alt={user?.name || 'User avatar'}
                          className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-100 hover:ring-teal-200 transition-all duration-200"
                        />
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
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

                    {/* Enhanced User Dropdown */}
                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-xl ring-1 ring-black/5 border border-gray-100 py-3 z-50 animate-in slide-in-from-top-2 duration-200">
                        {/* User Info Section */}
                        <div className="px-4 py-3 border-b border-gray-100">
                          <div className="flex items-center space-x-3">
                            <img
                              src={user?.avatar || '/api/placeholder/48/48'}
                              alt={user?.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900">{user?.name}</p>
                              <p className="text-sm text-gray-500">{user?.email}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <div className="flex items-center space-x-1">
                                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                  <span className="text-xs text-gray-600">4.9 rating</span>
                                </div>
                                <span className="text-gray-300">•</span>
                                <span className="text-xs text-teal-600 font-medium">Pro Member</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Quick Stats */}
                        <div className="px-4 py-3 border-b border-gray-100">
                          <div className="grid grid-cols-3 gap-3 text-center">
                            <div className="bg-teal-50 rounded-lg p-2">
                              <div className="text-lg font-bold text-teal-700">47</div>
                              <div className="text-xs text-gray-600">Credits</div>
                            </div>
                            <div className="bg-blue-50 rounded-lg p-2">
                              <div className="text-lg font-bold text-blue-700">12</div>
                              <div className="text-xs text-gray-600">Active</div>
                            </div>
                            <div className="bg-green-50 rounded-lg p-2">
                              <div className="text-lg font-bold text-green-700">98%</div>
                              <div className="text-xs text-gray-600">Success</div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Menu Items */}
                        <div className="py-2">
                          <Link 
                            href="/dashboard" 
                            className="flex items-center px-4 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors duration-150 group"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <BarChart3 size={18} className="mr-3 text-gray-400 group-hover:text-teal-500" />
                            Dashboard
                          </Link>
                          <Link 
                            href="/profile" 
                            className="flex items-center px-4 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors duration-150 group"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <UserCircle size={18} className="mr-3 text-gray-400 group-hover:text-teal-500" />
                            Profile
                          </Link>
                          <Link 
                            href="/credits" 
                            className="flex items-center px-4 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors duration-150 group"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <CreditCard size={18} className="mr-3 text-gray-400 group-hover:text-teal-500" />
                            Credits & Billing
                          </Link>
                          <Link 
                            href="/settings" 
                            className="flex items-center px-4 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors duration-150 group"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Settings size={18} className="mr-3 text-gray-400 group-hover:text-teal-500" />
                            Settings
                          </Link>
                        </div>
                        
                        {/* Logout Section */}
                        <div className="border-t border-gray-100 pt-2">
                          <button 
                            onClick={() => {
                              logout()
                              setIsUserMenuOpen(false)
                            }}
                            className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-150 group"
                          >
                            <LogOut size={18} className="mr-3 group-hover:text-red-700" />
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
                    className="px-4 py-2.5 text-gray-700 font-medium hover:text-teal-700 transition-colors duration-200"
                  >
                    Sign In
                  </Link>
                  <Link 
                    href="/auth/register" 
                    className="inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 text-white font-semibold rounded-xl hover:from-teal-700 hover:to-teal-800 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
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
              className="lg:hidden p-2.5 text-gray-600 hover:text-teal-700 hover:bg-teal-50 rounded-xl transition-all duration-200"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Enhanced Mobile Navigation */}
        <div 
          className={`lg:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen 
              ? 'max-h-screen opacity-100' 
              : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <div className="bg-gradient-to-br from-gray-50 to-teal-50 border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-4">
              {/* Mobile Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search services..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Mobile Navigation Links */}
              <div className="space-y-3">
                <Link 
                  href="/requests/create" 
                  className="flex items-center w-full px-5 py-4 bg-gradient-to-r from-teal-600 to-teal-700 text-white font-semibold rounded-xl shadow-md"
                  onClick={closeMobileMenu}
                >
                  <Plus size={20} className="mr-3" />
                  Post a Request
                </Link>
                
                <Link 
                  href="/categories" 
                  className="flex items-center w-full px-5 py-4 text-gray-700 font-medium bg-white rounded-xl border border-gray-100 hover:bg-teal-50 transition-colors duration-200"
                  onClick={closeMobileMenu}
                >
                  <Grid3x3 size={20} className="mr-3 text-teal-600" />
                  Browse Categories
                </Link>
                
                <Link 
                  href="/how-it-works" 
                  className="flex items-center w-full px-5 py-4 text-gray-700 font-medium bg-white rounded-xl border border-gray-100 hover:bg-teal-50 transition-colors duration-200"
                  onClick={closeMobileMenu}
                >
                  <HelpCircle size={20} className="mr-3 text-teal-600" />
                  How it Works
                </Link>
              </div>

              {/* Enhanced Mobile Auth Section */}
              {isAuthenticated ? (
                <div className="pt-4 border-t border-gray-200 space-y-3">
                  {/* Mobile User Info */}
                  <div className="flex items-center px-5 py-4 bg-white rounded-xl border border-gray-100">
                    <img
                      src={user?.avatar || '/api/placeholder/48/48'}
                      alt={user?.name || 'User'}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{user?.name}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-medium">Pro Member</span>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Quick Stats */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
                      <div className="text-xl font-bold text-teal-700">47</div>
                      <div className="text-xs text-gray-600">Credits</div>
                    </div>
                    <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
                      <div className="text-xl font-bold text-blue-700">12</div>
                      <div className="text-xs text-gray-600">Active</div>
                    </div>
                    <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
                      <div className="text-xl font-bold text-green-700">98%</div>
                      <div className="text-xs text-gray-600">Success</div>
                    </div>
                  </div>

                  {/* Mobile User Menu Items */}
                  <div className="space-y-2">
                    <Link 
                      href="/dashboard" 
                      className="flex items-center w-full px-5 py-4 text-gray-700 font-medium bg-white rounded-xl border border-gray-100"
                      onClick={closeMobileMenu}
                    >
                      <BarChart3 size={20} className="mr-3 text-teal-600" />
                      Dashboard
                    </Link>
                    <Link 
                      href="/profile" 
                      className="flex items-center w-full px-5 py-4 text-gray-700 font-medium bg-white rounded-xl border border-gray-100"
                      onClick={closeMobileMenu}
                    >
                      <UserCircle size={20} className="mr-3 text-teal-600" />
                      Profile
                    </Link>
                    <Link 
                      href="/settings" 
                      className="flex items-center w-full px-5 py-4 text-gray-700 font-medium bg-white rounded-xl border border-gray-100"
                      onClick={closeMobileMenu}
                    >
                      <Settings size={20} className="mr-3 text-teal-600" />
                      Settings
                    </Link>
                    <button 
                      onClick={() => {
                        logout()
                        closeMobileMenu()
                      }}
                      className="flex items-center w-full px-5 py-4 text-red-600 font-medium bg-white rounded-xl border border-red-100"
                    >
                      <LogOut size={20} className="mr-3" />
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-200 space-y-3">
                  <Link 
                    href="/auth/login" 
                    className="flex items-center justify-center w-full px-5 py-4 text-gray-700 font-medium bg-white rounded-xl border border-gray-100"
                    onClick={closeMobileMenu}
                  >
                    Sign In
                  </Link>
                  <Link 
                    href="/auth/register" 
                    className="flex items-center justify-center w-full px-5 py-4 bg-gradient-to-r from-teal-600 to-teal-700 text-white font-semibold rounded-xl shadow-md"
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

      {/* Enhanced Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}
    </>
  )}