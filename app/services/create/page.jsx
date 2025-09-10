'use client';

import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { 
  MapPin, 
  DollarSign, 
  Clock, 
  Camera, 
  Plus, 
  X, 
  Star,
  CheckCircle,
  AlertCircle,
  Globe
} from 'lucide-react';

import api from '@/lib/api'; // API client for making requests


export default function CreateService() {
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [imageFiles, setImageFiles] = useState([]);
  const router = useRouter();


  
  const { 
    register, 
    handleSubmit, 
    control,
    watch,
    setValue,
    formState: { errors },
    trigger
  } = useForm({
    defaultValues: {
      pricing: { type: 'hourly', currency: 'USD' },
      location: { coordinates: [-74.006, 40.7128] },
      features: [''],
      whatsIncluded: [''],
      requirements: [''],
      availability: {
        schedule: {
          monday: { available: true, hours: [{ start: '09:00', end: '17:00' }] },
          tuesday: { available: true, hours: [{ start: '09:00', end: '17:00' }] },
          wednesday: { available: true, hours: [{ start: '09:00', end: '17:00' }] },
          thursday: { available: true, hours: [{ start: '09:00', end: '17:00' }] },
          friday: { available: true, hours: [{ start: '09:00', end: '17:00' }] },
          saturday: { available: false, hours: [] },
          sunday: { available: false, hours: [] }
        },
        leadTime: 24,
        maxAdvanceBooking: 30
      }
    }
  });

  const { fields: featureFields, append: appendFeature, remove: removeFeature } = useFieldArray({
    control,
    name: 'features'
  });

  const { fields: includedFields, append: appendIncluded, remove: removeIncluded } = useFieldArray({
    control,
    name: 'whatsIncluded'
  });

  const { fields: requirementFields, append: appendRequirement, remove: removeRequirement } = useFieldArray({
    control,
    name: 'requirements'
  });

  const watchPricingType = watch('pricing.type');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data.data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        toast.error('Failed to load categories');
      }
    };
    fetchCategories();
  }, []);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(prev => [...prev, ...files].slice(0, 10));
  };

  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      
      Object.keys(data).forEach(key => {
        if (typeof data[key] === 'object') {
          formData.append(key, JSON.stringify(data[key]));
        } else {
          formData.append(key, data[key]);
        }
      });

      imageFiles.forEach((file, index) => {
        formData.append('images', file);
      });

      await api.post('/services', formData);
      toast.success('Service created successfully!');
      router.push('/services/my-services');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create service');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = async () => {
    let fieldsToValidate = [];
    
    switch (currentStep) {
      case 1:
        fieldsToValidate = ['title', 'description', 'category'];
        break;
      case 2:
        fieldsToValidate = ['pricing.type'];
        break;
      case 3:
        fieldsToValidate = ['location.coordinates'];
        break;
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const submitForm = () => {
    handleSubmit(onSubmit)();
  };

  const steps = [
    { number: 1, title: 'Basic Info', icon: '📝' },
    { number: 2, title: 'Pricing', icon: '💰' },
    { number: 3, title: 'Location', icon: '📍' },
    { number: 4, title: 'Details', icon: '⚙️' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Your Service</h1>
          <p className="text-gray-600 text-lg">Share your skills with the world</p>
        </div>

        {/* Progress Steps */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`
                  flex items-center justify-center w-12 h-12 rounded-full text-xl font-bold transition-all
                  ${currentStep >= step.number 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'bg-gray-200 text-gray-600'
                  }
                `}>
                  {currentStep > step.number ? <CheckCircle className="w-6 h-6" /> : step.icon}
                </div>
                <div className="ml-3 hidden sm:block">
                  <p className={`text-sm font-medium ${currentStep >= step.number ? 'text-blue-600' : 'text-gray-500'}`}>
                    Step {step.number}
                  </p>
                  <p className={`text-xs ${currentStep >= step.number ? 'text-blue-600' : 'text-gray-500'}`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-4 ${currentStep > step.number ? 'bg-blue-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8">
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell us about your service</h2>
                    <p className="text-gray-600">The basics that customers need to know</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Service Title *
                      </label>
                      <input
                        {...register('title', { required: 'Title is required', maxLength: 100 })}
                        placeholder="e.g., Professional House Cleaning"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                      {errors.title && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.title.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        {...register('category', { required: 'Category is required' })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.icon} {cat.name}
                          </option>
                        ))}
                      </select>
                      {errors.category && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.category.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Short Description
                      </label>
                      <input
                        {...register('shortDescription', { maxLength: 200 })}
                        placeholder="Brief one-liner about your service"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Detailed Description *
                      </label>
                      <textarea
                        {...register('description', { required: 'Description is required', maxLength: 2000 })}
                        rows={4}
                        placeholder="Describe your service in detail. What makes it special?"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                      />
                      {errors.description && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.description.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Pricing */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Set your pricing</h2>
                    <p className="text-gray-600">How do you want to charge for your service?</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-4">
                        Pricing Type *
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {[
                          { value: 'hourly', label: 'Hourly Rate', icon: '⏰' },
                          { value: 'fixed', label: 'Fixed Price', icon: '💰' },
                          { value: 'per_project', label: 'Per Project', icon: '📋' },
                          { value: 'per_item', label: 'Per Item', icon: '📦' },
                          { value: 'per_sqft', label: 'Per Sq Ft', icon: '📐' },
                          { value: 'negotiable', label: 'Negotiable', icon: '🤝' }
                        ].map((type) => (
                          <label
                            key={type.value}
                            className={`
                              flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all
                              ${watchPricingType === type.value 
                                ? 'border-blue-500 bg-blue-50' 
                                : 'border-gray-300 hover:border-gray-400'
                              }
                            `}
                          >
                            <input
                              type="radio"
                              {...register('pricing.type', { required: 'Pricing type is required' })}
                              value={type.value}
                              className="sr-only"
                            />
                            <span className="text-2xl mb-2">{type.icon}</span>
                            <span className="text-sm font-medium text-center">{type.label}</span>
                          </label>
                        ))}
                      </div>
                      {errors.pricing?.type && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.pricing.type.message}
                        </p>
                      )}
                    </div>

                    {watchPricingType && watchPricingType !== 'negotiable' && (
                      <>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Minimum Price
                          </label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input
                              type="number"
                              step="0.01"
                              {...register('pricing.amount.min', { min: 0 })}
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                              placeholder="0.00"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Maximum Price (Optional)
                          </label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input
                              type="number"
                              step="0.01"
                              {...register('pricing.amount.max', { min: 0 })}
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                              placeholder="0.00"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Currency
                          </label>
                          <select
                            {...register('pricing.currency')}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          >
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                            <option value="GBP">GBP (£)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Unit (Optional)
                          </label>
                          <input
                            {...register('pricing.unit')}
                            placeholder="e.g., per hour, per room"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Location */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Where do you provide service?</h2>
                    <p className="text-gray-600">Set your service location and areas</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Latitude *
                      </label>
                      <input
                        type="number"
                        step="any"
                        {...register('location.coordinates.1', { required: 'Latitude is required' })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="40.7128"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Longitude *
                      </label>
                      <input
                        type="number"
                        step="any"
                        {...register('location.coordinates.0', { required: 'Longitude is required' })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="-74.0060"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center">
                          <MapPin className="w-5 h-5 text-blue-600 mr-2" />
                          <p className="text-sm text-blue-800">
                            <strong>Tip:</strong> Use a GPS coordinate finder or map service to get accurate coordinates for your service location.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Additional Details */}
              {currentStep === 4 && (
                <div className="space-y-8">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Add the finishing touches</h2>
                    <p className="text-gray-600">Features, images, and more details</p>
                  </div>

                  {/* Images */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-4">
                      Service Images
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm text-gray-600 mb-4">
                        Upload up to 10 images of your work
                      </p>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Choose Images
                      </label>
                    </div>

                    {imageFiles.length > 0 && (
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mt-4">
                        {imageFiles.map((file, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-20 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-4">
                      Key Features
                    </label>
                    {featureFields.map((field, index) => (
                      <div key={field.id} className="flex items-center gap-2 mb-2">
                        <input
                          {...register(`features.${index}`)}
                          placeholder="e.g., Eco-friendly products"
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                        {featureFields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeFeature(index)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => appendFeature('')}
                      className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Feature
                    </button>
                  </div>

                  {/* What's Included */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-4">
                      What's Included
                    </label>
                    {includedFields.map((field, index) => (
                      <div key={field.id} className="flex items-center gap-2 mb-2">
                        <input
                          {...register(`whatsIncluded.${index}`)}
                          placeholder="e.g., All cleaning supplies"
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                        {includedFields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeIncluded(index)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => appendIncluded('')}
                      className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Item
                    </button>
                  </div>

                  {/* Requirements */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-4">
                      Requirements
                    </label>
                    {requirementFields.map((field, index) => (
                      <div key={field.id} className="flex items-center gap-2 mb-2">
                        <input
                          {...register(`requirements.${index}`)}
                          placeholder="e.g., Access to water and electricity"
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                        {requirementFields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeRequirement(index)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => appendRequirement('')}
                      className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Requirement
                    </button>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-8 mt-8 border-t border-gray-200">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`
                    px-6 py-3 rounded-lg font-medium transition-all
                    ${currentStep === 1 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }
                  `}
                >
                  Previous
                </button>

                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={submitForm}
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                        Creating...
                      </div>
                    ) : (
                      'Create Service'
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}