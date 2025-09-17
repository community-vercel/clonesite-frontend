'use client';
import { useState, useEffect, useCallback } from 'react';
import { 
  User, FileText, MessageSquare, Settings, CreditCard, Bell, ExternalLink, 
  ChevronDown, ChevronRight, MapPin, Plus, Edit, Eye, EyeOff,
  Star, Shield, Award, Info, CheckCircle, AlertTriangle,
  ToggleLeft, ToggleRight, X
} from 'lucide-react';

export default function BarkSettings() {
  const [activeSection, setActiveSection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [creditsData, setCreditsData] = useState({});
  const [leadSettings, setLeadSettings] = useState({ services: [], locations: [] });
  const [accountDetails, setAccountDetails] = useState({});
  const [expandedFaq, setExpandedFaq] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [newService, setNewService] = useState({ name: '', description: '' });
  const [newLocation, setNewLocation] = useState({ name: '', type: 'custom' });
  const [showAddService, setShowAddService] = useState(false);
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [couponInput, setCouponInput] = useState('');

  // Mock token for demonstration - in real app, get from auth context
  const token = typeof document !== 'undefined' ? 
    document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] : '';

  const apiCall = useCallback(async (endpoint, options = {}) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          ...options.headers
        },
        ...options
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }, [token]);

  // Load data on component mount
  useEffect(() => {
    loadProfileData();
    loadCreditsData();
    loadLeadSettings();
    loadAccountDetails();
  }, [apiCall]);

  const loadProfileData = async () => {
    try {
      const data = await apiCall('/profile');
      if (data.success) {
        setProfileData(data.data);
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
      setError('Failed to load profile data');
    }
  };

  const loadCreditsData = async () => {
    try {
      const data = await apiCall('/credits');
      if (data.success) {
        setCreditsData(data.data);
      }
    } catch (error) {
      console.error('Failed to load credits:', error);
      setError('Failed to load credits data');
    }
  };

  const loadLeadSettings = async () => {
    try {
      const data = await apiCall('/lead-settings');
      if (data.success) {
        setLeadSettings(data.data);
      }
    } catch (error) {
      console.error('Failed to load lead settings:', error);
      setError('Failed to load lead settings');
    }
  };

  const loadAccountDetails = async () => {
    try {
      const data = await apiCall('/account-details');
      if (data.success) {
        setAccountDetails(data.data);
      }
    } catch (error) {
      console.error('Failed to load account details:', error);
      setError('Failed to load account details');
    }
  };

  const handleBuyCredits = async (packageType) => {
    try {
      setLoading(true);
      const data = await apiCall('/buy-credits', {
        method: 'POST',
        body: JSON.stringify({ packageType })
      });
      
      if (data.success) {
        window.open(data.data.checkoutUrl, '_blank');
      }
    } catch (error) {
      console.error('Failed to buy credits:', error);
      setError('Failed to initiate payment');
    } finally {
      setLoading(false);
    }
  };

  const updateAccountDetails = async (details) => {
    try {
      setLoading(true);
      const data = await apiCall('/account-details', {
        method: 'PUT',
        body: JSON.stringify(details)
      });
      
      if (data.success) {
        setAccountDetails(data.data);
        setSuccess('Account details updated successfully');
        setError(null);
      }
    } catch (error) {
      console.error('Failed to update account details:', error);
      setError('Failed to update account details');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (passwordData) => {
    try {
      setLoading(true);
      const data = await apiCall('/change-password', {
        method: 'PUT',
        body: JSON.stringify(passwordData)
      });
      
      if (data.success) {
        setSuccess('Password changed successfully');
        setError(null);
        // Clear password fields
        setAccountDetails(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      }
    } catch (error) {
      console.error('Failed to change password:', error);
      setError(error.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyCoupon = async () => {
    try {
      setLoading(true);
      const data = await apiCall('/apply-coupon', {
        method: 'POST',
        body: JSON.stringify({ couponCode: couponInput })
      });
      
      if (data.success) {
        setCreditsData(prev => ({
          ...prev,
          appliedCoupon: data.data.coupon
        }));
        setSuccess('Coupon applied successfully');
        setError(null);
        setCouponInput('');
      }
    } catch (error) {
      console.error('Failed to apply coupon:', error);
      setError(error.message || 'Failed to apply coupon');
    } finally {
      setLoading(false);
    }
  };

  const toggleOnlineRemoteLeads = async () => {
    try {
      const newValue = !leadSettings.onlineRemoteEnabled;
      const data = await apiCall('/lead-settings', {
        method: 'PUT',
        body: JSON.stringify({ onlineRemoteEnabled: newValue })
      });
      
      if (data.success) {
        setLeadSettings(prev => ({
          ...prev,
          onlineRemoteEnabled: newValue
        }));
      }
    } catch (error) {
      console.error('Failed to update lead settings:', error);
      setError('Failed to update lead settings');
    }
  };

  const addService = async () => {
    try {
      setLoading(true);
      const data = await apiCall('/services', {
        method: 'POST',
        body: JSON.stringify(newService)
      });
      
      if (data.success) {
        setLeadSettings(prev => ({
          ...prev,
          services: [...(prev.services || []), data.data.service]
        }));
        setNewService({ name: '', description: '' });
        setShowAddService(false);
        setSuccess('Service added successfully');
        setError(null);
      }
    } catch (error) {
      console.error('Failed to add service:', error);
      setError(error.message || 'Failed to add service');
    } finally {
      setLoading(false);
    }
  };

  const addLocation = async () => {
    try {
      setLoading(true);
      const data = await apiCall('/locations', {
        method: 'POST',
        body: JSON.stringify(newLocation)
      });
      
      if (data.success) {
        setLeadSettings(prev => ({
          ...prev,
          locations: [...(prev.locations || []), data.data.location]
        }));
        setNewLocation({ name: '', type: 'custom' });
        setShowAddLocation(false);
        setSuccess('Location added successfully');
        setError(null);
      }
    } catch (error) {
      console.error('Failed to add location:', error);
      setError(error.message || 'Failed to add location');
    } finally {
      setLoading(false);
    }
  };

  const creditsFaq = [
    {
      question: "What are credits?",
      answer: "Credits are used to contact potential customers on Bark. Each time you want to send a quote or message to a customer, you'll use credits. This ensures quality interactions between customers and service providers."
    },
    {
      question: "What is the starter pack?",
      answer: `The starter pack gives you ${creditsData.packages?.[0]?.credits || 280} credits for £${creditsData.packages?.[0]?.price || 392}.00 (ex VAT) - enough for about 10 leads. It's perfect for businesses just getting started on Bark or those who want to test the platform.`
    },
    {
      question: "What is the Get Hired Guarantee?",
      answer: "We're so confident you'll get hired at least once that if you don't, we'll return all the credits. Our guarantee ensures you get real value from your investment in Bark."
    }
  ];

  const CreditsSection = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={() => setActiveSection(null)}
          className="flex items-center text-gray-600 hover:text-gray-800"
        >
          <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
          Settings
        </button>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My credits</h1>
        <div className="text-right">
          <div className="text-sm text-gray-600">Current balance</div>
          <div className="text-2xl font-bold text-green-600">{creditsData.currentBalance || 0} credits</div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mb-8">
        {creditsFaq.map((faq, index) => (
          <div key={index} className="border-b border-gray-200 py-3">
            <button
              onClick={() => setExpandedFaq({
                ...expandedFaq,
                [index]: !expandedFaq[index]
              })}
              className="flex items-center justify-between w-full text-left"
            >
              <span className="font-medium text-gray-900">{faq.question}</span>
              <ChevronDown className={`w-5 h-5 text-gray-500 transform transition-transform ${
                expandedFaq[index] ? 'rotate-180' : ''
              }`} />
            </button>
            {expandedFaq[index] && (
              <p className="mt-3 text-gray-600 text-sm">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>

      {/* Credit Packages */}
      <div className="space-y-4">
        {creditsData.packages?.map((pkg, index) => (
          <div key={index} className="border border-blue-200 bg-blue-50 rounded-lg p-6 relative">
            {index === 0 && (
              <>
                <div className="absolute -top-3 left-4 bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium">
                  EXCLUSIVE ONE-TIME OFFER
                </div>
                <div className="absolute -top-3 right-4 bg-blue-600 text-white px-3 py-1 rounded text-sm">
                  {pkg.discount}% OFF + GET HIRED GUARANTEE
                </div>
              </>
            )}
            
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center">
                <div className="bg-gray-800 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium mr-3">
                  🎯
                </div>
                <div>
                  <div className="font-bold text-lg">{pkg.credits} credits</div>
                  <div className="text-gray-600 text-sm">{pkg.description}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-xl">£{pkg.price.toFixed(2)} <span className="text-sm font-normal">(ex VAT)</span></div>
                <div className="text-lg">/ £{pkg.perCreditCost.toFixed(2)} per credit</div>
                <div className="text-gray-500 line-through text-sm">£{pkg.originalPrice.toFixed(2)} (ex VAT)</div>
              </div>
              <button
                onClick={() => handleBuyCredits(pkg.type)}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg disabled:opacity-50 ml-4"
              >
                {loading ? 'Processing...' : 'Buy'}
              </button>
            </div>

            {pkg.guarantee && (
              <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-center">
                <div className="bg-orange-100 rounded-full p-2 mr-3">
                  <Shield className="w-5 h-5 text-orange-600" />
                </div>
                <div className="text-sm">
                  <strong className="text-orange-800">Get Hired Guarantee</strong> - We are so confident you will get hired at least once that if you dont, we will return all the credits.
                </div>
              </div>
            )}

            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id={`auto-topup-${index}`}
                  checked={creditsData.autoTopUp?.enabled && creditsData.autoTopUp?.packageType === pkg.type}
                  onChange={(e) => {
                    // Update auto top-up settings
                    const updatedAutoTopUp = {
                      ...creditsData.autoTopUp,
                      enabled: e.target.checked,
                      packageType: e.target.checked ? pkg.type : 'starter'
                    };
                    setCreditsData(prev => ({
                      ...prev,
                      autoTopUp: updatedAutoTopUp
                    }));
                  }}
                  className="mr-2 rounded border-gray-300"
                />
                <label htmlFor={`auto-topup-${index}`} className="text-sm text-gray-700">
                  Auto top-up next time (Threshold: {creditsData.autoTopUp?.threshold || 10} credits)
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Credit History */}
      {creditsData.transactions && creditsData.transactions.length > 0 && (
        <div className="mt-8">
          <h3 className="font-semibold text-gray-900 mb-4">Recent transactions</h3>
          <div className="space-y-2">
            {creditsData.transactions.slice(0, 5).map((transaction, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">
                    {transaction.type === 'purchase' ? 'Credit Purchase' : 'Credit Used'}
                  </div>
                  <div className="text-sm text-gray-600">
                    {new Date(transaction.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className={`font-medium ${transaction.type === 'purchase' ? 'text-green-600' : 'text-red-600'}`}>
                  {transaction.type === 'purchase' ? '+' : ''}{transaction.amount} credits
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Redeem Coupon */}
      <div className="mt-8">
        <h3 className="font-semibold text-gray-900 mb-4">Redeem coupon</h3>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Coupon code"
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleApplyCoupon}
            disabled={loading || !couponInput}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg disabled:opacity-50"
          >
            {loading ? 'Applying...' : 'Apply'}
          </button>
        </div>
        {creditsData.appliedCoupon && (
          <p className="text-sm text-green-600 mt-2">
            Coupon applied: {creditsData.appliedCoupon.percentOff}% off
          </p>
        )}
        <p className="text-sm text-gray-500 mt-2">Coupons cant be combined. The higher discount applies.</p>
      </div>
    </div>
  );

  const LeadSettingsSection = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={() => setActiveSection(null)}
          className="flex items-center text-gray-600 hover:text-gray-800"
        >
          <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
          Settings
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Lead settings</h1>
          <p className="text-gray-600 mb-8">Leads you can choose to contact.</p>

          {/* Your Services */}
          <div className="mb-8">
            <h3 className="font-semibold text-gray-900 mb-2">Your services</h3>
            <p className="text-sm text-gray-600 mb-4">Fine tune the leads you want to be alerted about.</p>
            
            <div className="space-y-3">
              {leadSettings.services && leadSettings.services.length > 0 ? (
                leadSettings.services.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div>
                      <div className="font-medium text-gray-900">{service.name}</div>
                      <div className="text-sm text-gray-500">{service.leads} • {service.locations}</div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                ))
              ) : (
                <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                  <p className="text-gray-600 mb-2">No services added yet</p>
                  <p className="text-sm text-gray-500">Add your first service to start receiving leads</p>
                </div>
              )}
            </div>

            {showAddService ? (
              <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium">Add New Service</h4>
                  <button onClick={() => setShowAddService(false)} className="text-gray-500 hover:text-gray-700">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Service name"
                    value={newService.name}
                    onChange={(e) => setNewService({...newService, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={newService.description}
                    onChange={(e) => setNewService({...newService, description: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={addService}
                    disabled={loading || !newService.name}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg disabled:opacity-50"
                  >
                    {loading ? 'Adding...' : 'Add Service'}
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setShowAddService(true)}
                className="mt-4 flex items-center text-blue-600 hover:text-blue-700 font-medium"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add a service
              </button>
            )}
          </div>

          {/* Your Locations */}
          <div className="mb-8">
            <h3 className="font-semibold text-gray-900 mb-2">Your locations</h3>
            <p className="text-sm text-gray-600 mb-4">Choose where you want to find new customers.</p>
            
            {leadSettings.locations && leadSettings.locations.length > 0 ? (
              leadSettings.locations.map((location, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">
                        {location.type === 'nationwide' ? 'Nationwide' : location.name || 'Custom Location'}
                      </div>
                      <div className="text-sm text-gray-500">
                        View on map • Remove • {location.services || leadSettings.services?.length || 0} services
                      </div>
                    </div>
                  </div>
                  <Edit className="w-5 h-5 text-gray-400" />
                </div>
              ))
            ) : (
              <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 mb-2">No locations set</p>
                <p className="text-sm text-gray-500">Add locations to receive local leads</p>
              </div>
            )}

            {showAddLocation ? (
              <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium">Add New Location</h4>
                  <button onClick={() => setShowAddLocation(false)} className="text-gray-500 hover:text-gray-700">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Location name"
                    value={newLocation.name}
                    onChange={(e) => setNewLocation({...newLocation, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <select
                    value={newLocation.type}
                    onChange={(e) => setNewLocation({...newLocation, type: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="custom">Custom Location</option>
                    <option value="nationwide">Nationwide</option>
                  </select>
                  <button
                    onClick={addLocation}
                    disabled={loading || !newLocation.name}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg disabled:opacity-50"
                  >
                    {loading ? 'Adding...' : 'Add Location'}
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setShowAddLocation(true)}
                className="mt-4 flex items-center text-blue-600 hover:text-blue-700 font-medium"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add a location
              </button>
            )}
          </div>

          {/* Online/Remote Leads */}
          <div className="mb-8">
            <h3 className="font-semibold text-gray-900 mb-2">Online/remote leads</h3>
            <p className="text-sm text-gray-600 mb-4">Customers tell us if they re happy to receive services online or remotely.</p>
            
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <span className="text-gray-900">See online/remote leads</span>
              <button
                onClick={toggleOnlineRemoteLeads}
                className="focus:outline-none"
              >
                {leadSettings.onlineRemoteEnabled ? (
                  <ToggleRight className="w-10 h-6 text-green-500" />
                ) : (
                  <ToggleLeft className="w-10 h-6 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg">
            View leads
          </button>
        </div>

        {/* Right Column */}
        <div className="lg:pl-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">What type of leads do you want to see?</h2>
          <p className="text-gray-600 mb-6">Specify which details you want to see in all your leads on Bark:</p>
          
          <ul className="space-y-3 mb-6">
            <li className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
              <span className="text-gray-700">Add or remove services</span>
            </li>
            <li className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
              <span className="text-gray-700">Specify details for each service</span>
            </li>
            <li className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
              <span className="text-gray-700">Set-up multiple locations</span>
            </li>
          </ul>

          {/* Illustration */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-8 text-center">
            <div className="w-48 h-48 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
              <div className="text-6xl">👥</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const AccountDetailsSection = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={() => setActiveSection(null)}
          className="flex items-center text-gray-600 hover:text-gray-800"
        >
          <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
          Settings
        </button>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Account Details</h1>

      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium">Manage your account email, phone number, password and login details.</p>
            <p>We will use these details to contact you but wont share it with customers. You can control the email address and phone number that customers see for your business in <a href="#" className="underline">My Profile</a>.</p>
          </div>
        </div>
      </div>

      {/* Contact Details */}
      <div className="mb-8">
        <h3 className="font-semibold text-gray-900 mb-4">Contact details</h3>
        <p className="text-sm text-gray-600 mb-6">These details are used for lead notifications, and to contact you about important account issues. Please ensure they are kept up-to-date.</p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Account email</label>
            <div className="flex items-center">
              <input
                type="email"
                value={accountDetails.email || ''}
                onChange={(e) => setAccountDetails(prev => ({
                  ...prev,
                  email: e.target.value
                }))}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {accountDetails.emailVerified && (
                <CheckCircle className="w-5 h-5 text-green-500 ml-2" />
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred contact number</label>
            <div className="flex items-center">
              <input
                type="tel"
                value={accountDetails.phone || ''}
                onChange={(e) => setAccountDetails(prev => ({
                  ...prev,
                  phone: e.target.value
                }))}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {accountDetails.phoneVerified && (
                <CheckCircle className="w-5 h-5 text-green-500 ml-2" />
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">SMS notification number</label>
            <input
              type="tel"
              value={accountDetails.smsPhone || ''}
              onChange={(e) => setAccountDetails(prev => ({
                ...prev,
                smsPhone: e.target.value
              }))}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter phone number for SMS notifications"
            />
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="mb-8">
        <h3 className="font-semibold text-gray-900 mb-2">Change password</h3>
        <p className="text-sm text-gray-600 mb-4">Its important to keep your password up-to-date.</p>
        
        <div className="space-y-4">
          <input
            type="password"
            placeholder="Current Password"
            value={accountDetails.currentPassword || ''}
            onChange={(e) => setAccountDetails(prev => ({
              ...prev,
              currentPassword: e.target.value
            }))}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="New Password"
            value={accountDetails.newPassword || ''}
            onChange={(e) => setAccountDetails(prev => ({
              ...prev,
              newPassword: e.target.value
            }))}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={accountDetails.confirmPassword || ''}
            onChange={(e) => setAccountDetails(prev => ({
              ...prev,
              confirmPassword: e.target.value
            }))}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => handleChangePassword({
              currentPassword: accountDetails.currentPassword,
              newPassword: accountDetails.newPassword,
              confirmPassword: accountDetails.confirmPassword
            })}
            disabled={loading || !accountDetails.currentPassword || !accountDetails.newPassword || !accountDetails.confirmPassword}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg disabled:opacity-50"
          >
            {loading ? 'Changing...' : 'Change password'}
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-6 border-t border-gray-200">
        <button
          onClick={() => updateAccountDetails({
            email: accountDetails.email,
            phone: accountDetails.phone,
            smsPhone: accountDetails.smsPhone
          })}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );

  const MainSettingsPage = () => (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

        <div className="space-y-8">
          {/* My Profile Section */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-blue-50 rounded-lg mr-3">
                <User className="w-5 h-5 text-gray-700" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">My Profile</h2>
            </div>
            <div className="space-y-4">
              {[
                {
                  title: 'My Profile',
                  slug: '/dashbiard/profile',
                  description:
                    'Your profile is key to attracting customers on Bark. Use it to explain what makes you different from your competition & why people should work with you',
                  link: true,
                },
                {
                  title: 'Reviews',
                  slug: '/dashbiard/profile',
                  description: 'All your reviews in one place',
                  link: true,
                },
                {
                  title: 'Elite Pro',
                  description:
                    'Enhance your business presence and attract more attention with Elite Pro',
                },
                {
                  title: 'Badges',
                  description:
                    'Badges help you stand out. Learn how to use them to boost your business',
                },
                {
                  title: 'Account details',
                  description:
                    'The email address and password you use to log in, and the phone numbers we use to contact you privately',
                  onClick: () => setActiveSection('account-details'),
                },
              ].map((item, index) => {
                const Content = (
                  <div className="border-l-4 border-transparent hover:border-blue-400 transition-colors duration-200">
                    <div className="pl-4 py-2 hover:bg-gray-50 rounded-r-lg transition-colors duration-200">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3
                            className={`font-medium ${
                              item.link
                                ? 'text-blue-600 hover:text-blue-700 cursor-pointer'
                                : 'text-gray-900'
                            }`}
                          >
                            {item.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                        </div>
                        {item.link && (
                          <ExternalLink className="w-4 h-4 text-blue-600 ml-2 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  </div>
                );

                if (item.slug) {
                  return (
                    <a href={`/${item.slug}`} key={index} className="block">
                      {Content}
                    </a>
                  );
                }

                if (item.onClick) {
                  return (
                    <button
                      key={index}
                      onClick={item.onClick}
                      className="w-full text-left focus:outline-none"
                    >
                      {Content}
                    </button>
                  );
                }

                return (
                  <div key={index}>
                    {Content}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Credits & Payments Section */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-red-50 rounded-lg mr-3">
                <CreditCard className="w-5 h-5 text-gray-700" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Credits & Payments</h2>
            </div>
            <div className="space-y-4">
              {[
                {
                  title: 'My credits',
                  description: `View credit history & buy credits to contact more customers (Balance: ${creditsData.currentBalance || 0} credits)`,
                  onClick: () => setActiveSection('credits')
                },
                {
                  title: 'Invoices and billing details',
                  description: 'View your invoices and manage your billing details'
                },
                {
                  title: 'My payment details',
                  description: 'Your payment settings'
                }
              ].map((item, index) => (
                <div key={index} className="border-l-4 border-transparent hover:border-blue-400 transition-colors duration-200">
                  <div className="pl-4 py-2 hover:bg-gray-50 rounded-r-lg transition-colors duration-200 cursor-pointer" onClick={item.onClick}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lead Settings Section */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-green-50 rounded-lg mr-3">
                <FileText className="w-5 h-5 text-gray-700" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Lead settings</h2>
            </div>
            <div className="space-y-4">
              {[
                {
                  title: 'My services',
                  description: `Tell us what services you provide so we can send you the most relevant leads (${leadSettings.services?.length || 0} services)`
                },
                {
                  title: 'My locations',
                  description: `Tell us what locations you provide your services in (${leadSettings.locations?.length || 0} locations)`,
                  onClick: () => setActiveSection('lead-settings')
                }
              ].map((item, index) => (
                <div key={index} className="border-l-4 border-transparent hover:border-blue-400 transition-colors duration-200">
                  <div className="pl-4 py-2 hover:bg-gray-50 rounded-r-lg transition-colors duration-200 cursor-pointer" onClick={item.onClick}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Communication Section */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-purple-50 rounded-lg mr-3">
                <MessageSquare className="w-5 h-5 text-gray-700" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Communication</h2>
            </div>
            <div className="space-y-4">
              {[
                {
                  title: 'One-click response',
                  description: 'Save time and create an email template that can be sent with one click'
                },
                {
                  title: 'Email templates',
                  description: 'Save time with email templates you can send to customers when you buy a lead'
                },
                {
                  title: 'SMS templates',
                  description: 'Contact customers quickly with custom SMS templates'
                }
              ].map((item, index) => (
                <div key={index} className="border-l-4 border-transparent hover:border-blue-400 transition-colors duration-200">
                  <div className="pl-4 py-2 hover:bg-gray-50 rounded-r-lg transition-colors duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications Section */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-indigo-50 rounded-lg mr-3">
                <Bell className="w-5 h-5 text-gray-700" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
            </div>
            <div className="space-y-4">
              {[
                {
                  title: 'Email',
                  description: 'Set what type of emails you\'d like to receive from us'
                },
                {
                  title: 'Browser',
                  description: 'Set what type of notifications from us you\'d like to receive in your web browser'
                }
              ].map((item, index) => (
                <div key={index} className="border-l-4 border-transparent hover:border-blue-400 transition-colors duration-200">
                  <div className="pl-4 py-2 hover:bg-gray-50 rounded-r-lg transition-colors duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Integrations Section */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-yellow-50 rounded-lg mr-3">
                <Settings className="w-5 h-5 text-gray-700" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Integrations</h2>
            </div>
            <div className="space-y-4">
              {[
                {
                  title: 'Hubspot',
                  description: 'Automatically sync your purchased leads with your HubSpot CRM'
                },
                {
                  title: 'Zapier',
                  description: 'Connect Bark with services like Slack, Google Sheets, Mailchimp, etc.'
                }
              ].map((item, index) => (
                <div key={index} className="border-l-4 border-transparent hover:border-blue-400 transition-colors duration-200">
                  <div className="pl-4 py-2 hover:bg-gray-50 rounded-r-lg transition-colors duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );

  // Show alerts
  const AlertMessage = ({ type, message, onClose }) => (
    <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
      type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
    }`}>
      <div className="flex items-center">
        {type === 'success' ? (
          <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
        ) : (
          <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
        )}
        <span className={type === 'success' ? 'text-green-800' : 'text-red-800'}>{message}</span>
        <button
          onClick={onClose}
          className="ml-4 text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Alert Messages */}
      {error && (
        <AlertMessage 
          type="error" 
          message={error} 
          onClose={() => setError(null)} 
        />
      )}
      {success && (
        <AlertMessage 
          type="success" 
          message={success} 
          onClose={() => setSuccess(null)} 
        />
      )}

 
      {/* Render appropriate section */}
      {activeSection === 'credits' && <CreditsSection />}
      {activeSection === 'lead-settings' && <LeadSettingsSection />}
      {activeSection === 'account-details' && <AccountDetailsSection />}
      {!activeSection && <MainSettingsPage />}
    </div>
  );
}