'use client';
import React, { useState,useEffect } from 'react';
import { ChevronLeft, ChevronUp, ChevronDown, Upload, Info } from 'lucide-react';

const SettingsPage = () => {
  const [aboutExpanded, setAboutExpanded] = useState(true);
  const [reviewsExpanded, setReviewsExpanded] = useState(false);
  const [servicesExpanded, setServicesExpanded] = useState(false);
  const [photosExpanded, setPhotosExpanded] = useState(false);
  const [socialExpanded, setSocialExpanded] = useState(false);
  const [accreditationsExpanded, setAccreditationsExpanded] = useState(false);
  const [qasExpanded, setQasExpanded] = useState(false);
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await api.get('/users/profile');
         
        } catch (error) {
          toast.error('Failed to load service categories');
        }
      };
      fetchData();
    }, []);

  return (
    <div className="min-h-screen bg-gray-50">
  
      <div className="px-6 py-6 max-w-4xl mx-auto">

        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Your profile is <span className="text-green-500">83% complete</span>
          </h1>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
            <div className="bg-green-500 h-3 rounded-full relative" style={{width: '83%'}}>
              <div className="absolute right-0 top-0 w-4 h-4 bg-green-500 rounded-full -mt-0.5 border-2 border-white"></div>
            </div>
          </div>
          <p className="text-green-600 font-medium mb-2">Looking good!</p>
          <p className="text-gray-600 mb-2">
            Make the best first impression with a great profile — this is what customers will look at first when choosing which professional to hire.
          </p>
          <button className="text-blue-600 hover:text-blue-700 font-medium">View public profile</button>
        </div>

        {/* About Section */}
        <div className="bg-white rounded-lg border border-gray-200 mb-4">
          <div 
            className="flex items-center justify-between p-4 cursor-pointer"
            onClick={() => setAboutExpanded(!aboutExpanded)}
          >
            <h2 className="text-lg font-medium text-gray-900">About</h2>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
              {aboutExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
            </div>
          </div>
          
          {aboutExpanded && (
            <div className="px-4 pb-6">
              {/* Company name & logo */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Company name & logo</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Use the same business name customers will see when searching for a professional.
                  <br />
                  As a sole-trader, you can just enter your name.
                </p>
                
                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                    <div className="w-8 h-8 bg-white rounded-full"></div>
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm">
                    Upload new picture
                  </button>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company name</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    defaultValue="Sharplogicians"
                  />
                </div>
              </div>

              {/* Name and profile picture */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Name and profile picture</h3>
                <p className="text-gray-600 text-sm mb-4">
                  This is the person who will be communicating with customers on Bark. The photo will appear alongside your messages with customers.
                </p>
                
                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-800"></div>
                  </div>
                  <div className="space-x-2">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm">
                      Upload new picture
                    </button>
                    <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm">
                      Upload using Webcam
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    defaultValue="Adeel Ishfaq"
                  />
                </div>
              </div>

              {/* Company contact details */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Company contact details</h3>
                <p className="text-gray-600 text-sm mb-4">
                  This information will be seen by customers on Bark. Change the details Bark uses to contact you privately in <span className="text-blue-600">Account Details</span>
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company email address</label>
                    <input 
                      type="email" 
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      defaultValue="adeel@sharplogicians.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company phone number</label>
                    <input 
                      type="tel" 
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      defaultValue="307 392 4236"
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <input 
                    type="url" 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    defaultValue="http://sharplogicians.com"
                  />
                </div>
              </div>

              {/* Company location */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Company location</h3>
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <p className="text-sm text-gray-700">
                    <Info className="w-4 h-4 inline mr-1" />
                    This will <strong>not affect</strong> the areas where you offer or provide services.
                  </p>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Use a specific address to help customers searching for a local business
                </p>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">What's the business location?</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter the company's address"
                  />
                </div>
                
                {/* Map */}
                <div className="w-full h-64 bg-blue-200 rounded-lg mb-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-300 to-green-300 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-8 h-8 bg-red-500 rounded-full mx-auto mb-2"></div>
                      <p className="text-sm text-gray-700">Interactive Map View</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 mb-4">
                  <input type="checkbox" id="hideLocation" className="rounded" />
                  <label htmlFor="hideLocation" className="text-sm text-gray-700">
                    Don't show this on my profile
                  </label>
                  <Info className="w-4 h-4 text-gray-400" />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Can't give us a particular location?</label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>Select a reason</option>
                  </select>
                </div>
              </div>

              {/* About the company */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-2">About the company</h3>
                <p className="text-gray-600 text-sm mb-4">Introduce your company to your customers.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company size</label>
                    <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>11-50 employees</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Years in business</label>
                    <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>17</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Describe your company</label>
                  <textarea 
                    rows={4}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    defaultValue="Sharplogicians is a combination of charisma and quality focused Project Managers, Designers, Developers, QA Team & Supportive Staff."
                  />
                  <p className="text-sm text-gray-500 mt-1">Characters: 150 / Maximum</p>
                  <button className="text-blue-600 hover:text-blue-700 text-sm mt-2">
                    Here's our tips for writing a great description
                  </button>
                </div>
              </div>
              
              <button className="text-gray-600 hover:text-gray-900">Cancel</button>
            </div>
          )}
        </div>

        {/* Other Sections */}
        {[
          { title: 'Reviews', expanded: reviewsExpanded, setExpanded: setReviewsExpanded, status: 'incomplete' },
          { title: 'Services', expanded: servicesExpanded, setExpanded: setServicesExpanded, status: 'complete' },
          { title: 'Photos', expanded: photosExpanded, setExpanded: setPhotosExpanded, status: 'incomplete' },
          { title: 'Social media & links', expanded: socialExpanded, setExpanded: setSocialExpanded, status: 'complete' },
          { title: 'Accreditations', expanded: accreditationsExpanded, setExpanded: setAccreditationsExpanded, status: 'complete' },
          { title: 'Q&As', expanded: qasExpanded, setExpanded: setQasExpanded, status: 'complete' }
        ].map((section, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 mb-4">
            <div 
              className="flex items-center justify-between p-4 cursor-pointer"
              onClick={() => section.setExpanded(!section.expanded)}
            >
              <h2 className="text-lg font-medium text-gray-900">{section.title}</h2>
              <div className="flex items-center space-x-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  section.status === 'complete' ? 'bg-green-500' : 'bg-gray-200'
                }`}>
                  {section.status === 'complete' && <div className="w-3 h-3 bg-white rounded-full"></div>}
                </div>
                {section.expanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </div>
            </div>
            
            {section.expanded && (
              <div className="px-4 pb-6">
                <p className="text-gray-600">Content for {section.title} section would go here...</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettingsPage;