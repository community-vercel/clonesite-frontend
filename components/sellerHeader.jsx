'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../app/context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  HelpCircle, 
  ChevronDown, 
  Bell, 
  Search, 
  Menu, 
  X,
  BarChart3,
  Target,
  MessageCircle,
  Settings as SettingsIcon,
  CreditCard,
  Star,
  TrendingUp,
  Users,
  Award,
  Zap,
  LogOut
} from 'lucide-react'

export function SellerHeader() {
  const { user, logout, isAuthenticated } = useAuth()
  const router = useRouter()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [notificationCount, setNotificationCount] = useState(5)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
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

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  if (!isAuthenticated) return null

  const navigationItems = [
    { href: '/dashboard', label: 'Dashboard', icon: BarChart3, color: 'text-blue-600' },
    { href: '/dashboard/leads', label: 'Leads', icon: Target, color: 'text-orange-600', badge: '12' },
    { href: '/dashboard/response', label: 'My Responses', icon: MessageCircle, color: 'text-green-600' },
    { href: '/dashboard/settings', label: 'Settings', icon: SettingsIcon, color: 'text-gray-600' },
  ]

  return (
    <>
      <header className={`sticky top-0 z-50 transition-all duration-300 ease-in-out ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200'
          : 'bg-white border-b border-gray-100'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-28 lg:h-26">
            {/* Enhanced Logo */}
            <div className="flex items-center space-x-6">
              <Link href="/dashboard" className="flex items-center space-x-3 group">
                <div className="relative">
                  <div className="w-10 h-10= lg:w-16 lg:h-12 bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:rotate-3">
                    <span className="text-white font-bold text-lg lg:text-xl">S</span>
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-br from-teal-600 to-teal-800 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                </div>
                <div>
                  <span className="text-xl lg:text-xl font-bold bg-gradient-to-r from-teal-700 to-teal-900 bg-clip-text text-transparent">
                    Service Hub
                  </span>
                  <div className="text-xs text-gray-500 font-medium -mt-1 hidden sm:block">
                    Professional Dashboard
                  </div>
                </div>
              </Link>

       
            </div>

            {/* Enhanced Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigationItems.map((item) => (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className="relative inline-flex items-center px-4 py-2.5 text-gray-700 hover:text-teal-700 font-medium rounded-xl hover:bg-teal-50 transition-all duration-200 group"
                >
                  <item.icon size={18} className={`mr-2 ${item.color} group-hover:text-teal-600`} />
                  {item.label}
                  {item.badge && (
                    <span className="ml-2 bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full font-medium">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </nav>

            {/* Enhanced Right Section */}
            <div className="flex items-center space-x-3">
              {/* Search - Desktop */}
              <button className="hidden lg:flex p-2.5 text-gray-600 hover:text-teal-700 hover:bg-teal-50 rounded-xl transition-all duration-200">
                <Search size={20} />
              </button>

              {/* Enhanced Notifications */}
              {/* <button className="relative p-2.5 text-gray-600 hover:text-teal-700 hover:bg-teal-50 rounded-xl transition-all duration-200 group">
                <Bell size={20} />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full min-w-5 h-5 flex items-center justify-center px-1 animate-pulse shadow-md">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                )}
              </button> */}

              {/* Enhanced User Menu */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-3 p-2 pl-3 pr-4 text-gray-700 hover:text-teal-700 hover:bg-teal-50 rounded-xl transition-all duration-200 border border-transparent hover:border-teal-200"
                >
                  <div className="relative">
 <div className={`w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white font-bold text-lg relative shadow-md`}>
                    {user?.email?.[0]?.toUpperCase() || "?"}
                  
                  </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
                  </div>
                  <div className="hidden md:flex flex-col items-start">
                    <span className="font-semibold text-sm leading-tight">
                      {user?.name || 'Professional'}
                    </span>
                    <span className="text-xs text-gray-500 leading-tight">
                      Pro Member
                    </span>
                  </div>
                  <ChevronDown 
                    size={16} 
                    className={`hidden md:block transition-transform duration-200 ${
                      isUserMenuOpen ? 'rotate-180' : ''
                    }`} 
                  />
                </button>

                {/* Enhanced User Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl ring-1 ring-black/5 border border-gray-100 py-3 z-50 animate-in slide-in-from-top-2 duration-200">
                    {/* User Profile Section */}
                    <div className="px-4 py-4 border-b border-gray-100">
                      <div className="flex items-center space-x-4">
                        {user?.email?.[0]?.toUpperCase() || "?"}
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 text-lg">{user?.name}</h3>
                          <p className="text-sm text-gray-500">{user?.email}</p>
                          <div className="flex items-center space-x-3 mt-2">
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm font-medium text-gray-700">4.9</span>
                            </div>
                            <span className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded-full font-medium">
                              Pro Member
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="px-4 py-4 border-b border-gray-100">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">This Month</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-3 text-center">
                          <TrendingUp className="w-5 h-5 text-teal-600 mx-auto mb-1" />
                          <div className="text-lg font-bold text-teal-700">47</div>
                          <div className="text-xs text-gray-600">Credits</div>
                        </div>
                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-3 text-center">
                          <Target className="w-5 h-5 text-orange-600 mx-auto mb-1" />
                          <div className="text-lg font-bold text-orange-700">12</div>
                          <div className="text-xs text-gray-600">Active Leads</div>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-3 text-center">
                          <Award className="w-5 h-5 text-green-600 mx-auto mb-1" />
                          <div className="text-lg font-bold text-green-700">98%</div>
                          <div className="text-xs text-gray-600">Success Rate</div>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 text-center">
                          <Users className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                          <div className="text-lg font-bold text-blue-700">156</div>
                          <div className="text-xs text-gray-600">Total Jobs</div>
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
                        Dashboard Overview
                      </Link>
                      <Link 
                        href="/dashboard/leads" 
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition-colors duration-150 group"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Target size={18} className="mr-3 text-gray-400 group-hover:text-orange-500" />
                        <span>Leads & Opportunities</span>
                        <span className="ml-auto bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full font-medium">12</span>
                      </Link>
                      <Link 
                        href="/dashboard/response" 
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors duration-150 group"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <MessageCircle size={18} className="mr-3 text-gray-400 group-hover:text-green-500" />
                        My Responses
                      </Link>
                      <Link 
                        href="/dashboard/credits" 
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-150 group"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <CreditCard size={18} className="mr-3 text-gray-400 group-hover:text-blue-500" />
                        Credits & Billing
                      </Link>
                      <Link 
                        href="/dashboard/settings" 
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150 group"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <SettingsIcon size={18} className="mr-3 text-gray-400 group-hover:text-gray-600" />
                        Account Settings
                      </Link>
                    </div>
                    
                    {/* Help & Support */}
                    <div className="border-t border-gray-100 py-2">
                      <Link 
                        href="/help" 
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-yellow-50 hover:text-yellow-700 transition-colors duration-150 group"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <HelpCircle size={18} className="mr-3 text-gray-400 group-hover:text-yellow-500" />
                        Help & Support
                      </Link>
                    </div>
                    
                    {/* Logout Section */}
                    <div className="border-t border-gray-100 pt-2">
                      <button 
                        onClick={() => {
                          handleLogout()
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

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2.5 text-gray-600 hover:text-teal-700 hover:bg-teal-50 rounded-xl transition-all duration-200"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Mobile Navigation */}
        <div 
          className={`lg:hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen 
              ? 'max-h-screen opacity-100' 
              : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <div className="bg-gradient-to-br from-gray-50 to-teal-50 border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-4">
              {/* Mobile User Info */}
              <div className="flex items-center px-5 py-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                <img
                  src={user?.avatar || '/api/placeholder/48/48'}
                  alt={user?.name || 'User'}
                  className="w-12 h-12 rounded-full object-cover mr-4 ring-2 ring-teal-100"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{user?.name}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-medium">Pro Member</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-600">4.9</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Quick Stats */}
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-white rounded-xl p-4 text-center border border-gray-100 shadow-sm">
                  <div className="text-lg font-bold text-teal-700">47</div>
                  <div className="text-xs text-gray-600">Credits</div>
                </div>
                <div className="bg-white rounded-xl p-4 text-center border border-gray-100 shadow-sm">
                  <div className="text-lg font-bold text-orange-600">12</div>
                  <div className="text-xs text-gray-600">Leads</div>
                </div>
                <div className="bg-white rounded-xl p-4 text-center border border-gray-100 shadow-sm">
                  <div className="text-lg font-bold text-green-600">98%</div>
                  <div className="text-xs text-gray-600">Success</div>
                </div>
                <div className="bg-white rounded-xl p-4 text-center border border-gray-100 shadow-sm">
                  <div className="text-lg font-bold text-blue-600">156</div>
                  <div className="text-xs text-gray-600">Total</div>
                </div>
              </div>

              {/* Mobile Navigation Items */}
              <div className="space-y-2">
                {navigationItems.map((item) => (
                  <Link 
                    key={item.href}
                    href={item.href} 
                    className="flex items-center justify-between w-full px-5 py-4 text-gray-700 font-medium bg-white rounded-xl border border-gray-100 shadow-sm hover:bg-teal-50 transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="flex items-center">
                      <item.icon size={20} className={`mr-3 ${item.color}`} />
                      {item.label}
                    </div>
                    {item.badge && (
                      <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full font-medium">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </div>

              {/* Mobile Help & Logout */}
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <Link 
                  href="/help" 
                  className="flex items-center w-full px-5 py-4 text-gray-700 font-medium bg-white rounded-xl border border-gray-100 shadow-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <HelpCircle size={20} className="mr-3 text-yellow-600" />
                  Help & Support
                </Link>
                <button 
                  onClick={() => {
                    handleLogout()
                    setIsMobileMenuOpen(false)
                  }}
                  className="flex items-center w-full px-5 py-4 text-red-600 font-medium bg-white rounded-xl border border-red-100 shadow-sm"
                >
                  <LogOut size={20} className="mr-3" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
}