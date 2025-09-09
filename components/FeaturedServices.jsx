import Image from 'next/image'
import { Star, MapPin } from 'lucide-react'

const featuredServices = [
  {
    id: 1,
    title: 'Professional House Cleaning',
    provider: 'CleanPro Services',
    rating: 4.9,
    reviews: 127,
    price: 'From £25/hour',
    location: 'London',
    image: '/api/placeholder/300/200',
    verified: true
  },
  {
    id: 2,
    title: 'Personal Fitness Training',
    provider: 'FitLife Trainers',
    rating: 4.8,
    reviews: 89,
    price: 'From £40/session',
    location: 'Manchester',
    image: '/api/placeholder/300/200',
    verified: true
  },
  {
    id: 3,
    title: 'Web Design & Development',
    provider: 'Digital Craft',
    rating: 5.0,
    reviews: 45,
    price: 'From £500/project',
    location: 'Birmingham',
    image: '/api/placeholder/300/200',
    verified: true
  },
  {
    id: 4,
    title: 'Garden Landscaping',
    provider: 'Green Spaces Co',
    rating: 4.7,
    reviews: 156,
    price: 'From £200/day',
    location: 'Leeds',
    image: '/api/placeholder/300/200',
    verified: true
  }
]

export default function FeaturedServices() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Services</h2>
            <p className="text-gray-600">Top-rated professionals in your area</p>
          </div>
          <button className="btn-secondary">View All</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredServices.map((service) => (
            <div key={service.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
              <div className="relative">
                <Image
                  src={service.image}
                  alt={service.title}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                {service.verified && (
                  <span className="absolute top-3 left-3 bg-primary-600 text-white text-xs font-medium px-2 py-1 rounded">
                    VERIFIED QUOTE
                  </span>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{service.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{service.provider}</p>
                
                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-900 ml-1">{service.rating}</span>
                    <span className="text-sm text-gray-600 ml-1">({service.reviews})</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-primary-600">{service.price}</span>
                  <div className="flex items-center text-gray-500 text-sm">
                    <MapPin size={12} />
                    <span className="ml-1">{service.location}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
