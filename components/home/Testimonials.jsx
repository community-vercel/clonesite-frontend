'use client'

import { useState, useEffect } from 'react'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Homeowner',
    avatar: '/api/placeholder/60/60',
    rating: 5,
    text: 'ServiceHub made finding a reliable cleaner so easy! The professional I hired was punctual, thorough, and reasonably priced. I\'ll definitely use this platform again.',
    service: 'House Cleaning'
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Small Business Owner',
    avatar: '/api/placeholder/60/60',
    rating: 5,
    text: 'I needed a website for my restaurant and found an amazing web designer through ServiceHub. The process was smooth from start to finish, and the results exceeded my expectations.',
    service: 'Web Design'
  },
  {
    id: 3,
    name: 'Emma Williams',
    role: 'Fitness Enthusiast',
    avatar: '/api/placeholder/60/60',
    rating: 5,
    text: 'The personal trainer I found through ServiceHub helped me achieve my fitness goals. Professional, knowledgeable, and motivating. Highly recommended!',
    service: 'Personal Training'
  },
  {
    id: 4,
    name: 'David Brown',
    role: 'Property Manager',
    avatar: '/api/placeholder/60/60',
    rating: 5,
    text: 'ServiceHub has become my go-to platform for finding contractors and service providers. The quality of professionals and the ease of use is outstanding.',
    service: 'Property Maintenance'
  }
]

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const goToPrevious = () => {
    setIsAutoPlaying(false)
    setCurrentIndex(currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1)
  }

  const goToNext = () => {
    setIsAutoPlaying(false)
    setCurrentIndex(currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1)
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of satisfied customers who found their perfect professional
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-full transform translate-x-16 -translate-y-16"></div>
            
            <div className="relative">
              <div className="flex items-center mb-6">
                <img
                  src={testimonials[currentIndex].avatar}
                  alt={testimonials[currentIndex].name}
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {testimonials[currentIndex].name}
                  </h3>
                  <p className="text-gray-600">{testimonials[currentIndex].role}</p>
                </div>
                <div className="ml-auto flex items-center">
                  {Array.from({ length: testimonials[currentIndex].rating }).map((_, i) => (
                    <Star key={i} size={20} className="text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>

              <blockquote className="text-xl text-gray-700 leading-relaxed mb-6">
                "{testimonials[currentIndex].text}"
              </blockquote>

              <div className="text-primary-600 font-medium">
                Service: {testimonials[currentIndex].service}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft size={20} className="text-gray-600" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ChevronRight size={20} className="text-gray-600" />
          </button>

          {/* Dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAutoPlaying(false)
                  setCurrentIndex(index)
                }}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-primary-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
