'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Star, MapPin, CheckCircle, MessageCircle, Phone, Mail, Award, Briefcase, Filter } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../app/context/AuthContext';
import Cookies from 'js-cookie'

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('rating');
  const [contacting, setContacting] = useState({});
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
        const token = Cookies.get('token')

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        // Get request ID from URL params or localStorage
        const requestId = searchParams.get('requestId') || localStorage.getItem('lastRequestId');
        if (!requestId) {
          setError('No request found');
          return;
        }

        const response = await api.get(`/leads/${requestId}?sortBy=${sortBy}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          setLeads(response.data.data.leads);
          setRequest(response.data.data.request);
        } else {
          setError('Failed to load leads');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load leads');
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, [sortBy, searchParams]);

  const handleContactProvider = async (providerId) => {
    setContacting(prev => ({ ...prev, [providerId]: true }));
    
    try {
      await api.post(`/leads/${request._id}/contact/${providerId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Navigate to messaging page
      // router.push(`/dashboard/messages?provider=${providerId}&request=${request._id}`);
    } catch (err) {
      console.error('Failed to contact provider:', err);
      // Show error message but still navigate
      // router.push(`/dashboard/messages?provider=${providerId}&request=${request._id}`);
    } finally {
      setContacting(prev => ({ ...prev, [providerId]: false }));
    }
  };

  const formatPrice = (pricing) => {
    if (!pricing) return 'Price on request';
    
    const { amount, type } = pricing;
    if (!amount) return 'Price on request';
    
    const min = amount.min || amount;
    const max = amount.max;
    const currency = pricing.currency || 'USD';
    
    let priceStr = `${currency === 'USD' ? '$' : currency} ${min}`;
    if (max && max > min) {
      priceStr += ` - ${currency === 'USD' ? '$' : currency} ${max}`;
    }
    
    const typeMap = {
      'hourly': '/hr',
      'fixed': ' (fixed)',
      'per_project': '/project',
      'per_item': '/item',
      'per_sqft': '/sq ft'
    };
    
    return priceStr + (typeMap[type] || '');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md">
          <p className="text-red-600 font-medium">{error}</p>
          <button 
            onClick={() => router.push('/dashboard')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Professionals for Your Request
            </h1>
            {request && (
              <div className="bg-blue-50 rounded-xl p-4 mb-6">
                <h2 className="text-xl font-semibold text-blue-900 mb-2">{request.title}</h2>
                <p className="text-blue-700 mb-2">{request.description.substring(0, 200)}...</p>
                <div className="flex items-center text-blue-600 text-sm">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{request.location?.city}</span>
                  {request.budget && (
                    <>
                      <span className="mx-2">•</span>
                      <span>Budget: ${request.budget.min} - ${request.budget.max}</span>
                    </>
                  )}
                </div>
              </div>
            )}
            
            {/* Results summary and filters */}
            <div className="flex justify-between items-center">
              <p className="text-gray-600">
                Found {leads.length} professionals matching your request
              </p>
              
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="rating">Best Rated</option>
                  <option value="distance">Closest</option>
                  <option value="experience">Most Experienced</option>
                  <option value="price">Best Price</option>
                </select>
              </div>
            </div>
          </div>

          {/* Leads Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {leads.map((lead) => (
              <div
                key={lead._id}
                className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 group"
              >
                {/* Provider Header */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className="relative">
                    <img
                      src={lead.provider.avatar || '/default-avatar.jpg'}
                      alt={lead.provider.businessName || `${lead.provider.firstName} ${lead.provider.lastName}`}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    {lead.provider.isVerified && (
                      <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {lead.provider.businessName || `${lead.provider.firstName} ${lead.provider.lastName}`}
                    </h3>
                    <div className="flex items-center mt-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm text-gray-600">
                        {lead.provider.rating?.average?.toFixed(1) || 'New'} 
                        {lead.provider.rating?.count && ` (${lead.provider.rating.count})`}
                      </span>
                      {lead.matchScore && (
                        <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                          {lead.matchScore}% match
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Service Details */}
                <div className="mb-4">
                  {lead.service && (
                    <>
                      <h4 className="font-medium text-gray-900 mb-2">{lead.service.title}</h4>
                      <p className="text-gray-600 text-sm mb-2">
                        {lead.shortDescription}
                      </p>
                    </>
                  )}
                  
                  {/* Key Info */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-500">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>
                        {lead.distance ? `${lead.distance}km away` : lead.provider.location?.city || 'Location not specified'}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-gray-500">
                      <Briefcase className="w-4 h-4 mr-2" />
                      <span>{lead.provider.totalJobs || 0} jobs completed</span>
                    </div>
                    
                    {lead.service?.pricing && (
                      <div className="flex items-center text-gray-500">
                        <span className="font-medium text-gray-900">
                          {formatPrice(lead.service.pricing)}
                        </span>
                      </div>
                    )}
                    
                    {lead.provider.isVerified && (
                      <div className="flex items-center text-green-600">
                        <Award className="w-4 h-4 mr-2" />
                        <span>Verified Professional</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Service Images */}
                {lead.service?.images && lead.service.images.length > 0 && (
                  <div className="mb-4">
                    <div className="grid grid-cols-3 gap-1 rounded-lg overflow-hidden">
                      {lead.service.images.slice(0, 3).map((image, index) => (
                        <img 
                          key={index}
                          src={image.url} 
                          alt=""
                          className="w-full h-16 object-cover"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-2">
                  <button
                    onClick={() => handleContactProvider(lead.provider._id)}
                    disabled={contacting[lead.provider._id]}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center disabled:opacity-50"
                  >
                    {contacting[lead.provider._id] ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    ) : (
                      <MessageCircle className="w-5 h-5 mr-2" />
                    )}
                    {contacting[lead.provider._id] ? 'Connecting...' : 'Contact & Get Quote'}
                  </button>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => router.push(`/providers/${lead.provider._id}`)}
                      className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm"
                    >
                      View Profile
                    </button>
                    {lead.service && (
                      <button
                        onClick={() => router.push(`/services/${lead.service._id}`)}
                        className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm"
                      >
                        View Service
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {leads.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No professionals found</h3>
              <p className="text-gray-600 mb-4">
                We couldn't find any professionals matching your request criteria in your area.
              </p>
              <div className="space-x-4">
                <button
                  onClick={() => router.push('/request/new')}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create New Request
                </button>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}