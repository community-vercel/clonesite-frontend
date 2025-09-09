import { Home, Heart, Camera, Briefcase, GraduationCap, Wrench } from 'lucide-react'
import Link from 'next/link'

const categories = [
  { name: 'Home & Garden', icon: Home, color: 'bg-green-100 text-green-600', services: ['Cleaning', 'Gardening', 'Plumbing'] },
  { name: 'Health & Wellbeing', icon: Heart, color: 'bg-red-100 text-red-600', services: ['Fitness', 'Therapy', 'Nutrition'] },
  { name: 'Weddings & Events', icon: Camera, color: 'bg-pink-100 text-pink-600', services: ['Photography', 'Planning', 'Catering'] },
  { name: 'Business Services', icon: Briefcase, color: 'bg-blue-100 text-blue-600', services: ['Marketing', 'Consulting', 'Design'] },
  { name: 'Lessons & Training', icon: GraduationCap, color: 'bg-purple-100 text-purple-600', services: ['Music', 'Languages', 'Sports'] },
  { name: 'Other Services', icon: Wrench, color: 'bg-gray-100 text-gray-600', services: ['Repairs', 'Tech', 'Beauty'] },
]

export default function Categories() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Discover</h2>
          <p className="text-gray-600">Browse services by category</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/categories/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-center group cursor-pointer"
            >
              <div className={`${category.color} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-200`}>
                <category.icon size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
              <p className="text-sm text-gray-500">{category.services.join(', ')}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
