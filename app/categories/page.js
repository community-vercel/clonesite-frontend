'use client'

import { useState, useEffect } from 'react'
import { categoriesAPI } from '../../lib/api'
import Footer from '../../components/layout/Footer'
import { Search, Grid, List, Filter } from 'lucide-react'
import Link from 'next/link'

const iconComponents = {
  'home': '🏠',
  'heart': '💖',
  'camera': '📷',
  'briefcase': '💼',
  'graduation-cap': '🎓',
  'wrench': '🔧'
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState('grid')
  const [sortBy, setSortBy] = useState('name')

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getCategories()
      if (response.success) {
        setCategories(response.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCategories = categories
    .filter(category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'services':
          return (b.serviceCount || 0) - (a.serviceCount || 0)
        default:
          return 0
      }
    })

  return (
    <div className="min-h-screen flex flex-col">
 
      
      <div className="flex-1 bg-gray-50">
        {/* Hero Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Browse All Categories
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Find the perfect professional for your needs across all our service categories
              </p>
              
              {/* Search */}
              <div className="max-w-md mx-auto relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {loading ? 'Loading...' : `${filteredCategories.length} Categories`}
              </h2>
            </div>
            
            <div className="flex items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="name">Sort by Name</option>
                <option value="services">Sort by Service Count</option>
              </select>
              
              <div className="flex border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {loading ? (
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-8 shadow-sm animate-pulse">
                  <div className="w-16 h-16 bg-gray-300 rounded-2xl mb-6"></div>
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <Search size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
              <p className="text-gray-600">Try adjusting your search terms.</p>
            </div>
          ) : (
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {filteredCategories.map((category) => (
                <Link
                  key={category._id}
                  href={`/services?category=${encodeURIComponent(category.name)}`}
                  className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group"
                >
                  <div className="flex items-start space-x-4">
                    <div className="text-4xl mb-4">
                      {iconComponents[category.icon] || '🔧'}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {category.description || 'Professional services in this category'}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 font-medium">
                          {(category.serviceCount || 0).toLocaleString()} professionals
                        </span>
                        <span className="text-primary-600 font-semibold group-hover:text-primary-700 transition-colors flex items-center">
                          Browse →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
