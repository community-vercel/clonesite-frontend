'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { StarIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/solid';
import api from '../../lib/api'

export default function FeaturedServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const response = await api.get('/services/featured');

        if (response.data.success) {
          setServices(response.data.data.services || []);
        } else {
          setError(response.data.message || 'Failed to load featured services');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'An error occurred while fetching services');
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Use priceDisplay from API if available, fallback to computed pricing
  const getPriceDisplay = (service) => {
    return service.priceDisplay || (service.pricing?.amount?.min && service.pricing?.amount?.max
      ? `$${service.pricing.amount.min} - $${service.pricing.amount.max}`
      : 'Contact for pricing');
  };

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Services</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-2xl h-96 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Services</h2>
          </div>
          <div className="text-center py-12">
            <p className="text-red-600 font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2
            className="text-4xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Featured Services
          </motion.h2>
          <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Discover top-rated professionals ready to help with your next project. Quality guaranteed,
            trusted by thousands.
          </motion.p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link href={`/services/${service._id}`}>
                <div className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 card-hover border border-gray-100 overflow-hidden">
                  {/* Image */}
                  <div className="relative h-48 bg-gray-200 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
                    <div className="absolute top-4 left-4 z-20">
                      <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                        Featured
                      </span>
                    </div>
                    <div className="absolute top-4 right-4 z-20">
                      <span className="bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
                        {getPriceDisplay(service)}
                      </span>
                    </div>
                    {service.primaryImage ? (
                    <img
  src={service.primaryImage || "/default-avatar.jpg"}
  alt={service.title || "Default Avatar"}
  className="object-cover group-hover:scale-105 transition-transform duration-300"
/>
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-purple-400 to-blue-500 group-hover:scale-105 transition-transform duration-300" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Category */}
                    <div className="text-xs font-medium text-purple-600 mb-2 uppercase tracking-wide">
                      {service.category.name}
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {service.shortDescription || service.description}
                    </p>

                    {/* Provider Info */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200">
                          {service.provider.avatar ? (
                           <img
  src={ "https://mdbcdn.b-cdn.net/img/new/avatars/2.webp" ||service?.provider?.avatar }
  alt={service?.provider?.businessName || service?.provider?.firstName || "User"}
  width={32}
  height={32}
  className="object-cover"
/>

                          ) : (
                            <div className="h-full w-full bg-gradient-to-r from-purple-400 to-blue-500" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {service.provider.businessName || `${service.provider.firstName} ${service.provider.lastName}`}
                          </p>
                          <div className="flex items-center space-x-1">
                            <StarIcon className="h-3 w-3 text-yellow-400" />
                            <span className="text-xs text-gray-600">
                              {service.provider.rating?.average || service.provider.rating || 0} (
                              {service.rating?.count || service.provider.reviewCount || 0})
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Location & Response Time */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <MapPinIcon className="h-3 w-3" />
                        <span>
                          {service.serviceAreas?.[0]?.city || service.location?.city},{' '}
                          {service.serviceAreas?.[0]?.state || service.location?.state}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ClockIcon className="h-3 w-3" />
                        <span>
                          Responds{' '}
                          {service.responseTime?.average
                            ? `< ${service.responseTime.target || 'N/A'} hours`
                            : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <Link
            href="/services"
            className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors text-lg font-semibold"
          >
            Browse All Services
          </Link>
        </motion.div>
      </div>
    </section>
  );
}