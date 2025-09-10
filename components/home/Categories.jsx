'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { categoriesAPI } from '../../lib/api';
import { Home, Heart, Camera, Briefcase, GraduationCap, Wrench, ArrowRight, Lightbulb, Monitor, Cog, Smartphone, Palette, Notebook, Hammer, Dumbbell, Leaf, Paintbrush } from 'lucide-react';
import { motion } from 'framer-motion';


export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getCategories();
      if (response.success) {
        setCategories(response.data || []);
      } else {
        setError('Failed to load categories. Please try again later.');
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setError('Failed to load categories. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const iconMap = {
    Home,
    Heart,
    Camera,
    Briefcase,
    GraduationCap,
    Wrench,
    Broom: Paintbrush,
    Lightbulb,
    MonitorSmartphone: Monitor,
    Cog,
    Smartphone,
    Palette,
    Notebook,
    Hammer,
    Dumbbell,
    Leaf,
    SprayCan: Paintbrush,
  };

  const colorMap = {
    'house-cleaning': 'bg-blue-100 text-blue-600',
    'life-coaching': 'bg-yellow-100 text-yellow-600',
    'web-design': 'bg-indigo-100 text-indigo-600',
    'general-photography': 'bg-pink-100 text-pink-600',
    'web-development': 'bg-purple-100 text-purple-600',
    'social-media-marketing': 'bg-green-100 text-green-600',
    'graphic-design': 'bg-red-100 text-red-600',
    'bookkeeping-services': 'bg-orange-100 text-orange-600',
    'general-builders': 'bg-stone-100 text-stone-600',
    'personal-trainers': 'bg-emerald-100 text-emerald-600',
    'gardening': 'bg-lime-100 text-lime-600',
    'commercial-office-cleaning': 'bg-cyan-100 text-cyan-600',
    default: 'bg-gray-100 text-gray-600',
  };

  if (error) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600 text-lg">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="text-center animate-pulse">
                <div className="w-20 h-20 bg-gray-300 rounded-2xl mx-auto mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-24 mx-auto mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-16 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const IconComponent = iconMap[category.icon] || (console.warn(`Icon ${category.icon} not found, using fallback`), Wrench);
            const colorClasses = colorMap[category.color] || colorMap.default;

            return (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="will-change-transform"
              >
                <Link
                  href={`/services?category=${encodeURIComponent(category.slug || category.name)}`}
                  aria-label={`View services for ${category.name}`}
                >
                  <div className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 card-hover border border-gray-100">
                    <div
                      className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${colorClasses} mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <IconComponent size={28} aria-hidden="true" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">{category.description}</p>
                    <p className="text-xs font-medium text-purple-600">
                      {category.count ? `${category.count} ${category.count === 1 ? 'service' : 'services'} available` : 'No services available'}
                    </p>
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="h-6 w-6 bg-purple-100 rounded-full flex items-center justify-center" aria-label="View more">
                        <svg className="h-3 w-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-300">
                      <div className={`h-full w-full rounded-2xl bg-gradient-to-br ${colorClasses}`} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
        <div className="text-center mt-12">
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
  );
}