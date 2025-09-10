'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin, ArrowRight } from 'lucide-react'

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState('')
  const [location, setLocation] = useState('')
  const router = useRouter()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      const params = new URLSearchParams({
        q: searchQuery.trim(),
        ...(location.trim() && { location: location.trim() })
      })
      router.push(`/services?${params.toString()}`)
    }
  }

  const popularSearches = [
    'House Cleaning',
    'Web Design',
    'Personal Training',
    'Gardening',
    'Photography',
    'Plumbing'
  ]

  return (
    <section className="relative bg-gradient-to-br from-primary-50 via-blue-50 to-indigo-100 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-500"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Find the perfect
            <span className="block bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">
              professional for you
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Get free quotes within minutes from verified professionals in your area. 
            Compare prices, read reviews, and hire with confidence.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto mb-12">
            <div className="bg-white rounded-2xl shadow-xl p-2 flex flex-col lg:flex-row gap-2 border border-gray-100">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="What service are you looking for?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-lg bg-transparent focus:outline-none rounded-xl"
                />
              </div>
              
              <div className="flex-1 relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Enter your postcode or city"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-lg bg-transparent focus:outline-none rounded-xl"
                />
              </div>
              
              <button
                type="submit"
                className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 flex items-center justify-center group shadow-lg hover:shadow-xl"
              >
                <span>Search</span>
                <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>

          {/* Popular Searches */}
          <div className="max-w-4xl mx-auto">
            <p className="text-gray-600 mb-6 font-medium">Popular searches:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {popularSearches.map((term, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSearchQuery(term)
                    const params = new URLSearchParams({ q: term })
                    router.push(`/services?${params.toString()}`)
                  }}
                  className="bg-white/80 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-primary-600 px-6 py-3 rounded-full border border-gray-200 hover:border-primary-300 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
