import Link from 'next/link'
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-2xl font-bold">ServiceHub</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
              Connect with verified professionals for all your service needs. Get quotes, 
              compare prices, and hire with confidence. Your trusted marketplace for quality services.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-6 text-lg">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link href="/services" className="text-gray-400 hover:text-white transition-colors">Find Services</Link></li>
              <li><Link href="/categories" className="text-gray-400 hover:text-white transition-colors">Categories</Link></li>
              <li><Link href="/how-it-works" className="text-gray-400 hover:text-white transition-colors">How it Works</Link></li>
              <li><Link href="/register" className="text-gray-400 hover:text-white transition-colors">Join as Professional</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-6 text-lg">Support</h4>
            <ul className="space-y-3 mb-6">
              <li><Link href="/help" className="text-gray-400 hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/safety" className="text-gray-400 hover:text-white transition-colors">Safety</Link></li>
              <li><Link href="/disputes" className="text-gray-400 hover:text-white transition-colors">Disputes</Link></li>
            </ul>
            
            <div className="space-y-3">
              <div className="flex items-center text-gray-400">
                <Mail size={16} className="mr-2" />
                <span className="text-sm">support@servicehub.com</span>
              </div>
              <div className="flex items-center text-gray-400">
                <Phone size={16} className="mr-2" />
                <span className="text-sm">+44 20 7946 0958</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} ServiceHub. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
