'use client';

import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { X, ChevronDown, ChevronUp, Shield, CreditCard, CheckCircle, AlertCircle, Loader2, Lock } from 'lucide-react';
import api from '../lib/api';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe('pk_test_51RPM9TRrTfHc97PXAZ5IxGY6vtzWCsIwJIMhZNEVjkrwVUNJPuSuHX24yEG9Rtfc7wC91ekp3n4qaFuEWFAQiec3006UoRdV6G');

const ContactLeadModal = ({ isOpen, onClose, leadId, customerName }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('check');
  const [leadData, setLeadData] = useState(null);
  const [error, setError] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    credits: false,
    starterPack: false,
    getHiredGuarantee: false,
  });
  const [autoTopUp, setAutoTopUp] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [stripeData, setStripeData] = useState(null);
  const [billingDetails, setBillingDetails] = useState({
    name: '',
    email: '',
    address: {
      postal_code: '',
    },
  });

  // Check lead requirements when modal opens
  useEffect(() => {
    if (isOpen && leadId) {
      checkLeadRequirements();
    }
  }, [isOpen, leadId]);

  const checkLeadRequirements = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('token='))
        ?.split('=')[1];

      if (!token) {
        throw new Error('Authentication token not found');
      }

      // Simulated API call - replace with your actual API
      const response = await api.get(`/requests/contact/${leadId}/check`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = response.data;

      if (!data.success) {
        throw new Error(data.message || 'Failed to check lead requirements');
      }

      setLeadData({
        lead: { cost: 5, title: 'Sample Project' },
        provider: { hasEnoughCredits: false, currentCredits: 2 },
        pricing: {
          starterPack: {
            credits: 280,
            price: 392.00,
            originalPrice: 490.00,
            pricePerCredit: 1.40,
            enoughForLeads: 10,
          },
        },
      });
      setStep(data.data?.provider?.hasEnoughCredits ? 'contact' : 'purchase');
    } catch (error) {
      setError(error.message);
      console.error('Error checking lead requirements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContactLead = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('token='))
        ?.split('=')[1];

      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await api.post(`/api/requests/contact/${leadId}`, {
        message: `Hi ${customerName}, I'm interested in your ${leadData?.lead?.title} project. I'd love to discuss how I can help you.`,
        useCredits: true,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = response.data;

      if (data.success) {
        setStep('success');
        setTimeout(() => {
          onClose();
          setStep('check');
        }, 3000);
      } else {
        throw new Error(data.message || 'Failed to contact lead');
      }
    } catch (error) {
      setError(error.response?.data?.message || error.message);
      console.error('Error contacting lead:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializeStripePayment = async () => {
    try {
      setPurchaseLoading(true);
      setError(null);

      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('token='))
        ?.split('=')[1];

      if (!token) {
        throw new Error('Authentication token not found');
      }

      const payload = {
        package: 'starter',
        credits: leadData.pricing.starterPack.credits,
        amount: leadData.pricing.starterPack.price,
        currency: 'gbp',
        autoTopUp,
        leadId,
      };

      console.log('Sending payload:', payload);

      const response = await fetch('http://localhost:5000/api/payments/create-payment-intent', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        setStripeData(data.data);
        setStep('payment');
      } else {
        throw new Error(data.message || 'Failed to initialize payment');
      }
    } catch (error) {
      setError(error.response?.data?.message || error.message);
      console.error('Error initializing payment:', error);
    } finally {
      setPurchaseLoading(false);
    }
  };

  const processStripePayment = async () => {
    if (!stripe || !elements) {
      setError('Stripe is not properly initialized');
      return;
    }

    try {
      setPurchaseLoading(true);
      setError(null);

      // Validate billing details
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (
        !billingDetails.name ||
        !billingDetails.email ||
        !billingDetails.address.postal_code ||
        !emailRegex.test(billingDetails.email) ||
        !billingDetails.address.postal_code
      ) {
        throw new Error('Please fill in all billing details correctly, including a valid UK postal code (e.g., SW1A 1AA)');
      }

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(stripeData.clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: billingDetails,
        },
      });

      if (error) {
        if (error.message.includes('postal code')) {
          throw new Error(`Please enter a valid postal code (e.g., SW1A 1AA) ${error.message}`);
        }
        throw new Error(error.message);
      }

      setStep('processing');

      if (paymentIntent.status === 'succeeded') {
        const token = document.cookie
          .split('; ')
          .find((row) => row.startsWith('token='))
          ?.split('=')[1];

        if (!token) {
          throw new Error('Authentication token not found');
        }

        const response = await fetch('http://localhost:5000/api/payments/confirm-payment', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id,
            leadId,
          }),
        });

        const data = await response.json();

        if (data.success) {
          setStep('success');
          setTimeout(() => {
            onClose();
            setStep('check');
          }, 4000);
        } else {
          throw new Error(data.message || 'Failed to confirm payment');
        }
      }
    } catch (error) {
      setError(error.message);
      setStep('payment');
      console.error('Error processing payment:', error);
    } finally {
      setPurchaseLoading(false);
    }
  };

  const handleBillingChange = (field, value) => {
    if (field === 'address.postal_code') {
      const cleanedValue = value;
      setBillingDetails((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          postal_code: cleanedValue,
        },
      }));
    } else {
      setBillingDetails((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

 const isBillingDetailsValid = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return (
billingDetails.name.length >= 2
 &&
  emailRegex.test(billingDetails.email) 
 && 
billingDetails.address.postal_code
  );
};


  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {step === 'success'
                ? 'Contact sent!'
                : step === 'processing'
                ? 'Processing payment...'
                : step === 'payment'
                ? 'Complete your purchase'
                : `You need ${leadData?.lead?.cost || 0} credits to contact ${customerName || 'customer'}`}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              disabled={step === 'processing'}
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {step === 'purchase' && (
            <p className="text-gray-600 mt-2">
              To get some credits, you need to buy a starter pack of credits
              <br />
              (Enough for this lead + roughly another {leadData?.pricing?.starterPack?.enoughForLeads - 1 || 9} leads)
            </p>
          )}

          {step === 'payment' && (
            <p className="text-gray-600 mt-2">
              Secure payment powered by Stripe. Your payment details are encrypted and secure.
            </p>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {loading && step === 'check' && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Checking requirements...</span>
            </div>
          )}

          {step === 'processing' && (
            <div className="text-center py-8">
              <Loader2 className="w-16 h-16 animate-spin text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Processing your payment...</h3>
              <p className="text-gray-600">Please don't close this window. This may take a few seconds.</p>
              <div className="mt-4 bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-center text-sm text-blue-700">
                  <Lock className="w-4 h-4 mr-2" />
                  Your payment is secured by 256-bit SSL encryption
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                <span className="text-red-700">{error}</span>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Successfully contacted {customerName}!
              </h3>
              <p className="text-gray-600 mb-4">They will receive your details and can contact you directly.</p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-700">
                  Credits have been added to your account and the lead has been contacted automatically.
                </p>
              </div>
            </div>
          )}

          {step === 'contact' && leadData && (
            <div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-green-700">
                    You have enough credits ({leadData.provider.currentCredits}) to contact this lead.
                  </span>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={handleContactLead}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-3 rounded-lg font-semibold flex items-center mx-auto"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Contacting...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      Use {leadData.lead.cost} credits to contact
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {(step === 'payment' || step === 'processing') && leadData && stripeData && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {leadData.pricing.starterPack.credits} Credits - Starter Pack
                    </h3>
                    <p className="text-sm text-gray-600">
                      Enough for approximately {leadData.pricing.starterPack.enoughForLeads} leads
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      £{leadData.pricing.starterPack.price.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500">inc. VAT</div>
                  </div>
                </div>
              </div>

              {/* Payment Form */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Lock className="w-5 h-5 mr-2 text-green-600" />
                  Secure Payment Details
                </h3>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={billingDetails.email}
                      onChange={(e) => handleBillingChange('email', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        billingDetails.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(billingDetails.email)
                          ? 'border-red-500'
                          : 'border-gray-300'
                      }`}
                      placeholder="your.email@example.com"
                    />
                    {billingDetails.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(billingDetails.email) && (
                      <p className="text-red-500 text-sm mt-1">Please enter a valid email address</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                    <input
                      type="text"
                      value={billingDetails.name}
                      onChange={(e) => handleBillingChange('name', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        billingDetails.name && billingDetails.name.length < 2 ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="John Smith"
                    />
                    {billingDetails.name && billingDetails.name.length < 2 && (
                      <p className="text-red-500 text-sm mt-1">Name must be at least 2 characters</p>
                    )}
                  </div>

                  <div className={step === 'processing' ? 'hidden' : ''}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Card Information</label>
                    <CardElement
                      options={{
                        style: {
                          base: {
                            fontSize: '16px',
                            color: '#424770',
                            '::placeholder': {
                              color: '#aab7c4',
                            },
                          },
                          invalid: {
                            color: '#9e2146',
                          },
                        },
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Postcode</label>
                    <input
                      type="text"
                      value={billingDetails.address.postal_code}
                      onChange={(e) => handleBillingChange('address.postal_code', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        billingDetails.address.postal_code &&
                        !/^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/.test(billingDetails.address.postal_code)
                          ? 'border-red-500'
                          : 'border-gray-300'
                      }`}
                      placeholder="SW1A 1AA"
                    />
                  
                  </div>
                </div>

                {/* Auto top-up option */}
                <div className="flex items-center space-x-3 pt-4">
                  <input
                    type="checkbox"
                    id="autoTopUp"
                    checked={autoTopUp}
                    onChange={(e) => setAutoTopUp(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="autoTopUp" className="text-sm text-gray-700">
                    Auto top-up when my credits run low
                  </label>
                </div>

                <button
                  onClick={processStripePayment}
                  disabled={purchaseLoading || !isBillingDetailsValid() || !stripe || !elements}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-4 rounded-lg font-bold text-lg flex items-center justify-center"
                >
                  {purchaseLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5 mr-2" />
                      Pay £{leadData?.pricing.starterPack.price.toFixed(2)} Securely
                    </>
                  )}
                </button>

                <div className="text-center text-sm text-gray-500">
                  <div className="flex items-center justify-center space-x-4 mt-2">
                    <span>Secured by Stripe</span>
                    <span>•</span>
                    <span>256-bit SSL encryption</span>
                  </div>
                  <p className="mt-2">
                    After payment, {leadData?.lead.cost} credits will be used to contact {customerName}
                  </p>
                </div>
              </div>
            </div>
          )}

          {step === 'purchase' && leadData && (
            <div className="space-y-6">
              {/* Expandable sections */}
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg">
                  <button
                    onClick={() => toggleSection('credits')}
                    className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50"
                  >
                    <span className="font-semibold text-gray-900">What are credits?</span>
                    {expandedSections.credits ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>

                  {expandedSections.credits && (
                    <div className="p-4 pt-0 text-sm text-gray-600 leading-relaxed">
                      Credits are our platform's currency. When you see a job you want to pursue, you use credits to get
                      the customer's contact details (phone number and email address). The number of credits required
                      varies based on the job's potential value - smaller jobs cost fewer credits than larger ones.
                    </div>
                  )}
                </div>

                <div className="border border-gray-200 rounded-lg">
                  <button
                    onClick={() => toggleSection('starterPack')}
                    className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50"
                  >
                    <span className="font-semibold text-gray-900">What is the starter pack?</span>
                    {expandedSections.starterPack ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>

                  {expandedSections.starterPack && (
                    <div className="p-4 pt-0 text-sm text-gray-600 leading-relaxed">
                      The starter pack gives you {leadData.pricing.starterPack.credits} credits for £
                      {leadData.pricing.starterPack.price}, enough to contact approximately{' '}
                      {leadData.pricing.starterPack.enoughForLeads} leads. It's the perfect way to get started and test
                      how well our platform works for your business.
                    </div>
                  )}
                </div>

                <div className="border border-gray-200 rounded-lg">
                  <button
                    onClick={() => toggleSection('getHiredGuarantee')}
                    className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50"
                  >
                    <span className="font-semibold text-gray-900">What is the Get Hired Guarantee?</span>
                    {expandedSections.getHiredGuarantee ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>

                  {expandedSections.getHiredGuarantee && (
                    <div className="p-4 pt-0 text-sm text-gray-600 leading-relaxed">
                      We're so confident in our platform that if you don't get hired from any of the leads you contact
                      with your starter pack, we'll refund all your credits. Terms and conditions apply.
                    </div>
                  )}
                </div>
              </div>

              {/* Pricing Card */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                <div className="text-center mb-4">
                  <div className="inline-block bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-2">
                    EXCLUSIVE ONE-TIME OFFER
                  </div>
                  <div className="text-blue-700 font-medium">20% OFF + GET HIRED GUARANTEE</div>
                </div>

                <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold">
                      {leadData.pricing.starterPack.credits}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{leadData.pricing.starterPack.credits} credits</div>
                      <div className="text-sm text-gray-600">
                        Enough for about {leadData.pricing.starterPack.enoughForLeads} leads
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      £{leadData.pricing.starterPack.price.toFixed(2)}{' '}
                      <span className="text-sm font-normal text-gray-600">(inc VAT)</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      / £{leadData.pricing.starterPack.pricePerCredit.toFixed(2)} per credit
                    </div>
                    <div className="text-sm text-gray-500 line-through">
                      £{leadData.pricing.starterPack.originalPrice.toFixed(2)} (inc VAT)
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 mt-4 p-3 bg-yellow-50 rounded-lg">
                  <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Shield className="w-5 h-5 text-yellow-900" />
                  </div>
                  <div>
                    <div className="font-semibold text-yellow-900">Get Hired Guarantee</div>
                    <div className="text-sm text-yellow-800">
                      We're so confident you'll get hired at least once that if you don't, we'll return all the credits.
                    </div>
                  </div>
                </div>

                <button
                  onClick={initializeStripePayment}
                  disabled={purchaseLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-4 rounded-lg font-bold text-lg mt-6 flex items-center justify-center"
                >
                  {purchaseLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Setting up payment...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5 mr-2" />
                      Buy {leadData.pricing.starterPack.credits} credits securely
                    </>
                  )}
                </button>

                <div className="text-center text-sm text-gray-500 mt-3">
                  You will use {leadData.lead.cost} of your {leadData.pricing.starterPack.credits} purchased credits to
                  contact {customerName}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function WrappedContactLeadModal(props) {
  return (
    <Elements stripe={stripePromise}>
      <ContactLeadModal {...props} />
    </Elements>
  );
}