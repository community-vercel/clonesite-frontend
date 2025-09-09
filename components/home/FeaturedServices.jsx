'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { StarIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/solid';
import { servicesAPI } from '@/lib/api';

export default function FeaturedServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration (replace with actual API call)
  const mockServices = [
    {
      _id: '1',
      title: 'Professional Home Cleaning Service',
      description: 'Deep cleaning service for residential properties. Eco-friendly products and experienced team.',
      images: ['/api/placeholder/400/300'],
      pricing: { type: 'hourly', amount: 35 },
      provider: {
        name: 'Sarah Johnson',
        avatar: '/api/placeholder/100/100',
        rating: 4.9,
        reviewCount: 127
      },
      location: { city: 'New York', state: 'NY' },
      category: 'Home & Garden',
      responseTime: '< 1 hour',
      featured: true
    },
    {
      _id: '2',
      title: 'Custom Web Development',
      description: 'Full-stack web development with modern technologies. From concept to deployment.',
      images: ['/api/placeholder/400/300'],
      pricing: { type: 'project', amount: 2500 },
      provider: {
        name: 'Mike Chen',
        avatar: '/api/placeholder/100/100',
        rating: 5.0,
        reviewCount: 89
      },
      location: { city: 'San Francisco', state: 'CA' },
      category: 'Technology',
      responseTime: '< 2 hours',
      featured: true
    },
    {
      _id: '3',
      title: 'Personal Fitness Training',
      description: 'One-on-one fitness coaching with personalized workout plans and nutrition guidance.',
      images: ['/api/placeholder/400/300'],
      pricing: { type: 'session', amount: 75 },
      provider: {
        name: 'David Rodriguez',
        avatar: '/api/placeholder/100/100',
        rating: 4.8,
        reviewCount: 203
      },
      location: { city: 'Miami', state: 'FL' },
      category: 'Health & Wellness',
      responseTime: '< 30 minutes',
      featured: true
    },
    {
      _id: '4',
      title: 'Professional Moving Service',
      description: 'Complete moving solutions for residential and commercial relocations. Insured and licensed.',
      images: ['/api/placeholder/400/300'],
      pricing: { type: 'hourly', amount: 95 },
      provider: {
        name: 'Elite Movers Co.',
        avatar: '/api/placeholder/100/100',
        rating: 4.7,
        reviewCount: 156
      },
      location: { city: 'Chicago', state: 'IL' },
      category: 'Moving & Delivery',
      responseTime: '< 1 hour',
      featured: true
    },
    {
      _id: '5',
      title: 'Wedding Photography',
      description: 'Capture your special day with professional wedding photography. Includes engagement session.',
      images: ['/api/placeholder/400/300'],
      pricing: { type: 'package', amount: 1800 },
      provider: {
        name: 'Emma Thompson',
        avatar: '/api/placeholder/100/100',
        rating: 4.9,
        reviewCount: 74
      },
      location: { city: 'Austin', state: 'TX' },
      category: 'Photography',
      responseTime: '< 4 hours',
      featured: true
    },
    {
      _id: '6',
      title: 'Plumbing Repair & Installation',
      description: '24/7 emergency plumbing services. Licensed and insured with upfront pricing.',
      images: ['/api/placeholder/400/300'],
      pricing: { type: 'service', amount: 125 },
      provider: {
        name: 'Pro Plumbers Inc.',
        avatar: '/api/placeholder/100/100',
        rating: 4.6,
        reviewCount: 298
      },
      location: { city: 'Phoenix', state: 'AZ' },
      category: 'Handyman',
      responseTime: '< 30 minutes',
      featured: true
    }
  ];

  useEffect(() => {
    // Replace with actual API call
    setTimeout(() => {
      setServices(mockServices);
      setLoading(false);
    }, 1000);
  }, []);

  const getPriceDisplay = (pricing) => {
    const { type, amount } = pricing;
    switch (type) {
      case 'hourly':
        return `$${amount}/hr`;
      case 'project':
        return `$${amount.toLocaleString()}`;
      case 'session':
        return `$${amount}/session`;
      case 'package':
        return `$${amount.toLocaleString()} package`;
      default:
        return `Starting at $${amount}`;
    }
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
            Discover top-rated professionals ready to help with your next project.
            Quality guaranteed, trusted by thousands.
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
                        {getPriceDisplay(service.pricing)}
                      </span>
                    </div>
                    <div className="h-full w-full bg-gradient-to-br from-purple-400 to-blue-500 group-hover:scale-105 transition-transform duration-300" />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Category */}
                    <div className="text-xs font-medium text-purple-600 mb-2 uppercase tracking-wide">
                      {service.category}
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {service.description}
                    </p>

                    {/* Provider Info */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-400 to-blue-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{service.provider.name}</p>
                          <div className="flex items-center space-x-1">
                            <StarIcon className="h-3 w-3 text-yellow-400" />
                            <span className="text-xs text-gray-600">
                              {service.provider.rating} ({service.provider.reviewCount})
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Location & Response Time */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <MapPinIcon className="h-3 w-3" />
                        <span>{service.location.city}, {service.location.state}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ClockIcon className="h-3 w-3" />
                        <span>Responds {service.responseTime}</span>
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
          <Link href="/services" className="btn-primary text-lg px-8 py-4">
            Browse All Services
          </Link>
        </motion.div>
      </div>
    </section>
  );
}