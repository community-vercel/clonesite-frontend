'use client';
import React, { useState } from 'react';
import { ChevronDown, Edit3, Filter, Zap, CheckCircle, Eye, Phone, Mail, Info } from 'lucide-react';

const LeadsPage = () => {
  const [selectedLead, setSelectedLead] = useState('paul');

  const leads = [
    {
      id: 'paul',
      name: 'Paul',
      location: 'Warrington',
      region: 'Nationwide',
      service: 'Web Design',
      description: 'Create a new website / To advertise my business/services, To sell products/...',
      credits: 18,
      responseCount: '1/5',
      timeAgo: '11m ago',
      avatar: 'P',
      avatarColor: 'bg-green-500',
      highlighted: true,
      phone: '078*******',
      email: 'k***************s@g***l.com',
      serviceType: 'Web Design',
      fullLocation: 'Warrington (Nationwide)',
      remoteService: 'Happy to receive service online or remotely',
      verified: true,
      hiringIntent: 'High hiring intent',
      additionalDetails: true,
      professionalResponses: '1/5 professionals have responded.',
      details: 'Which is your web design requirement?'
    },
    {
      id: 'lolita',
      name: 'Lolita',
      location: 'London, Greater London',
      region: 'Nationwide',
      service: 'Web Design',
      description: 'Make changes to my current website / SquareSpace / Sole trader/self-employe...',
      credits: null,
      responseCount: null,
      timeAgo: '12m ago',
      avatar: 'L',
      avatarColor: 'bg-purple-500',
      highlighted: false
    }
  ];

  const selectedLeadData = leads.find(lead => lead.id === selectedLead);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
  

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
          {/* Sidebar Header */}
          <div className="bg-gray-900 text-white p-4">
            <h1 className="text-xl font-semibold mb-2">475 matching leads</h1>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <div className="w-4 h-4 bg-blue-600 rounded"></div>
                <span>5 services</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-4 h-4 bg-gray-600 rounded-full"></div>
                <span>1 location</span>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm flex items-center space-x-1">
                <Edit3 className="w-3 h-3" />
                <span>Edit</span>
              </button>
            </div>
          </div>

          {/* Filter Section */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
              <span>Showing all 475 leads</span>
              <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700">
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>
            </div>
            
            <div className="flex space-x-2 mb-3">
              <button className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-sm">
                1st to respond (93)
              </button>
              <button className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-sm">
                Urgent (144)
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-orange-500 rounded"></div>
              <span className="text-sm">Free leads (100)</span>
              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">NEW</span>
            </div>
          </div>

          {/* Leads List */}
          <div className="flex-1 overflow-y-auto">
            {leads.map((lead) => (
              <div 
                key={lead.id}
                className={`p-4 border-b border-gray-200 cursor-pointer transition-colors ${
                  selectedLead === lead.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedLead(lead.id)}
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-10 h-10 ${lead.avatarColor} rounded-full flex items-center justify-center text-white font-semibold`}>
                    {lead.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-gray-900">{lead.name}</h3>
                      <span className="text-xs text-gray-500">{lead.timeAgo}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{lead.location}</p>
                    <p className="text-xs text-gray-500 mb-2">{lead.region}</p>
                    
                    {lead.hiringIntent && (
                      <div className="flex items-center space-x-1 mb-2">
                        <Zap className="w-4 h-4 text-blue-600" />
                        <span className="text-xs text-gray-600">High hiring intent</span>
                      </div>
                    )}
                    
                    {lead.verified && (
                      <div className="flex items-center space-x-1 mb-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-xs text-gray-600">Verified phone</span>
                      </div>
                    )}
                    
                    {lead.additionalDetails && (
                      <div className="flex items-center space-x-1 mb-2">
                        <Eye className="w-4 h-4 text-purple-600" />
                        <span className="text-xs text-gray-600">Additional details</span>
                      </div>
                    )}
                    
                    <div className="mt-2">
                      <h4 className="font-medium text-sm text-gray-900 mb-1">{lead.service}</h4>
                      <p className="text-xs text-gray-600 line-clamp-2">{lead.description}</p>
                    </div>
                    
                    {lead.credits && (
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                            {lead.credits}
                          </div>
                          <span className="text-xs text-gray-600">Credits</span>
                        </div>
                        <div className="flex space-x-1">
                          {[1,2,3,4,5].map((i) => (
                            <div key={i} className={`w-2 h-2 rounded-sm ${i <= 1 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                          ))}
                          <span className="text-xs text-gray-600 ml-1">{lead.responseCount}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white">
          {selectedLeadData && (
            <div className="p-6">
              {/* Lead Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900 mb-1">{selectedLeadData.name}</h1>
                  <h2 className="text-lg text-gray-700 mb-1">{selectedLeadData.serviceType}</h2>
                  <p className="text-gray-600">{selectedLeadData.fullLocation}</p>
                  {selectedLeadData.remoteService && (
                    <div className="flex items-center space-x-1 mt-2">
                      <span className="text-sm text-gray-500">{selectedLeadData.remoteService}</span>
                      <Info className="w-4 h-4 text-gray-400" />
                    </div>
                  )}
                </div>
                <span className="text-sm text-gray-500">{selectedLeadData.timeAgo}</span>
              </div>

              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900">{selectedLeadData.phone}</span>
                  {selectedLeadData.verified && (
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600">Verified</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900">{selectedLeadData.email}</span>
                </div>
              </div>

              {/* Response Progress */}
              <div className="mb-6">
                <div className="flex space-x-1 mb-2">
                  {[1,2,3,4,5].map((i) => (
                    <div key={i} className={`flex-1 h-2 rounded-sm ${i <= 1 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                  ))}
                </div>
                <p className="text-sm text-gray-600">{selectedLeadData.professionalResponses}</p>
              </div>

              {/* Credits and Guarantee */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white font-semibold">
                      {selectedLeadData.credits}
                    </div>
                    <span className="font-medium text-gray-900">{selectedLeadData.credits} credits</span>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 bg-yellow-400 rounded-full"></div>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="font-medium text-gray-900 mb-1">Covered by our Get Hired Guarantee</p>
                  <p className="text-sm text-gray-600">If you are not hired during the starter pack, we will return all the credits.</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 mb-6">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium">
                  Contact Paul
                </button>
                <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-2 rounded-md font-medium">
                  Not interested
                </button>
              </div>

              {/* Highlights */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <h3 className="font-semibold text-gray-900">Highlights</h3>
                  <Info className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full">
                    <Zap className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-700">High hiring intent</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-700">Verified phone</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-purple-50 px-3 py-1 rounded-full">
                    <Eye className="w-4 h-4 text-purple-600" />
                    <span className="text-sm text-gray-700">Additional details</span>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Details</h3>
                <p className="text-gray-600">{selectedLeadData.details}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadsPage;