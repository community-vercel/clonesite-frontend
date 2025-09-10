'use client'
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { requestsAPI } from '../../services/api'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { MapPin, Calendar, DollarSign } from 'lucide-react'

export default function NewRequest() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    budget: {
      min: '',
      max: ''
    },
    timeline: '',
    requirements: ''
  })

  const categories = [
    'Home & Garden',
    'Health & Wellbeing',
    'Weddings & Events',
    'Business Services',
    'Lessons & Training',
    'Other Services'
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith('budget.')) {
      const budgetField = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        budget: {
          ...prev.budget,
          [budgetField]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      toast.error('Please log in to post a request')
      router.push('/login')
      return
    }

    setLoading(true)
    try {
      const response = await requestsAPI.create(formData)
      if (response.success) {
        toast.success('Request posted successfully!')
        router.push('/dashboard')
      }
    } catch (error) {
      toast.error('Failed to post request. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Post a Service Request</h1>
            <p className="text-gray-600">Tell us what you need and get quotes from qualified professionals</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                What service do you need? *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., House cleaning, Web design, Personal training"
                className="input-field"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Describe your requirements *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide details about what you need, when you need it, and any specific requirements"
                className="input-field resize-none"
              />
            </div>

            {/* Category and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    id="location"
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="City, postcode"
                    className="input-field pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Budget */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget Range
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="number"
                    name="budget.min"
                    value={formData.budget.min}
                    onChange={handleChange}
                    placeholder="Min budget"
                    className="input-field pl-10"
                  />
                </div>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="number"
                    name="budget.max"
                    value={formData.budget.max}
                    onChange={handleChange}
                    placeholder="Max budget"
                    className="input-field pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-2">
                When do you need this completed?
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <select
                  id="timeline"
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleChange}
                  className="input-field pl-10"
                >
                  <option value="">Select timeline</option>
                  <option value="asap">As soon as possible</option>
                  <option value="within-week">Within a week</option>
                  <option value="within-month">Within a month</option>
                  <option value="flexible">I'm flexible</option>
                </select>
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => router.back()}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Posting...' : 'Post Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
