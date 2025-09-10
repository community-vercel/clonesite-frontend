'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin, Verified, Clock } from 'lucide-react';

export default function ServiceCard({ service }) {
  const formatPrice = (price) => {
    if (!price) return 'Contact for pricing';

    if (price.min === price.max) {
      return `£${price.min}/${price.unit}`;
    }
    return `From £${price.min}/${price.unit}`;
  };

  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case 'immediate':
        return 'text-green-600 bg-green-100';
      case 'within-week':
        return 'text-blue-600 bg-blue-100';
      case 'within-month':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getAvailabilityText = (availability) => {
    switch (availability) {
      case 'immediate':
        return 'Available now';
      case 'within-week':
        return 'Within a week';
      case 'within-month':
        return 'Within a month';
      default:
        return 'Flexible';
    }
  };

  return (
    <Link href={`/services/${service._id}`} className="block group">
      <div className="card card-hover overflow-hidden rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <div className="relative">
          <Image
            src={service.images?.[0] || '/api/placeholder/400/250'}
            alt={service.title || 'Service image'}
            width={400}
            height={250}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {service.verified && (
            <div className="absolute top-3 left-3 bg-green-600 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center">
              <Verified size={12} className="mr-1" />
              VERIFIED
            </div>
          )}

          {service.availability && (
            <div
              className={`absolute top-3 right-3 text-xs font-medium px-2 py-1 rounded-full flex items-center ${getAvailabilityColor(
                service.availability
              )}`}
            >
              <Clock size={12} className="mr-1" />
              {getAvailabilityText(service.availability)}
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-green-600 transition-colors line-clamp-2">
                {service.title || 'Untitled Service'}
              </h3>

              {service.provider && (
                <div className="flex items-center mb-2">
                  <img
                    src={service.provider.avatar || '/api/placeholder/24/24'}
                    alt={service.provider.name || 'Provider'}
                    className="w-6 h-6 rounded-full mr-2"
                    width={24}
                    height={24}
                  />
                  <span className="text-gray-600 text-sm font-medium">
                    {service.provider.name || 'Unknown Provider'}
                  </span>
                  {service.provider.verified && (
                    <Verified size={14} className="ml-1 text-green-600" />
                  )}
                </div>
              )}
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {service.description || 'No description available'}
          </p>

          {service.provider?.rating && (
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-semibold text-gray-900 ml-1">
                  {service.provider.rating.toFixed(1)}
                </span>
                {service.provider.reviewCount && (
                  <span className="text-sm text-gray-600 ml-1">
                    ({service.provider.reviewCount} reviews)
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="text-lg font-bold text-green-600">
              {formatPrice(service.price)}
            </div>

            {service.location && (
              <div className="flex items-center text-gray-500 text-sm">
                <MapPin size={14} />
                <span className="ml-1">{service.location.city || 'Unknown Location'}</span>
              </div>
            )}
          </div>

          {service.tags && service.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {service.tags.map((tag, index) => (
                <span
                  key={index}
                  className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  

        )}