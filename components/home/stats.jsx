// components/home/Stats.jsx
'use client'

import { useEffect, useState } from 'react'

const stats = [
  { label: 'Verified Professionals', value: 50000, suffix: '+' },
  { label: 'Services Completed', value: 2000000, suffix: '+' },
  { label: 'Customer Satisfaction', value: 4.8, suffix: '/5' },
  { label: 'Countries Served', value: 25, suffix: '+' }
]

export default function Stats() {
  const [counts, setCounts] = useState(stats.map(() => 0))
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.5 }
    )

    const element = document.getElementById('stats-section')
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const timers = stats.map((stat, index) => {
      let start = 0
      const end = stat.value
      const duration = 2000
      const increment = end / (duration / 16)

      return setInterval(() => {
        start += increment
        if (start >= end) {
          setCounts(prev => {
            const newCounts = [...prev]
            newCounts[index] = end
            return newCounts
          })
          clearInterval(timers[index])
        } else {
          setCounts(prev => {
            const newCounts = [...prev]
            newCounts[index] = Math.floor(start)
            return newCounts
          })
        }
      }, 16)
    })

    return () => timers.forEach(timer => clearInterval(timer))
  }, [isVisible])

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K'
    }
    return num.toString()
  }

  return (
    <section id="stats-section" className="py-16 bg-primary-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
                {stat.value < 10 ? counts[index].toFixed(1) : formatNumber(counts[index])}
                {stat.suffix}
              </div>
              <div className="text-primary-100 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
