'use client';
import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, Upload, Info } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import api from '../../../lib/api';

const SettingsPage = () => {
  const [aboutExpanded, setAboutExpanded] = useState(true);
  const [reviewsExpanded, setReviewsExpanded] = useState(false);
  const [servicesExpanded, setServicesExpanded] = useState(false);
  const [photosExpanded, setPhotosExpanded] = useState(false);
  const [socialExpanded, setSocialExpanded] = useState(false);
  const [accreditationsExpanded, setAccreditationsExpanded] = useState(false);
  const [qasExpanded, setQasExpanded] = useState(false);
  const [profile, setProfile] = useState({
    companyName: '',
    companyLogo: '',
    name: '',
    profilePicture: '',
    companyEmail: '',
    companyPhone: '',
    website: '',
    companyLocation: {
      address: '',
      city: '',
      postcode: '',
      country: 'PK',
      coordinates: [73.0479, 33.6844],
      hideLocation: false,
    },
    companySize: 'self-employed',
    yearsInBusiness: 0,
    description: '',
  });
  
         const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1];
  const [profileCompletion, setProfileCompletion] = useState(83);
  const [reviews, setReviews] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileResponse, reviewsResponse, servicesResponse] = await Promise.all([
          api.get('/users/profile', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get('/reviews', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get('/services/getuserservice', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setProfile(profileResponse.data.data);
        setReviews(reviewsResponse.data.data);
        setServices(servicesResponse.data.data);
        setProfileCompletion(calculateProfileCompletion(profileResponse.data.data));
      } catch (error) {
        toast.error('Failed to load data');
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const calculateProfileCompletion = (data) => {
    const fields = [
      data.companyName,
      data.companyLogo !== 'default-avatar.jpg',
      data.name,
      data.profilePicture !== 'default-avatar.jpg',
      data.companyEmail,
      data.companyPhone,
      data.website,
      data.companyLocation.address,
      data.companySize,
      data.yearsInBusiness,
      data.description,
    ];
    const filledFields = fields.filter(Boolean).length;
    return Math.round((filledFields / fields.length) * 100);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(
        '/users/profile',
        profile,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfile(response.data.data);
      setProfileCompletion(calculateProfileCompletion(response.data.data));
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Error updating profile:', error);
    }
  };

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append(type === 'companyLogo' ? 'companyLogo' : 'profilePicture', file);

    try {
      const response = await api.post(
        `/users/${type === 'companyLogo' ? 'company-logo' : 'profile-picture'}`,
        formData,
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
      );
      setProfile((prev) => ({
        ...prev,
        [type]: response.data.data[type],
      }));
      toast.success(`${type === 'companyLogo' ? 'Company logo' : 'Profile picture'} uploaded successfully`);
    } catch (error) {
      toast.error(`Failed to upload ${type === 'companyLogo' ? 'company logo' : 'profile picture'}`);
      console.error('Error uploading image:', error);
    }
  };

  const handleAddReviewResponse = async (reviewId, comment, isPublic) => {
    try {
      const response = await api.put(
        `/reviews/${reviewId}/response`,
        { comment, isPublic },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReviews(reviews.map(r => r._id === reviewId ? { ...r, response: response.data.data.response } : r));
      toast.success('Response added successfully');
    } catch (error) {
      toast.error('Failed to add response');
      console.error('Error adding response:', error);
    }
  };

  const handleUpdateServiceStatus = async (serviceId, isPaused) => {
    try {
      const response = await api.put(
        `/services/${serviceId}/status`,
        { isPaused },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setServices(services.map(s => s._id === serviceId ? response.data.data : s));
      toast.success('Service status updated successfully');
    } catch (error) {
      toast.error('Failed to update service status');
      console.error('Error updating service status:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-6 py-6 max-w-4xl mx-auto">
        {/* Profile Completion Section (Unchanged) */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Your profile is <span className="text-green-500">{profileCompletion}% complete</span>
          </h1>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
            <div
              className="bg-green-500 h-3 rounded-full relative"
              style={{ width: `${profileCompletion}%` }}
            >
              <div className="absolute right-0 top-0 w-4 h-4 bg-green-500 rounded-full -mt-0.5 border-2 border-white"></div>
            </div>
          </div>
          <p className="text-green-600 font-medium mb-2">Looking good!</p>
          <p className="text-gray-600 mb-2">
            Make the best first impression with a great profile — this is what customers will look at
            first when choosing which professional to hire.
          </p>
          <button className="text-blue-600 hover:text-blue-700 font-medium">
            View public profile
          </button>
        </div>
<div className="bg-white rounded-lg border border-gray-200 mb-4">
          <div
            className="flex items-center justify-between p-4 cursor-pointer"
            onClick={() => setAboutExpanded(!aboutExpanded)}
          >
            <h2 className="text-lg font-medium text-gray-900">About</h2>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
              {aboutExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
   
            </div>
          </div>

          {aboutExpanded && (
            <div className="px-4 pb-6">
              <form onSubmit={handleUpdateProfile}>
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
                      <img src={profile.companyLogo} alt="Company Logo" className="w-full h-full object-cover rounded-lg" />
                    </div>
                    <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm cursor-pointer">
                      Upload new picture
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'companyLogo')}
                      />
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company name</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={profile.companyName}
                      onChange={(e) =>
                        setProfile({ ...profile, companyName: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Name and profile picture */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-2">Name and profile picture</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    This is the person who will be communicating with customers on Bark. The photo will
                    appear alongside your messages with customers.
                  </p>
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center overflow-hidden">
                      <img src={profile.profilePicture} alt="Profile Picture" className="w-full h-full object-cover" />
                    </div>
                    <div className="space-x-2">
                      <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm cursor-pointer">
                        Upload new picture
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'profilePicture')}
                        />
                      </label>
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
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    />
                  </div>
                </div>

                {/* Company contact details */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-2">Company contact details</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    This information will be seen by customers on Bark. Change the details Bark uses to
                    contact you privately in <span className="text-blue-600">Account Details</span>
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company email address
                      </label>
                      <input
                        type="email"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={profile.companyEmail}
                        onChange={(e) =>
                          setProfile({ ...profile, companyEmail: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company phone number
                      </label>
                      <input
                        type="tel"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={profile.companyPhone}
                        onChange={(e) =>
                          setProfile({ ...profile, companyPhone: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                    <input
                      type="url"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={profile.website}
                      onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                    />
                  </div>
                </div>

                {/* Company location */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-2">Company location</h3>
                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <p className="text-sm text-gray-700">
                      <Info className="w-4 h-4 inline mr-1" />
                      This will <strong>not affect</strong> the areas where you offer or provide
                      services.
                    </p>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    Use a specific address to help customers searching for a local business
                  </p>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      What's the business location?
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={profile.companyLocation.address}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          companyLocation: { ...profile.companyLocation, address: e.target.value },
                        })
                      }
                      placeholder="Enter the company's address"
                    />
                  </div>
                  {/* Map Placeholder */}
                  <div className="w-full h-64 bg-blue-200 rounded-lg mb-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-300 to-green-300 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-8 h-8 bg-red-500 rounded-full mx-auto mb-2"></div>
                        <p className="text-sm text-gray-700">Interactive Map View</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mb-4">
                    <input
                      type="checkbox"
                      id="hideLocation"
                      className="rounded"
                      checked={profile.companyLocation.hideLocation}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          companyLocation: {
                            ...profile.companyLocation,
                            hideLocation: e.target.checked,
                          },
                        })
                      }
                    />
                    <label htmlFor="hideLocation" className="text-sm text-gray-700">
                      Don't show this on my profile
                    </label>
                    <Info className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Can't give us a particular location?
                    </label>
                    <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>Select a reason</option>
                    </select>
                  </div>
                </div>

                {/* About the company */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-2">About the company</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Introduce your company to your customers.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company size
                      </label>
                      <select
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={profile.companySize}
                        onChange={(e) =>
                          setProfile({ ...profile, companySize: e.target.value })
                        }
                      >
                        <option value="self-employed">Self-employed</option>
                        <option value="2-10">2-10 employees</option>
                        <option value="11-50">11-50 employees</option>
                        <option value="51-200">51-200 employees</option>
                        <option value="200+">200+ employees</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Years in business
                      </label>
                      <select
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={profile.yearsInBusiness}
                        onChange={(e) =>
                          setProfile({ ...profile, yearsInBusiness: parseInt(e.target.value) })
                        }
                      >
                        {[...Array(51).keys()].map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Describe your company
                    </label>
                    <textarea
                      rows={4}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={profile.description}
                      onChange={(e) =>
                        setProfile({ ...profile, description: e.target.value })
                      }
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Characters: {profile.description.length} / 500
                    </p>
                    <button className="text-blue-600 hover:text-blue-700 text-sm mt-2">
                      Here's our tips for writing a great description
                    </button>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    className="text-gray-600 hover:text-gray-900 px-4 py-2"
                    onClick={() => setProfile({ ...profile })} // Reset form (optional)
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-lg border border-gray-200 mb-4">
          <div
            className="flex items-center justify-between p-4 cursor-pointer"
            onClick={() => setReviewsExpanded(!reviewsExpanded)}
          >
            <h2 className="text-lg font-medium text-gray-900">Reviews</h2>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
              {reviewsExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
            </div>
          </div>
          {reviewsExpanded && (
            <div className="px-4 pb-6">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review._id} className="mb-4 p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <img src={review.customer.avatar || 'default-avatar.jpg'} alt={review.customer.firstName} className="w-8 h-8 rounded-full" />
                      <div>
                        <p className="font-medium">{review.customer.firstName} {review.customer.lastName}</p>
                        <p className="text-sm text-gray-500">{review.reviewAge}</p>
                      </div>
                    </div>
                    <p className="text-yellow-500 mb-1">{'★'.repeat(review.rating) + '☆'.repeat(5 - review.rating)}</p>
                    {review.title && <p className="font-medium mb-1">{review.title}</p>}
                    <p className="text-gray-600 mb-2">{review.comment}</p>
                    {review.response && (
                      <div className="bg-gray-50 p-2 rounded-md mt-2">
                        <p className="text-sm text-gray-700">Response: {review.response.comment}</p>
                        <p className="text-xs text-gray-500">Responded: {new Date(review.response.respondedAt).toLocaleDateString()}</p>
                      </div>
                    )}
                    {!review.response && (
                      <button
                        className="text-blue-600 hover:text-blue-700 text-sm mt-2"
                        onClick={() => handleAddReviewResponse(review._id, `Response to ${review.customer.firstName}'s review`, true)}
                      >
                        Add Response
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No reviews yet.</p>
              )}
            </div>
          )}
        </div>

        {/* Services Section */}
        <div className="bg-white rounded-lg border border-gray-200 mb-4">
          <div
            className="flex items-center justify-between p-4 cursor-pointer"
            onClick={() => setServicesExpanded(!servicesExpanded)}
          >
            <h2 className="text-lg font-medium text-gray-900">Services</h2>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-green-500 rounded-full"></div>
              {servicesExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
            </div>
          </div>
          {servicesExpanded && (
            <div className="px-4 pb-6">
              {services.length > 0 ? (
                services.map((service) => (
                  <div key={service._id} className="mb-4 p-4 border border-gray-200 rounded-lg">
                    <img src={service.primaryImage} alt={service.title} className="w-16 h-16 object-cover rounded-lg mb-2" />
                    <h3 className="font-medium">{service.title}</h3>
                    <p className="text-sm text-gray-600">{service.shortDescription}</p>
                    <p className="text-sm text-gray-700">Price: {service.priceDisplay}</p>
                    <p className="text-sm text-yellow-500">Rating: {service.rating.average} ({service.rating.count} reviews)</p>
                    <button
                      className={`text-sm px-2 py-1 rounded ${service.isPaused ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white mt-2`}
                      onClick={() => handleUpdateServiceStatus(service._id, !service.isPaused)}
                    >
                      {service.isPaused ? 'Resume' : 'Pause'}
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No services available.</p>
              )}
            </div>
          )}
        </div>

        {/* Photos, Social media & links, Accreditations, Q&As (Unchanged) */}
        {[
          { title: 'Photos', expanded: photosExpanded, setExpanded: setPhotosExpanded, status: 'incomplete' },
          { title: 'Social media & links', expanded: socialExpanded, setExpanded: setSocialExpanded, status: 'complete' },
          { title: 'Accreditations', expanded: accreditationsExpanded, setExpanded: setAccreditationsExpanded, status: 'complete' },
          { title: 'Q&As', expanded: qasExpanded, setExpanded: setQasExpanded, status: 'complete' },
        ].map((section, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 mb-4">
            <div
              className="flex items-center justify-between p-4 cursor-pointer"
              onClick={() => section.setExpanded(!section.expanded)}
            >
              <h2 className="text-lg font-medium text-gray-900">{section.title}</h2>
              <div className="flex items-center space-x-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    section.status === 'complete' ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                >
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