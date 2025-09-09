import Image from 'next/image'

const popularCategories = [
  {
    name: 'Cleaners',
    image: '/api/placeholder/400/300',
    count: '1,234+ professionals'
  },
  {
    name: 'Gardeners',
    image: '/api/placeholder/400/300',
    count: '856+ professionals'
  },
  {
    name: 'Personal Trainers',
    image: '/api/placeholder/400/300',
    count: '645+ professionals'
  }
]

export default function PopularCategories() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Most Popular Categories</h2>
          <div className="flex justify-center space-x-4">
            <button className="w-3 h-3 rounded-full bg-gray-300"></button>
            <button className="w-3 h-3 rounded-full bg-primary-600"></button>
            <button className="w-3 h-3 rounded-full bg-gray-300"></button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {popularCategories.map((category) => (
            <div key={category.name} className="relative group cursor-pointer">
              <div className="relative h-64 rounded-xl overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.name}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                  <p className="text-sm opacity-90">{category.count}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}