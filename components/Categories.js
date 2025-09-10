'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { categoriesAPI } from '../../lib/api'
import { Home, Heart, Camera, Briefcase, GraduationCap, Wrench, ArrowRight, Lightbulb, Monitor, Cog, Smartphone, Palette, Notebook, Hammer, Dumbbell, Leaf, Paintbrush } from 'lucide-react'

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

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

  // Map API icon names to Lucide React components or fallbacks
  const iconMap = {
    Home: Home,
    Heart: Heart,
    Camera: Camera,
    Briefcase: Briefcase,
    GraduationCap: GraduationCap,
    Wrench: Wrench,
    Broom: Paintbrush, // Fallback for unavailable Broom
    Lightbulb: Lightbulb,
    MonitorSmartphone: Monitor, // Fallback for unavailable MonitorSmartphone
    Cog: Cog,
    Smartphone: Smartphone,
    Palette: Palette,
    Notebook: Notebook,
    Hammer: Hammer,
    Dumbbell: Dumbbell,
    Leaf: Leaf,
    SprayCan: Paintbrush, // Fallback for unavailable SprayCan
  }

  // Color map for category styling
  const colorMap = {
    gray: 'bg-gray-100 text-gray-600',
    // Add more colors if API provides specific color values
  }

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="text-center animate-pulse">
                <div className="w-20 h-20 bg-gray-300 rounded-2xl mx-auto mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-24 mx-auto mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-16 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Browse by Category
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find the perfect professional for your specific needs
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
          {categories.map((category) => {
            const IconComponent = iconMap[category.icon] || Wrench
            const colorClasses = colorMap[category.color] || colorMap.gray

            return (
              <Link
                key={category._id}
                href={`/services?category=${encodeURIComponent(category.name)}`}
                className="group text-center p-6 rounded-2xl hover:bg-gray-50 transition-all duration-200"
              >
                <div className={`w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-all duration-200 group-hover:scale-110 ${colorClasses}`}>
                  <IconComponent size={28} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {category.serviceCount?.toLocaleString() || '0'} services
                </p>
              </Link>
            )
          })}
        </div>

        <div className="text-center">
          <Link
            href="/categories"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold group"
          >
            View all categories
            <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  )
}