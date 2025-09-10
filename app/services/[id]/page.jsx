'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { servicesAPI } from '../../../lib/api'
import Header from '../../../components/layout/Header'
import Footer from '../../../components/layout/Footer'
import { 
  Star, 
  MapPin, 
  Clock, 
  Verified, 
  Phone, 
  Mail, 
  Share2,
  Heart,
  Flag,
  ChevronLeft,
  ChevronRight,
  User,
  Calendar,
  Award
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function ServiceDetailPage() {
  const { id } = useParams()
  const [service, setService] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showContactModal, setShowContactModal] = useState(false)

  useEffect(() => {
    if (id) {
      fetchServiceDetails()
      fetchReviews()
    }
  }, [id])

  const fetchServiceDetails = async () => {
    try {
      const response = await servicesAPI.getService(id)
      if (response.success) {
        setService(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch service details:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchReviews = async () => {
    try {
      const response = await reviewsAPI.getByService(id)
      if (response.success) {
        setReviews(response.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error)
    }
  }

  const nextImage = () => {
    if (service?.images) {
      setCurrentImageIndex((prev) => 
        prev === service.images.length - 1 ? 0 : prev + 1
      )
    }
  }

  const prevImage = () => {
    if (service?.images) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? service.images.length - 1 : prev - 1
      )
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse">
              <div className="bg-gray-300 h-96 rounded-xl mb-8"></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                  <div className="h-8 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-32 bg-gray-300 rounded"></div>
                </div>
                <div className="bg-white p-6 rounded-xl">
                  <div className="h-6 bg-gray-300 rounded mb-4"></div>
                  <div className="h-10 bg-gray-300 rounded mb-4"></div>
                  <div className="h-10 bg-gray-300 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Service not found</h2>
            <Link href="/services" className="btn-primary">
              Browse Services
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-primary-600">Home</Link>
              <span>/</span>
              <Link href="/services" className="hover:text-primary-600">Services</Link>
              <span>/</span>
              <Link href={`/services?category=${service.category?.name}`} className="hover:text-primary-600">
                {service.category?.name}
              </Link>
              <span>/</span>
              <span className="text-gray-900">{service.title}</span>
            </div>
          </nav>

          {/* Image Gallery */}
          <div className="relative mb-8">
            <div className="relative h-96 rounded-xl overflow-hidden bg-gray-200">
              {service.images && service.images.length > 0 ? (
                <>
                  <Image
                    src={service.images[currentImageIndex]}
                    alt={service.title}
                    fill
                    className="object-cover"
                  />
                  
                  {service.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
                      >
                        <ChevronRight size={20} />
                      </button>
                      
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {service.images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-3 h-3 rounded-full transition-colors ${
                              index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <Image 
                    src="/api/placeholder/400/300" 
                    alt={service.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex space-x-2">
              <button className="bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors">
                <Heart size={20} />
              </button>
              <button className="bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors">
                <Share2 size={20} />
              </button>
              <button className="bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors">
                <Flag size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Service Header */}
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 mb-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{service.title}</h1>
                    <div className="flex items-center space-x-4 mb-4">
                      {service.provider && (
                        <div className="flex items-center">
                          <img
                            src={service.provider.avatar || '/api/placeholder/40/40'}
                            alt={service.provider.name}
                            className="w-10 h-10 rounded-full mr-3"
                          />
                          <div>
                            <h3 className="font-semibold text-gray-900 flex items-center">
                              {service.provider.name}
                              {service.provider.verified && (
                                <Verified size={16} className="ml-2 text-primary-600" />
                              )}
                            </h3>
                            {service.provider.rating && (
                              <div className="flex items-center">
                                <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                                <span className="text-sm text-gray-600">
                                  {service.provider.rating} ({service.provider.reviewCount} reviews)
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      {service.location && (
                        <div className="flex items-center">
                          <MapPin size={16} className="mr-1" />
                          {service.location.city}
                        </div>
                      )}
                      
                      {service.availability && (
                        <div className="flex items-center">
                          <Clock size={16} className="mr-1" />
                          Available {service.availability === 'immediate' ? 'now' : service.availability}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {service.verified && (
                    <div className="bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium flex items-center">
                      <Verified size={16} className="mr-2" />
                      Verified Service
                    </div>
                  )}
                </div>

                {/* Price */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="text-3xl font-bold text-primary-600">
                    {service.price ? (
                      service.price.min === service.price.max ? 
                        `£${service.price.min}/${service.price.unit}` :
                        `From £${service.price.min}/${service.price.unit}`
                    ) : 'Contact for pricing'}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Service</h2>
                <div className="prose prose-lg max-w-none text-gray-700">
                  <p>{service.description}</p>
                </div>

                {/* Tags */}
                {service.tags && service.tags.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Service Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {service.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Reviews */}
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
                  {service.provider?.rating && (
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                      <span className="text-lg font-semibold">{service.provider.rating}</span>
                      <span className="text-gray-600 ml-1">
                        ({service.provider.reviewCount} reviews)
                      </span>
                    </div>
                  )}
                </div>

                {reviews.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Star className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="font-medium">No reviews yet</p>
                    <p className="text-sm">Be the first to leave a review!</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {reviews.map((review, index) => (
                      <div key={index} className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
                        <div className="flex items-start">
                          <img
                            src={review.reviewer?.avatar || '/api/placeholder/40/40'}
                            alt={review.reviewer?.name || 'Reviewer'}
                            className="w-10 h-10 rounded-full mr-4"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-gray-900">
                                {review.reviewer?.name || 'Anonymous'}
                              </h4>
                              <div className="flex items-center">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    size={16}
                                    className={`${
                                      i < review.rating 
                                        ? 'text-yellow-400 fill-current' 
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-700 mb-2">{review.comment}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                {/* Contact Card */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Get a Quote</h3>
                  <p className="text-gray-600 mb-6">
                    Contact {service.provider?.name} for a personalized quote
                  </p>
                  
                  <div className="space-y-3">
                    <button
                      onClick={() => setShowContactModal(true)}
                      className="w-full btn-primary"
                    >
                      Request Quote
                    </button>
                    
                    <button className="w-full btn-secondary">
                      <Phone size={20} className="mr-2" />
                      Call Now
                    </button>
                    
                    <button className="w-full btn-secondary">
                      <Mail size={20} className="mr-2" />
                      Send Message
                    </button>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                    <p className="text-sm text-gray-600 mb-2">Response time</p>
                    <p className="font-semibold text-gray-900">Usually within 2 hours</p>
                  </div>
                </div>

                {/* Provider Info */}
                {service.provider && (
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">About the Provider</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <User className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">Member since</p>
                          <p className="text-sm text-gray-600">January 2023</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Award className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">Services completed</p>
                          <p className="text-sm text-gray-600">127 projects</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">Last active</p>
                          <p className="text-sm text-gray-600">2 hours ago</p>
                        </div>
                      </div>
                    </div>

                    <Link
                      href={`/providers/${service.provider._id}`}
                      className="block w-full mt-6 btn-secondary text-center"
                    >
                      View Profile
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Request a Quote</h3>
            <p className="text-gray-600 mb-6">
              Get a personalized quote from {service.provider?.name}
            </p>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Message
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Describe your project requirements..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Contact Method
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option>Email</option>
                  <option>Phone</option>
                  <option>Text Message</option>
                </select>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowContactModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                >
                  Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  )
}