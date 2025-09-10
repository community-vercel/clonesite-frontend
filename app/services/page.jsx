'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { servicesAPI, categoriesAPI } from '../../lib/api'
import ServiceCard from '../../components/ServiceCard'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import { Search, Filter, Grid, List, SlidersHorizontal } from 'lucide-react'

export default function ServicesPage() {
  const searchParams = useSearchParams()
  const [services, setServices] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)
  
  const [filters, setFilters] = useState({
    q: searchParams.get('q') || '',
    category: searchParams.get('category') || '',
    location: searchParams.get('location') || '',
    minPrice: '',
    maxPrice: '',
    rating: '',
    availability: '',
    verified: false,
    sortBy: 'relevance'
  })

  useEffect(() => {
    fetchCategories()
    fetchServices()
  }, [filters])

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getCategories()
      if (response.success) {
        setCategories(response.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const fetchServices = async () => {
    setLoading(true)
    try {
      const response = await servicesAPI.getServices(filters)
      if (response.success) {
        setServices(response.data?.items || response.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch services:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      q: '',
      category: '',
      location: '',
      minPrice: '',
      maxPrice: '',
      rating: '',
      availability: '',
      verified: false,
      sortBy: 'relevance'
    })
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* <Header /> */}
      
      <div className="flex-1 bg-gray-50">
        {/* Search Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={filters.q}
                  onChange={(e) => handleFilterChange('q', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div className="flex gap-3">
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category._id} value={category.name}>
                    {category.name}
                  </option>
                  ))}
                </select>
                
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <SlidersHorizontal size={20} className="mr-2" />
                  Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    placeholder="Enter location"
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <select
                    value={filters.rating}
                    onChange={(e) => handleFilterChange('rating', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Any rating</option>
                    <option value="4.5">4.5+ stars</option>
                    <option value="4.0">4.0+ stars</option>
                    <option value="3.5">3.5+ stars</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                  <select
                    value={filters.availability}
                    onChange={(e) => handleFilterChange('availability', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Any time</option>
                    <option value="immediate">Available now</option>
                    <option value="within-week">Within a week</option>
                    <option value="within-month">Within a month</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="verified"
                    checked={filters.verified}
                    onChange={(e) => handleFilterChange('verified', e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="verified" className="ml-2 text-sm text-gray-700">
                    Verified professionals only
                  </label>
                </div>
                
                <button
                  onClick={clearFilters}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {loading ? 'Loading...' : `${services.length} Services Found`}
              </h1>
              {filters.q && (
                <p className="text-gray-600 mt-1">Results for "{filters.q}"</p>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="relevance">Most Relevant</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
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

        {/* Results */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {loading ? (
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                  <div className="bg-gray-300 h-48 rounded-lg mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search criteria or browse all categories.</p>
              <button
                onClick={clearFilters}
                className="btn-primary"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {services.map((service) => (
                <ServiceCard key={service._id} service={service} />
              ))}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  )
}