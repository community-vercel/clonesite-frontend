'use client';

import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, Edit3, Filter, Zap, CheckCircle, Eye, Phone, Mail, Info, Star, Clock, MapPin, 
  Users, Shield, Heart, AlertCircle, Camera, FileText, Calendar, MessageCircle, Award, CreditCard,
  TrendingUp, Target, Search, RefreshCw, Download, MoreVertical
} from 'lucide-react';
import api from '../../../lib/api';
import ContactLeadModal from '../../../components/ContactLeadModal';

const LeadsPage = () => {
  const [selectedLead, setSelectedLead] = useState(null);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    sortBy: 'match_score',
    leadType: 'all',
    urgency: 'all'
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [contactLeadId, setContactLeadId] = useState(null);
  const [contactCustomerName, setContactCustomerName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [contactedLeads, setContactedLeads] = useState(new Set()); // Added this missing state

  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1];

  if (!token) {
    throw new Error('No authentication token found');
  }

  useEffect(() => {
    fetchLeads();
  }, [page, filters.sortBy, filters.leadType, filters.urgency]);

const fetchLeads = async () => {
  try {
    setLoading(true);
    const response = await api.get('/requests/getleads', {
      params: { page, limit: 20, sortBy: filters.sortBy, leadType: filters.leadType, urgency: filters.urgency === 'all' ? undefined : filters.urgency },
      headers: { Authorization: `Bearer ${token}` }
    });
    const fetchedLeads = response.data.data.leads;
    setLeads(fetchedLeads);

    // Check which leads have been contacted by this user
    const contacted = new Set(fetchedLeads.filter(lead => 
      lead.analytics?.contactedProviders?.includes(req.user.id)
    ).map(lead => lead.id));
    setContactedLeads(contacted);

    if (fetchedLeads.length > 0 && !selectedLead) {
      setSelectedLead(fetchedLeads[0].id);
    }
  } catch (err) {
    setError(err.response?.data?.message || 'Failed to load leads');
  } finally {
    setLoading(false);
  }
};


const handleContact = async (leadId, customerName) => {
  try {
    const response = await api.get(`/requests/contact/${leadId}/check`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const { data } = response.data;
    if (!data.provider.hasEnoughCredits) {
      setContactLeadId(leadId);
      setContactCustomerName(customerName);
      setModalOpen(true);
    } else {
      await api.post(`/requests/contact/${leadId}`, {
        message: `Interested in your ${leads.find(l => l.id === leadId)?.service.category} project`,
        useCredits: true
      }, { headers: { Authorization: `Bearer ${token}` } });
      alert('Successfully contacted lead');
      setContactedLeads(prev => new Set(prev).add(leadId)); // Update contacted leads
      fetchLeads(); // Refresh leads to reflect updated status
    }
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to initiate contact');
  }
};

  const selectedLeadData = leads.find(lead => lead.id === selectedLead);
  const sortedLeads = [...leads].sort((a, b) => {
    switch (filters.sortBy) {
      case 'newest':
        return new Date(b.timing.posted) - new Date(a.timing.posted);
      case 'urgency':
        const urgencyOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        return urgencyOrder[b.timing.urgency] - urgencyOrder[a.timing.urgency];
      case 'distance':
        return (a.location.distance || 999) - (b.location.distance || 999);
      case 'credits':
        return a.lead.cost - b.lead.cost;
      default:
        return b.lead.matchScore - a.lead.matchScore;
    }
  }).filter(lead => 
    searchTerm === '' || 
    lead.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.service.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'urgent': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  const getMatchScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 75) return 'text-blue-600 bg-blue-100';
    if (score >= 60) return 'text-orange-600 bg-orange-100';
    return 'text-gray-600 bg-gray-100';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mx-auto mb-6" />
            <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-2 border-orange-300 opacity-20" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Finding Your Perfect Leads</h3>
          <p className="text-gray-600">Analyzing matches based on your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Enhanced Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Leads Dashboard</h1>
                  <p className="text-sm text-gray-500">Find and connect with potential customers</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 px-4 py-2 rounded-full text-sm font-semibold border border-orange-200">
                  <span className="flex items-center space-x-1">
                    <TrendingUp className="w-4 h-4" />
                    <span>{leads.length} Available</span>
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2 text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                  <CreditCard className="w-4 h-4" />
                  <span className="font-medium">Credits: 47</span>
                </div>
                <button 
                  onClick={fetchLeads}
                  className="flex items-center space-x-2 text-gray-600 hover:text-orange-600 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh</span>
                </button>
              </div>
              <button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5">
                Buy Credits
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-100px)]">
        {/* Enhanced Sidebar */}
        <div className="w-96 bg-white border-r border-gray-200 flex flex-col shadow-lg">
          {/* Enhanced Search and Filter Controls */}
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search leads..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900 flex items-center">
                <Filter className="w-4 h-4 mr-2 text-orange-500" />
                Filter Leads
              </h2>
              <button 
                className="text-orange-500 text-sm hover:text-orange-600 font-medium"
                onClick={() => setFilters({ sortBy: 'match_score', leadType: 'all', urgency: 'all' })}
              >
                Reset All
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
                <select 
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                >
                  <option value="match_score">🎯 Best match</option>
                  <option value="newest">⏰ Newest first</option>
                  <option value="urgency">🔥 Most urgent</option>
                  <option value="distance">📍 Closest</option>
                  <option value="credits">💰 Lowest credits</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lead type</label>
                <div className="flex space-x-2">
                  {['all', 'free', 'paid'].map(type => (
                    <button
                      key={type}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        filters.leadType === type 
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-700'
                      }`}
                      onClick={() => setFilters({ ...filters, leadType: type })}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Urgency</label>
                <div className="grid grid-cols-2 gap-2">
                  {['all', 'urgent', 'high', 'medium'].map(urgency => (
                    <button
                      key={urgency}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        filters.urgency === urgency 
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-700'
                      }`}
                      onClick={() => setFilters({ ...filters, urgency: urgency })}
                    >
                      {urgency.charAt(0).toUpperCase() + urgency.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Leads List */}
          <div className="flex-1 overflow-y-auto">
            {sortedLeads.map((lead, index) => (
              <div
                key={lead.id}
                className={`p-4 border-b border-gray-100 cursor-pointer transition-all hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 ${
                  selectedLead === lead.id ? 'bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-l-orange-500 shadow-sm' : ''
                } ${index === 0 ? 'border-t-0' : ''}`}
                onClick={() => setSelectedLead(lead.id)}
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-12 h-12 ${lead.customer.avatarColor} rounded-xl flex items-center justify-center text-white font-bold text-lg relative shadow-md`}>
                    {lead?.customer?.email?.[0]?.toUpperCase() || "?"}
                    {lead.customer.isVerified && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center shadow-sm">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm truncate">
                          {lead?.customer?.name?.replace(/^customer\s*/i, '')}
                        </h3>
                        <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                          <MapPin className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{lead.location.display}</span>
                          {lead.location.distance && (
                            <>
                              <span>•</span>
                              <span className="flex-shrink-0">{lead.location.distance}km</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <div className="text-xs text-gray-500">{lead.timing.timeAgo}</div>
                        {lead.timing.isUrgent && (
                          <div className="flex items-center justify-end mt-1">
                            <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs font-medium flex items-center">
                              <Zap className="w-3 h-3 mr-1" />
                              URGENT
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mb-3">
                      <h4 className="font-medium text-gray-900 text-sm mb-1 line-clamp-1">{lead.title}</h4>
                      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">{lead.description}</p>
                    </div>

                    {/* Enhanced Lead Highlights */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {lead.flags.firstToRespond && (
                        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">🏆 1st Response</span>
                      )}
                      {lead.flags.premium && (
                        <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-medium">⭐ Premium</span>
                      )}
                      {lead.flags.hasAttachments && (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium flex items-center">
                          <Camera className="w-3 h-3 mr-1" />
                          Photos
                        </span>
                      )}
                      {lead.flags.repeatCustomer && (
                        <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full font-medium">🔄 Repeat</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <span className="font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                          {lead.budget.display}
                        </span>
                        {lead.budget.flexible && (
                          <span className="text-gray-500 text-xs ml-1">(flexible)</span>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        {/* Enhanced Match Score */}
                        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-bold ${getMatchScoreColor(lead.lead.matchScore)}`}>
                          <Star className="w-3 h-3" />
                          <span>{lead.lead.matchScore}%</span>
                        </div>
                        
                        {/* Enhanced Credit Cost */}
                        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-bold shadow-sm ${
                          lead.lead.isFree 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-900 text-white'
                        }`}>
                          {lead.lead.isFree ? (
                            <span>FREE</span>
                          ) : (
                            <>
                              <CreditCard className="w-3 h-3" />
                              <span>{lead.lead.cost}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Response Progress */}
                    <div className="mt-3">
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className={`flex-1 h-2 rounded-full transition-all ${
                            i <= lead.lead.quotesCount ? 'bg-gradient-to-r from-orange-500 to-red-500 shadow-sm' : 'bg-gray-200'
                          }`} />
                        ))}
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-500 font-medium">{lead.lead.responseRate} responses</span>
                        <span className="text-xs text-gray-500">{lead.lead.viewsCount} views</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {sortedLeads.length === 0 && (
              <div className="p-8 text-center">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No leads found</h3>
                <p className="text-gray-500">Try adjusting your filters or search terms</p>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Main Content */}
        <div className="flex-1 bg-white overflow-y-auto">
          {selectedLeadData ? (
            <div className="max-w-5xl mx-auto p-6">
              {/* Enhanced Lead Header */}
              <div className="bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 rounded-2xl p-8 mb-8 border border-orange-100 shadow-lg">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start space-x-6">
                    <div className={`w-20 h-20 ${selectedLeadData.customer.avatarColor} rounded-2xl flex items-center justify-center text-white font-bold text-2xl relative shadow-xl`}>
                      {selectedLeadData?.customer?.email?.[0]?.toUpperCase() || "?"}
                      {selectedLeadData.customer.isVerified && (
                        <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>

                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {selectedLeadData.customer.name.replace(/^customer\s*/i, '')}
                      </h1>
                      <div className="flex items-center space-x-6 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-2 bg-white bg-opacity-60 px-3 py-1 rounded-lg">
                          <MapPin className="w-4 h-4 text-orange-500" />
                          <span className="font-medium">{selectedLeadData.location.full}</span>
                        </div>
                        {selectedLeadData.location.distance && (
                          <div className="flex items-center space-x-2 bg-white bg-opacity-60 px-3 py-1 rounded-lg">
                            <span className="font-medium">{selectedLeadData.location.distance}km away</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-2 bg-white bg-opacity-60 px-3 py-1 rounded-lg">
                          <Clock className="w-4 h-4 text-blue-500" />
                          <span className="font-medium">{selectedLeadData.timing.timeAgo}</span>
                        </div>
                      </div>
                      
                      {selectedLeadData.customer.rating && (
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star} 
                                className={`w-5 h-5 ${star <= Math.floor(selectedLeadData.customer.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                          <span className="text-sm font-medium text-gray-700 bg-white bg-opacity-60 px-2 py-1 rounded">
                            {selectedLeadData.customer.rating} ({selectedLeadData.customer.reviewCount} reviews)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    {selectedLeadData.timing.isUrgent && (
                      <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-xl text-sm font-bold mb-3 flex items-center shadow-lg">
                        <Zap className="w-4 h-4 mr-2" />
                        URGENT PROJECT
                      </div>
                    )}
                    <div className="text-4xl font-bold text-green-600 mb-1">{selectedLeadData.budget.display}</div>
                    {selectedLeadData.budget.flexible && (
                      <div className="text-sm text-gray-600 bg-white bg-opacity-60 px-2 py-1 rounded">Budget is flexible</div>
                    )}
                  </div>
                </div>

                {/* Enhanced Customer Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white bg-opacity-70 rounded-xl p-4 text-center">
                    <Users className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                    <div className="text-sm text-gray-600">Member since</div>
                    <div className="font-bold text-gray-900">{new Date(selectedLeadData.customer.memberSince).getFullYear()}</div>
                  </div>
                  <div className="bg-white bg-opacity-70 rounded-xl p-4 text-center">
                    <Award className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                    <div className="text-sm text-gray-600">Previous hires</div>
                    <div className="font-bold text-gray-900">{selectedLeadData.customer.previousHires}</div>
                  </div>
                  <div className="bg-white bg-opacity-70 rounded-xl p-4 text-center">
                    <Shield className="w-6 h-6 text-green-500 mx-auto mb-2" />
                    <div className="text-sm text-gray-600">Status</div>
                    <div className="font-bold text-green-600">
                      {selectedLeadData.customer.isVerified ? 'Verified' : 'Standard'}
                    </div>
                  </div>
                  <div className="bg-white bg-opacity-70 rounded-xl p-4 text-center">
                    <Eye className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                    <div className="text-sm text-gray-600">Project views</div>
                    <div className="font-bold text-gray-900">{selectedLeadData.lead.viewsCount}</div>
                  </div>
                </div>

                {/* Contact Information - Updated with masking */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {/* Phone Number */}
  <div className="bg-white bg-opacity-70 rounded-xl p-4">
    <div className="flex items-center space-x-3">
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
        <Phone className="w-5 h-5 text-blue-600" />
      </div>
      <div>
        <div className="text-sm text-gray-600">Phone Number</div>
        <div className="font-bold text-gray-900">
          {selectedLeadData?.customer?.phone
            ? selectedLeadData.customer.phone.replace(
                /(\d{2})\d{5}(\d{2})/,
                "$1*****$2"
              )
            : "N/A"}
        </div>
      </div>
    </div>
  </div>

  {/* Email Address */}
  <div className="bg-white bg-opacity-70 rounded-xl p-4">
    <div className="flex items-center space-x-3">
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100">
        <Mail className="w-5 h-5 text-purple-600" />
      </div>
      <div>
        <div className="text-sm text-gray-600">Email Address</div>
        <div className="font-bold text-gray-900">
          {selectedLeadData?.customer?.email
            ? selectedLeadData.customer.email.replace(
                /(.{2})(.*)(@.*)/,
                (_, a, b, c) => a + "*".repeat(b.length) + c
              )
            : "N/A"}
        </div>
      </div>
    </div>
  </div>
</div>

              </div>

              {/* Enhanced Lead Cost & Action */}
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8 mb-8 border shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-xl ${
                      selectedLeadData.lead.isFree ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-gray-800 to-gray-900'
                    }`}>
                      {selectedLeadData.lead.isFree ? 'FREE' : selectedLeadData.lead.cost}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {selectedLeadData.lead.isFree ? 'Free Lead Access' : `${selectedLeadData.lead.cost} Credits Required`}
                      </h3>
                      <p className="text-gray-600">
                        {selectedLeadData.lead.isFree 
                          ? 'Contact this customer at no cost' 
                          : 'Unlock instant access to customer contact details'
                        }
                      </p>
                      <div className="flex items-center space-x-4 mt-3">
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getMatchScoreColor(selectedLeadData.lead.matchScore)}`}>
                          🎯 {selectedLeadData.lead.matchScore}% Match
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                          selectedLeadData.lead.competitionLevel === 'low' ? 'bg-green-100 text-green-700' :
                          selectedLeadData.lead.competitionLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                        }`}>
                          🏁 {selectedLeadData.lead.competitionLevel?.toUpperCase()} Competition
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleContact(selectedLeadData.id, selectedLeadData.customer.name)}
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-xl font-bold flex items-center space-x-3 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200"
                    >
                      <MessageCircle className="w-6 h-6" />
                      <span>Contact Customer Now</span>
                    </button>
                    <button className="border-2 border-gray-300 hover:border-red-300 hover:bg-red-50 text-gray-700 hover:text-red-600 px-6 py-4 rounded-xl transition-all duration-200 transform hover:-translate-y-1">
                      <Heart className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Enhanced Project Details */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <div className="lg:col-span-2 space-y-8">
                  {/* Project Overview */}
                  <div className="bg-white rounded-2xl p-8 border shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <FileText className="w-6 h-6 text-orange-500 mr-3" />
                      Project Overview
                    </h2>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">{selectedLeadData.title}</h3>
                    <p className="text-gray-700 leading-relaxed mb-6 text-lg">{selectedLeadData.description}</p>
                    
                    {/* Enhanced Service Category */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{selectedLeadData.service.icon}</span>
                        <div>
                          <div className="font-bold text-blue-900">{selectedLeadData.service.category}</div>
                          {selectedLeadData.service.subCategory && (
                            <div className="text-blue-700 text-sm">{selectedLeadData.service.subCategory}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Project Requirements */}
                  {selectedLeadData.customFields.length > 0 && (
                    <div className="bg-white rounded-2xl p-8 border shadow-lg">
                      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                        <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                        Project Requirements
                      </h3>
                      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedLeadData.customFields.map((field, index) => (
                            <div key={index} className="bg-white rounded-lg p-4 border">
                              <div className="text-sm text-gray-600 font-medium mb-1">{field.name}</div>
                              <div className="text-gray-900 font-semibold">{field.value}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Timeline & Preferences */}
                  <div className="bg-white rounded-2xl p-8 border shadow-lg">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                      <Calendar className="w-6 h-6 text-blue-500 mr-3" />
                      Timeline & Preferences
                    </h3>
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {selectedLeadData.timing.startDate && (
                          <div className="bg-white rounded-lg p-4 border">
                            <div className="flex items-center space-x-3 mb-2">
                              <Calendar className="w-5 h-5 text-green-500" />
                              <div className="font-bold text-gray-900">Start Date</div>
                            </div>
                            <div className="text-gray-700 font-semibold">
                              {new Date(selectedLeadData.timing.startDate).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </div>
                          </div>
                        )}
                        {selectedLeadData.timing.deadline && (
                          <div className="bg-white rounded-lg p-4 border border-red-200">
                            <div className="flex items-center space-x-3 mb-2">
                              <AlertCircle className="w-5 h-5 text-red-500" />
                              <div className="font-bold text-gray-900">Deadline</div>
                            </div>
                            <div className="text-red-600 font-semibold">
                              {new Date(selectedLeadData.timing.deadline).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </div>
                          </div>
                        )}
                        {selectedLeadData.timing.preferredTime && (
                          <div className="bg-white rounded-lg p-4 border">
                            <div className="flex items-center space-x-3 mb-2">
                              <Clock className="w-5 h-5 text-blue-500" />
                              <div className="font-bold text-gray-900">Preferred Time</div>
                            </div>
                            <div className="text-gray-700 font-semibold">{selectedLeadData.timing.preferredTime}</div>
                          </div>
                        )}
                        {selectedLeadData.flags.remoteOk && (
                          <div className="bg-white rounded-lg p-4 border border-green-200">
                            <div className="flex items-center space-x-3 mb-2">
                              <CheckCircle className="w-5 h-5 text-green-600" />
                              <div className="font-bold text-gray-900">Remote Work</div>
                            </div>
                            <div className="text-green-600 font-semibold">Accepted ✓</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Attachments */}
                  {selectedLeadData.attachments?.length > 0 && (
                    <div className="bg-white rounded-2xl p-8 border shadow-lg">
                      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                        <Camera className="w-6 h-6 text-purple-500 mr-3" />
                        Project Attachments
                      </h3>
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedLeadData.attachments.map((attachment, index) => (
                            <div key={index} className="bg-white rounded-lg p-4 border hover:shadow-md transition-shadow cursor-pointer">
                              <div className="flex items-center space-x-3">
                                {attachment.type === 'image' ? (
                                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Camera className="w-5 h-5 text-blue-600" />
                                  </div>
                                ) : (
                                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-gray-600" />
                                  </div>
                                )}
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900">{attachment.filename}</div>
                                  <div className="text-xs text-gray-500">{attachment.type?.toUpperCase()}</div>
                                </div>
                                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium px-3 py-1 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                                  View
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Sidebar - Lead Insights */}
                <div className="space-y-6">
                  {/* Lead Performance */}
                  <div className="bg-white rounded-2xl p-6 border shadow-lg">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <TrendingUp className="w-5 h-5 text-orange-500 mr-2" />
                      Lead Performance
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 text-center">
                        <div className="text-3xl font-bold text-orange-600 mb-1">{selectedLeadData.lead.matchScore}%</div>
                        <div className="text-sm text-gray-600 font-medium">Match Score</div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-blue-50 rounded-lg p-3 text-center">
                          <div className="text-xl font-bold text-blue-600">{selectedLeadData.lead.viewsCount}</div>
                          <div className="text-xs text-gray-600">Views</div>
                        </div>
                        <div className="bg-green-50 rounded-lg p-3 text-center">
                          <div className="text-xl font-bold text-green-600">{selectedLeadData.lead.quotesCount}/5</div>
                          <div className="text-xs text-gray-600">Responses</div>
                        </div>
                      </div>
                      <div className={`text-center p-3 rounded-lg ${
                        selectedLeadData.lead.competitionLevel === 'low' ? 'bg-green-50' :
                        selectedLeadData.lead.competitionLevel === 'medium' ? 'bg-yellow-50' : 'bg-red-50'
                      }`}>
                        <div className={`text-lg font-bold ${
                          selectedLeadData.lead.competitionLevel === 'low' ? 'text-green-600' :
                          selectedLeadData.lead.competitionLevel === 'medium' ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {selectedLeadData.lead.competitionLevel?.toUpperCase()}
                        </div>
                        <div className="text-xs text-gray-600">Competition Level</div>
                      </div>
                    </div>
                  </div>

                  {/* Response Progress */}
                  <div className="bg-white rounded-2xl p-6 border shadow-lg">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Response Activity</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Professionals responding</span>
                        <span className="text-sm font-bold text-gray-900">{selectedLeadData.lead.responseRate}</span>
                      </div>
                      <div className="relative">
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all duration-500 shadow-sm" 
                            style={{ width: `${(selectedLeadData.lead.quotesCount / 5) * 100}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                          <span>0 responses</span>
                          <span>5 responses (full)</span>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 text-center">
                        <div className="text-sm text-gray-600">Time to respond</div>
                        <div className="font-bold text-gray-900">
                          {selectedLeadData.lead.quotesCount < 3 ? 'Act fast!' : 'Limited slots left'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Success Tips */}
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-6">
                    <h3 className="font-bold text-yellow-800 mb-4 flex items-center">
                      <Info className="w-5 h-5 mr-2" />
                      Success Tips
                    </h3>
                    <ul className="text-sm text-yellow-700 space-y-3">
                      <li className="flex items-start space-x-2">
                        <span className="text-yellow-600 font-bold">⚡</span>
                        <span>Respond quickly - customers prefer fast responses</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-yellow-600 font-bold">🎯</span>
                        <span>Be specific about your experience with similar projects</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-yellow-600 font-bold">❓</span>
                        <span>Ask relevant questions to show your expertise</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-yellow-600 font-bold">📸</span>
                        <span>Include examples of your previous work if relevant</span>
                      </li>
                      {selectedLeadData.timing.isUrgent && (
                        <li className="flex items-start space-x-2 bg-red-100 rounded-lg p-2 -mx-1">
                          <span className="text-red-600 font-bold">🔥</span>
                          <span className="font-bold text-red-700">This is urgent - prioritize your response!</span>
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Contact Preview */}
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 rounded-2xl p-6">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                      <Shield className="w-5 h-5 mr-2 text-orange-500" />
                      After Contacting
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center space-x-3 bg-white bg-opacity-60 rounded-lg p-3">
                        <Phone className="w-4 h-4 text-blue-500" />
                        <span className="text-gray-700 font-medium">Direct phone access</span>
                      </div>
                      <div className="flex items-center space-x-3 bg-white bg-opacity-60 rounded-lg p-3">
                        <Mail className="w-4 h-4 text-purple-500" />
                        <span className="text-gray-700 font-medium">Email communication</span>
                      </div>
                      <div className="flex items-center space-x-3 bg-white bg-opacity-60 rounded-lg p-3">
                        <MessageCircle className="w-4 h-4 text-green-500" />
                        <span className="text-gray-700 font-medium">Direct messaging</span>
                      </div>
                      <div className="flex items-center space-x-3 bg-white bg-opacity-60 rounded-lg p-3">
                        <Shield className="w-4 h-4 text-orange-500" />
                        <span className="text-gray-700 font-medium">Platform protection</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-50 to-blue-50">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                  <Users className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Select a Lead</h3>
                <p className="text-gray-600 text-lg">Choose a lead from the sidebar to view detailed information</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <ContactLeadModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        leadId={contactLeadId} 
        customerName={contactCustomerName} 
      />
    </div>
  );
};

export default LeadsPage;