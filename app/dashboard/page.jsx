'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/navigation'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import { 
  Plus, 
  MessageSquare, 
  Star, 
  TrendingUp, 
  Calendar,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({
    activeRequests: 0,
    totalQuotes: 0,
    avgRating: 0,
    earnings: 0
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    
    fetchDashboardData()
  }, [isAuthenticated, router])

  const fetchDashboardData = async () => {
    try {
      // Simulate API call with dummy data
      setStats({
        activeRequests: 3,
        totalQuotes: 12,
        avgRating: 4.8,
        earnings: 2500
      })
      
      setRecentActivity([
        {
          id: 1,
          type: 'quote_received',
          title: 'New quote received for "House Cleaning Service"',
          time: '2 hours ago',
          status: 'pending'
        },
        {
          id: 2,
          type: 'request_completed',
          title: 'Service request completed - "Garden Design"',
          time: '1 day ago',
          status: 'completed'
        },
        {
          id: 3,
          type: 'review_received',
          title: 'New 5-star review from Sarah Johnson',
          time: '2 days ago',
          status: 'positive'
        }
      ])
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case 'quote_received':
        return <MessageSquare className="w-5 h-5 text-blue-600" />
      case 'request_completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'review_received':
        return <Star className="w-5 h-5 text-yellow-600" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />
    }
  }

  if (!isAuthenticated) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* <Header /> */}
      
      <div className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-gray-600 mt-2">
              Here's what's happening with your {user?.userType === 'provider' ? 'services' : 'requests'}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Requests</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeRequests}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-xl">
                  <MessageSquare className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Quotes</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalQuotes}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-xl">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Average Rating</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.avgRating}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Earnings</p>
                  <p className="text-2xl font-bold text-gray-900">£{stats.earnings.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Actions */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                <div className="space-y-4">
                  {user?.userType === 'customer' ? (
                    <>
                      <Link
                        href="/requests/new"
                        className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 group"
                      >
                        <div className="p-2 bg-primary-100 rounded-lg group-hover:bg-primary-200 transition-colors">
                          <Plus className="w-6 h-6 text-primary-600" />
                        </div>
                        <div className="ml-4">
                          <h3 className="font-semibold text-gray-900">Post New Request</h3>
                          <p className="text-sm text-gray-600">Get quotes from professionals</p>
                        </div>
                      </Link>
                      
                      <Link
                        href="/requests"
                        className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 group"
                      >
                        <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                          <Eye className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                          <h3 className="font-semibold text-gray-900">View My Requests</h3>
                          <p className="text-sm text-gray-600">Manage active requests</p>
                        </div>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/services/create"
                        className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 group"
                      >
                        <div className="p-2 bg-primary-100 rounded-lg group-hover:bg-primary-200 transition-colors">
                          <Plus className="w-6 h-6 text-primary-600" />
                        </div>
                        <div className="ml-4">
                          <h3 className="font-semibold text-gray-900">Add New Service</h3>
                          <p className="text-sm text-gray-600">Expand your offerings</p>
                        </div>
                      </Link>
                      
                      <Link
                        href="/quotes"
                        className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 group"
                      >
                        <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                          <MessageSquare className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                          <h3 className="font-semibold text-gray-900">Manage Quotes</h3>
                          <p className="text-sm text-gray-600">View and update quotes</p>
                        </div>
                      </Link>
                    </>
                  )}
                  
                  <Link
                    href="/profile"
                    className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 group"
                  >
                    <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                      <Star className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-gray-900">Update Profile</h3>
                      <p className="text-sm text-gray-600">Keep your info current</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                  <Link href="/activity" className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                    View all
                  </Link>
                </div>

                {loading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gray-300 rounded-lg"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : recentActivity.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="font-medium">No recent activity</p>
                    <p className="text-sm">Your activity will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                        <div className="flex-shrink-0 p-2 bg-gray-100 rounded-lg">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{activity.title}</p>
                          <p className="text-sm text-gray-600 flex items-center mt-1">
                            <Clock size={12} className="mr-1" />
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
