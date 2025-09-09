import { Search, MessageSquare, Star, CheckCircle } from 'lucide-react'
import Link from 'next/link'

const steps = [
  {
    icon: Search,
    title: 'Find Services',
    description: 'Search for the service you need or browse by category. Use filters to find the perfect match.',
    color: 'bg-blue-100 text-blue-600'
  },
  {
    icon: MessageSquare,
    title: 'Get Quotes',
    description: 'Receive free quotes from qualified professionals. Compare prices, reviews, and portfolios.',
    color: 'bg-green-100 text-green-600'
  },
  {
    icon: CheckCircle,
    title: 'Hire & Pay',
    description: 'Choose your preferred professional and pay securely through our platform.',
    color: 'bg-purple-100 text-purple-600'
  },
  {
    icon: Star,
    title: 'Leave Review',
    description: 'Rate your experience and help other customers make informed decisions.',
    color: 'bg-yellow-100 text-yellow-600'
  }
]

export default function HowItWorks() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Getting help for your projects has never been easier. Follow these simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center group">
              <div className="relative mb-6">
                <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center transition-all duration-200 group-hover:scale-110 ${step.color}`}>
                  <step.icon size={32} />
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-1/2 transform translate-x-10 w-16 h-0.5 bg-gray-200"></div>
                )}
                <div className="absolute -top-2 -left-2 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/register" className="btn-primary btn-lg">
            Get Started Today
          </Link>
        </div>
      </div>
    </section>
  )
}

