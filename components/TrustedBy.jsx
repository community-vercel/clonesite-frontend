const companies = [
  { name: 'BBC', logo: 'BBC' },
  { name: 'Daily Mail', logo: 'Daily Mail' },
  { name: 'The Guardian', logo: 'The Guardian' },
  { name: 'Harper\'s Bazaar', logo: 'BAZAAR' },
  { name: 'Cosmopolitan', logo: 'cosmopolitan' }
]

export default function TrustedBy() {
  return (
    <section className="py-12 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-gray-600 mb-8">Trusted by millions and featured in</p>
        <div className="flex justify-center items-center space-x-8 md:space-x-12 opacity-60">
          {companies.map((company) => (
            <div key={company.name} className="text-gray-400 font-bold text-sm md:text-base">
              {company.logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
