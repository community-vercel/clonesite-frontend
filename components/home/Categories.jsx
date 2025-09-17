'use client';
import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, MapPin, Calendar, DollarSign, Clock, Upload, CheckCircle, Star, Shield, Users, Phone } from 'lucide-react';
import { EnvelopeIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../app/context/AuthContext';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import api from '../../lib/api';
import * as LucideIcons from 'lucide-react'; // Import all lucide-react icons

const URGENCY_OPTIONS = [
  { value: 'asap', label: 'As soon as possible', description: 'I need this done urgently', icon: '⚡', color: 'red' },
  { value: 'within_week', label: 'Within a week', description: 'I\'m flexible within the next week', icon: '📅', color: 'orange' },
  { value: 'within_month', label: 'Within a month', description: 'I can wait up to a month', icon: '🗓️', color: 'blue' },
  { value: 'flexible', label: 'I\'m flexible', description: 'I\'m not in a hurry', icon: '⏰', color: 'green' }
];

const BUDGET_RANGES = [
  { min: 0, max: 100, label: 'Under £100', icon: '💷' },
  { min: 100, max: 500, label: '£100 - £500', icon: '💰' },
  { min: 500, max: 1000, label: '£500 - £1,000', icon: '💳' },
  { min: 1000, max: 5000, label: '£1,000 - £5,000', icon: '💎' },
  { min: 5000, max: null, label: '£5,000+', icon: '🏆' }
];

const iconMap = {
  Home: "🏠",
  Heart: "❤️",
  Camera: "📷",
  Briefcase: "💼",
  GraduationCap: "🎓",
  Wrench: "🔧",
  Broom: "🖌️",         // alias to Paintbrush
  SprayCan: "🖌️",      // alias to Paintbrush
  Lightbulb: "💡",
  MonitorSmartphone: "💻", // alias to Monitor
  Monitor: "💻",
  Cog: "⚙️",
  Smartphone: "📱",
  Palette: "🎨",
  Notebook: "📒",
  Hammer: "🔨",
  Dumbbell: "💪",
  Leaf: "🌿",
};

const colorMap = {
  // aliases
  "home-cleaning": "house-cleaning",
  "cleaning": "house-cleaning",
  "photography": "general-photography",
  "photo": "general-photography",
  "personal-trainer": "personal-trainers",
  "trainer": "personal-trainers",
  "landscape": "landscaping",
  "builder": "general-builders",
  "builders": "general-builders",
  "plumber": "plumbing",
  "electrician": "electrical-services",
  "caterer": "catering",
  "event-planner": "event-planning",
  "graphicdesigner": "graphic-design",
  "webdev": "web-development",
  "dev": "web-development",
  "tech-support": "it-support",
  "computer-repair": "mobile-repair",
  "paint": "painting",
  "spraycan": "painting",
  "broom": "house-cleaning",

  // main categories
  "house-cleaning": "from-sky-500 to-sky-600",
  "web-design": "from-indigo-500 to-indigo-600",
  "web-development": "from-blue-600 to-blue-700",
  "digital-marketing": "from-fuchsia-500 to-fuchsia-600",
  "general-photography": "from-pink-500 to-pink-600",
  "personal-trainers": "from-emerald-500 to-emerald-600",
  "gardening": "from-lime-500 to-lime-600",
  "landscaping": "from-emerald-600 to-emerald-700",
  "general-builders": "from-stone-500 to-stone-600",
  "carpentry": "from-amber-500 to-amber-600",
  "handyman": "from-stone-600 to-stone-700",
  "tutoring": "from-purple-500 to-purple-600",
  "plumbing": "from-cyan-500 to-cyan-600",
  "electrical-services": "from-yellow-500 to-yellow-600",
  "catering": "from-orange-500 to-orange-600",
  "graphic-design": "from-teal-500 to-teal-600",
  "event-planning": "from-rose-500 to-rose-600",
  "painting": "from-red-400 to-red-500",
  "mobile-repair": "from-slate-500 to-slate-600",
  "it-support": "from-slate-600 to-slate-700",
  "beauty-salon": "from-pink-600 to-pink-700",

  // newly added
  "life-coaching": "from-violet-500 to-violet-600",
  "bookkeeping-service": "from-blue-500 to-blue-600",
  "social-media-marketing": "from-emerald-500 to-violet-600",
  "office-cleaning": "from-sky-400 to-sky-500",

  // fallback
  default: "from-gray-500 to-gray-600",
};

const normalizeColorKey = (key) => {
  if (!key) return null;
  // Convert to lowercase and replace spaces/underscores with hyphens
  return key
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
};

// Get gradient classes for a category
const getGradientClasses = (category) => {
  // Check if category.color is a custom gradient (e.g., "from-purple-500 to-purple-600")
  if (category.color && category.color.includes('from-') && category.color.includes('to-')) {
    return category.color;
  }
  // Normalize color field or fall back to slug/name
  const colorKey = normalizeColorKey(category.color || category.slug || category.name);
  const gradient = colorMap[colorKey] || colorMap.default;
  if (gradient === colorMap.default && colorKey) {
    console.warn(`No color defined for category "${colorKey}", falling back to default`);
  }
  return gradient;
};
 const getIconComponent = (iconName) => {
  if (!iconName) return LucideIcons.Wrench; // Fallback if iconName is empty

  // lucide-react uses PascalCase directly (e.g., Home, Camera)
  return LucideIcons[iconName] || LucideIcons.Wrench; // Fallback to Wrench
};
// Categories Component with Modal Integration
const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      if (response.data.success) {
        setCategories(response.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCategory(null);
  };


  if (loading) {
    return (
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="w-full h-40 bg-gray-300 rounded-2xl"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Browse by Category
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find the perfect professional for your specific needs
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category, index) => {
 const gradientClasses = getGradientClasses(category);
              const IconComponent = getIconComponent(category.icon);               return (
                <motion.div
                  key={category._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="will-change-transform"
                >
                  <div
                    onClick={() => handleCategoryClick(category)}
                    className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-gray-200"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleCategoryClick(category);
                      }
                    }}
                  >
           <div
                      className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${gradientClasses} mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <span className="text-2xl text-white">
                        <IconComponent className="h-6 w-6" />
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">{category.description}</p>
                    <p className="text-xs font-medium text-purple-600">
                      Click to post request
                    </p>
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="h-6 w-6 bg-purple-100 rounded-full flex items-center justify-center">
                        <ChevronRight className="h-3 w-3 text-purple-600" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <RequestModal
        isOpen={showModal}
        onClose={closeModal}
        category={selectedCategory}
      />
    </>
  );
};

// Request Creation Modal Component
const RequestModal = ({ isOpen, onClose, category }) => {
  const { user, login } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [requiresCustomerRegistration, setRequiresCustomerRegistration] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [dynamicFields, setDynamicFields] = useState([]);

  const [formData, setFormData] = useState({
    category: '',
    subCategory: '',
    title: '',
    description: '',
    location: {
      address: '',
      city: '',
      postcode: '',
      coordinates: [0, 0]
    },
    timeline: {
      urgency: '',
      preferredDate: '',
      flexibility: 'flexible'
    },
    budget: {
      min: 0,
      max: 0,
      type: 'negotiable'
    },
    attachments: [],
    customFields: {},
    email: '',
    phone: '',
    password: ''
  });

  // Set category when modal opens
  useEffect(() => {
    if (category && isOpen) {
      setFormData(prev => ({
        ...prev,
        category: category._id,
        subCategory: ''
      }));
      setCurrentStep(1);
      setErrors({});
      setRequiresCustomerRegistration(false);
      setDynamicFields([]);
    }
  }, [category, isOpen]);

  // Fetch dynamic fields when category changes
  useEffect(() => {
    const fetchDynamicFields = async () => {
      if (formData.category) {
        try {
          const response = await api.get(`/categories/${category.slug}/questions`);
          const fields = [
            ...(response.data.data.category?.customFields || []),
            ...(formData.subCategory
              ? response.data.data.subCategories.find(sub => sub.slug === formData.subCategory.toLowerCase().replace(/ /g, '-'))?.customFields || []
              : [])
          ].sort((a, b) => a.order - b.order);
          setDynamicFields(fields);
        } catch (error) {
          console.error('Failed to fetch dynamic fields:', error);
          setErrors({ submit: 'Failed to load additional questions. Please try again.' });
        }
      }
    };
    fetchDynamicFields();
  }, [formData.category, formData.subCategory, category]);

  const totalSteps = 6;

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData.title.trim()) newErrors.title = 'Please enter a title';
        if (!formData.description.trim()) newErrors.description = 'Please describe your request';
        if (formData.description.length < 20) newErrors.description = 'Please provide more details (at least 20 characters)';
        dynamicFields.forEach(field => {
          if (field.required && !formData.customFields[field.key]) {
            newErrors[field.key] = `${field.label} is required`;
          }
          if (formData.customFields[field.key]) {
            if (field.type === 'number' && isNaN(formData.customFields[field.key])) {
              newErrors[field.key] = `${field.label} must be a number`;
            }
            if (field.validation?.min && formData.customFields[field.key] < field.validation.min) {
              newErrors[field.key] = field.validation.message || `${field.label} must be at least ${field.validation.min}`;
            }
            if (field.validation?.max && formData.customFields[field.key] > field.validation.max) {
              newErrors[field.key] = field.validation.message || `${field.label} must not exceed ${field.validation.max}`;
            }
            if ((field.type === 'select' || field.type === 'radio') && !field.options.includes(formData.customFields[field.key])) {
              newErrors[field.key] = `${field.label} must be one of ${field.options.join(', ')}`;
            }
          }
        });
        break;
      case 2:
        if (!formData.location.address.trim()) newErrors.address = 'Please enter your address';
        if (!formData.location.city.trim()) newErrors.city = 'Please enter your city';
        if (!formData.location.postcode.trim()) newErrors.postcode = 'Please enter your postcode';
        break;
      case 3:
        if (!formData.timeline.urgency) newErrors.urgency = 'Please select when you need this done';
        break;
      case 4:
        if (formData.budget.min === 0 && formData.budget.max === 0) {
          newErrors.budget = 'Please select a budget range';
        }
        break;
      case 5:
        if (formData.attachments.some(file => file.size > 10 * 1024 * 1024)) {
          newErrors.files = 'Some files exceed the 10MB limit';
        }
        break;
      case 6:
        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = 'Please provide a valid email';
        }
        if (!formData.phone || !/^\+?\d{10,15}$/.test(formData.phone)) {
          newErrors.phone = 'Please provide a valid phone number';
        }
        if (!formData.password || formData.password.length < 6) {
          newErrors.password = 'Password must be at least 6 characters long';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleBudgetSelect = (range) => {
    setFormData(prev => ({
      ...prev,
      budget: {
        ...prev.budget,
        min: range.min,
        max: range.max
      }
    }));
  };

  const handleCustomFieldChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      customFields: { ...prev.customFields, [key]: value }
    }));
  };

  const handleFileUpload = (files) => {
    const validFiles = Array.from(files)
      .filter(file => file.size <= 10 * 1024 * 1024) // 10MB limit
      .slice(0, 5 - formData.attachments.length);
    if (validFiles.length < files.length) {
      setErrors(prev => ({ ...prev, files: 'Some files were not uploaded as they exceed the 10MB limit.' }));
    }
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...validFiles]
    }));
  };

  const removeFile = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const needsCustomerRegistration = () => {
    const token = Cookies.get('token');
    const rawCookie = Cookies.get('user');
    if (!token || !rawCookie) return true;
    try {
      const user = JSON.parse(decodeURIComponent(rawCookie));
      return !user || !['customer', 'both'].includes(user.userType);
    } catch (error) {
      console.error('Failed to parse user cookie:', error);
      return true;
    }
  };
async function getCoordinatesFromPostcode(postcode, countryCode = 'pk') {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?postalcode=${encodeURIComponent(postcode)}&countrycodes=${countryCode}&format=json&limit=1`,
      {
        headers: {
          'User-Agent': 'YourAppName/1.0 (your-contact-email@example.com)'
        }
      }
    );
    const data = await res.json();
    if (data && data.length > 0) {
      const { lon, lat } = data[0];
      return [parseFloat(lon), parseFloat(lat)];
    }
    return null;
  } catch (err) {
    console.error('Error fetching coordinates for postcode:', err);
    setErrors(prev => ({
      ...prev,
      submit: 'Unable to fetch coordinates for the provided postcode.'
    }));
    return null;
  }
}


  async function getCityAndAddress(lat, lon) {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      );
      const data = await res.json();
      console.log("data")
      return {
        address: data.display_name,
        city: data.address.state || data.address.city || data.address.town || data.address.village,
        postcode: data.address.postcode
      };
    } catch (err) {
      console.error('Error fetching address:', err);
      setErrors(prev => ({ ...prev, submit: 'Unable to fetch address details.' }));
      return null;
    }
  }

  const appendFormData = (formData, data, parentKey = '') => {
    if (Array.isArray(data)) {
      data.forEach((value, index) => {
        appendFormData(formData, value, `${parentKey}[${index}]`);
      });
    } else if (typeof data === 'object' && data !== null) {
      Object.entries(data).forEach(([key, value]) => {
        appendFormData(formData, value, parentKey ? `${parentKey}[${key}]` : key);
      });
    } else if (data !== undefined && data !== null) {
      if (data instanceof Date) {
        formData.append(parentKey, data.toISOString());
      } else {
        formData.append(parentKey, data);
      }
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    if (needsCustomerRegistration()) {
      setRequiresCustomerRegistration(true);
      setCurrentStep(6);
      return;
    }

    setLoading(true);
    try {
      let coordinates = formData.location.coordinates;
      if (!coordinates || (coordinates[0] === 0 && coordinates[1] === 0)) {
        const coords = await getCoordinatesFromPostcode(formData.location.postcode);
        if (coords) {
          coordinates = coords;
        } else {
          throw new Error('Unable to fetch coordinates');
        }
      }

      const [lon, lat] = coordinates;
      const geoData = await getCityAndAddress(lat, lon);
      if (!geoData) {
        throw new Error('Unable to fetch address details');
      }

      const requestPayload = {
        category: formData.category,
        subCategory: formData.subCategory || undefined,
        title: formData.title,
        description: formData.description,
        location: {
          address: geoData.address,
          city: geoData.city,
          postcode: geoData.postcode,
          coordinates
        },
        timeline: {
          urgency: formData.timeline.urgency,
          preferredDate: formData.timeline.preferredDate || undefined,
          flexibility: formData.timeline.flexibility
        },
        budget: {
          min: formData.budget.min,
          max: formData.budget.max,
          type: formData.budget.type
        },
        customFields: formData.customFields
      };

      const formDataToSend = new FormData();
      appendFormData(formDataToSend, requestPayload);
      formData.attachments.forEach((file, index) => {
        formDataToSend.append('attachments', file);
      });

      const token = Cookies.get('token');
      const response = await api.post('/requests', formDataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        const requestId = response.data.data.request._id;
        const leadsCount = response.data.data.leadsCount;
        localStorage.setItem('lastRequestId', requestId);
        router.push(leadsCount > 0 ? `/leads?requestId=${requestId}` : `/dashboard?requestId=${requestId}&noLeads=true`);
        onClose();
      }
    } catch (error) {
      console.error('Failed to create request:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.requiresCustomerRegistration
          ? 'Please register as a customer to submit your request.'
          : 'Failed to submit request. Please try again.';
      setErrors({ submit: errorMessage });
      if (error.response?.data?.requiresCustomerRegistration) {
        setRequiresCustomerRegistration(true);
        setCurrentStep(6);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerRegistration = async () => {
    if (!validateStep(6)) return;

    setLoading(true);
    try {
      const response = await api.post('/auth/register-customer', {
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        postcode: formData.location.postcode
      });

      if (response.data.success) {
        await login({ email: formData.email, password: formData.password });
        await handleSubmit();
      }
    } catch (error) {
      console.error('Failed to register:', error);
      setErrors({ submit: error.response?.data?.message || 'Failed to register. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-gray-900">Describe your {category?.name} project</h3>
              <p className="text-gray-600">The more details you provide, the better quotes you'll receive</p>
            </div>
            <div className="space-y-4">
              {category?.subCategories?.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Subcategory
                  </label>
                  <select
                    className="w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    value={formData.subCategory}
                    onChange={(e) => setFormData(prev => ({ ...prev, subCategory: e.target.value }))}
                  >
                    <option value="">Select a subcategory</option>
                    {category.subCategories.map(sub => (
                      <option key={sub.slug} value={sub.name}>{sub.name}</option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Project title *
                </label>
                <input
                  type="text"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                    errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder={`e.g., ${category?.name} needed`}
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Project description *
                </label>
                <textarea
                  rows={4}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none ${
                    errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Describe your project in detail..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                  <p className={`text-sm ml-auto ${formData.description.length < 20 ? 'text-gray-400' : 'text-green-600'}`}>
                    {formData.description.length} characters
                  </p>
                </div>
              </div>
              {dynamicFields.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900">Additional Details</h4>
                  {dynamicFields.map(field => (
                    <div key={field.key}>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        {field.label} {field.required && <span className="text-red-500">*</span>}
                      </label>
                      {field.type === 'text' && (
                        <input
                          type="text"
                          className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors[field.key] ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                          placeholder={field.placeholder || ''}
                          value={formData.customFields[field.key] || ''}
                          onChange={(e) => handleCustomFieldChange(field.key, e.target.value)}
                        />
                      )}
                      {field.type === 'textarea' && (
                        <textarea
                          rows={3}
                          className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
                            errors[field.key] ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                          placeholder={field.placeholder || ''}
                          value={formData.customFields[field.key] || ''}
                          onChange={(e) => handleCustomFieldChange(field.key, e.target.value)}
                        />
                      )}
                      {field.type === 'number' && (
                        <input
                          type="number"
                          className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors[field.key] ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                          placeholder={field.placeholder || ''}
                          value={formData.customFields[field.key] || ''}
                          onChange={(e) => handleCustomFieldChange(field.key, e.target.value)}
                        />
                      )}
                      {(field.type === 'select' || field.type === 'radio') && (
                        <select
                          className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors[field.key] ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                          value={formData.customFields[field.key] || ''}
                          onChange={(e) => handleCustomFieldChange(field.key, e.target.value)}
                        >
                          <option value="">Select {field.label.toLowerCase()}</option>
                          {field.options.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      )}
                      {field.type === 'multiselect' && (
                        <select
                          multiple
                          className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors[field.key] ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                          value={formData.customFields[field.key] || []}
                          onChange={(e) => handleCustomFieldChange(field.key, Array.from(e.target.selectedOptions, option => option.value))}
                        >
                          {field.options.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      )}
                      {field.type === 'date' && (
                        <input
                          type="date"
                          className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors[field.key] ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                          value={formData.customFields[field.key] || ''}
                          onChange={(e) => handleCustomFieldChange(field.key, e.target.value)}
                        />
                      )}
                      {field.type === 'boolean' && (
                        <select
                          className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors[field.key] ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                          value={formData.customFields[field.key] || ''}
                          onChange={(e) => handleCustomFieldChange(field.key, e.target.value === 'true')}
                        >
                          <option value="">Select</option>
                          <option value="true">Yes</option>
                          <option value="false">No</option>
                        </select>
                      )}
                      {errors[field.key] && <p className="text-red-500 text-sm mt-1">{errors[field.key]}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-800">
              <h4 className="font-medium mb-2">Tips for a great description</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Include specific details about the work needed</li>
                <li>Mention any materials or equipment required</li>
                <li>Describe the size/scope of the project</li>
                <li>Include any special requirements or preferences</li>
              </ul>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-gray-900">Where do you need this service?</h3>
              <p className="text-gray-600">We'll find trusted professionals in your area</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Full Address *
                </label>
                <input
                  type="text"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
                    errors.address ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="123 Main Street"
                  value={formData.location.address}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    location: { ...prev.location, address: e.target.value }
                  }))}
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
                      errors.city ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="London"
                    value={formData.location.city}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      location: { ...prev.location, city: e.target.value }
                    }))}
                  />
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Postcode *
                  </label>
                  <input
                    type="text"
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
                      errors.postcode ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="SW1A 1AA"
                    value={formData.location.postcode}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      location: { ...prev.location, postcode: e.target.value }
                    }))}
                  />
                  {errors.postcode && <p className="text-red-500 text-sm mt-1">{errors.postcode}</p>}
                </div>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-sm text-green-800">
              <h4 className="font-medium mb-2">Your privacy is protected</h4>
              <p>Your exact address won't be shared until you choose a professional to work with.</p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-gray-900">When do you need this done?</h3>
              <p className="text-gray-600">Let professionals know your timeline</p>
            </div>
            <div className="space-y-3">
              {URGENCY_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    formData.timeline.urgency === option.value
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-orange-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="urgency"
                    value={option.value}
                    checked={formData.timeline.urgency === option.value}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      timeline: { ...prev.timeline, urgency: e.target.value }
                    }))}
                    className="sr-only"
                  />
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-lg mr-4">
                    {option.icon}
                  </div>
                  <div className="flex-grow">
                    <div className="font-medium text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-600">{option.description}</div>
                  </div>
                  {formData.timeline.urgency === option.value && (
                    <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />
                  )}
                </label>
              ))}
            </div>
            {formData.timeline.urgency && (
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Preferred start date (optional)
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  value={formData.timeline.preferredDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    timeline: { ...prev.timeline, preferredDate: e.target.value }
                  }))}
                />
              </div>
            )}
            {errors.urgency && <p className="text-red-500 text-sm">{errors.urgency}</p>}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-gray-900">What's your budget?</h3>
              <p className="text-gray-600">This helps us find professionals in your price range</p>
            </div>
            <div className="space-y-3">
              {BUDGET_RANGES.map((range, index) => (
                <label
                  key={index}
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    formData.budget.min === range.min && formData.budget.max === range.max
                      ? 'border-yellow-500 bg-yellow-50'
                      : 'border-gray-200 hover:border-yellow-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="budget"
                    checked={formData.budget.min === range.min && formData.budget.max === range.max}
                    onChange={() => handleBudgetSelect(range)}
                    className="sr-only"
                  />
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-lg mr-4">
                    {range.icon}
                  </div>
                  <div className="flex-grow">
                    <span className="font-medium text-gray-900">{range.label}</span>
                  </div>
                  {formData.budget.min === range.min && formData.budget.max === range.max && (
                    <CheckCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                  )}
                </label>
              ))}
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 text-sm text-yellow-800">
              <h4 className="font-medium mb-2">Budget tips</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Your budget helps professionals provide accurate quotes</li>
                <li>You can negotiate with professionals once they contact you</li>
                <li>Consider the full scope of work when setting your budget</li>
              </ul>
            </div>
            {errors.budget && <p className="text-red-500 text-sm">{errors.budget}</p>}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-gray-900">Add photos or documents</h3>
              <p className="text-gray-600">Help professionals understand your project better (optional)</p>
            </div>
            <div
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  document.getElementById('fileInput').click();
                }
              }}
              tabIndex={0}
              role="button"
              aria-label="Upload files"
            >
              <div className="space-y-4">
                <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                <div>
                  <p className="text-lg font-medium text-gray-900">Drop files here or click to upload</p>
                  <p className="text-sm text-gray-600">Upload up to 5 files • Max 10MB per file</p>
                </div>
                <input
                  id="fileInput"
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => handleFileUpload(e.target.files)}
                />
              </div>
            </div>
            {formData.attachments.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Uploaded files ({formData.attachments.length}/5)</h4>
                <div className="space-y-2">
                  {formData.attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-indigo-100 rounded flex items-center justify-center">
                          <span className="text-indigo-600 text-sm">📄</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm truncate">{file.name}</p>
                          <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700"
                        aria-label={`Remove ${file.name}`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {errors.files && <p className="text-red-500 text-sm">{errors.files}</p>}
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-gray-900">Complete your registration</h3>
              <p className="text-gray-600">Sign up to view professionals who can help with your request</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Email *
                </label>
                <div className="relative">
                  <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                      errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                      errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="+44 123 456 7890"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <ShieldCheckIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                      errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Create a password (min. 6 characters)"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  />
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">
                  {category && iconMap[category.icon] ? iconMap[category.icon] : '🔧'}
                </span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {category?.name || 'Service Request'}
                </h2>
                <p className="text-sm text-gray-500">Step {currentStep} of {totalSteps}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="px-6 py-4 bg-gray-50">
            <div className="flex items-center space-x-2">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i + 1}
                  className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                    i + 1 <= currentStep
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {renderStep()}
          </div>

          <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={handlePrev}
              disabled={currentStep === 1}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
                currentStep === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
              aria-label="Previous step"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </button>

            {currentStep < 5 ? (
              <button
                onClick={handleNext}
                className="flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all"
                aria-label="Next step"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            ) : currentStep === 5 ? (
              <button
                onClick={needsCustomerRegistration() ? handleNext : handleSubmit}
                disabled={loading}
                className="flex items-center bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50"
                aria-label={needsCustomerRegistration() ? 'Continue to registration' : 'Submit request'}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Creating...
                  </>
                ) : needsCustomerRegistration() ? (
                  <>
                    Continue
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Get Quotes
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={requiresCustomerRegistration ? handleCustomerRegistration : handleSubmit}
                disabled={loading}
                className="flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50"
                aria-label={requiresCustomerRegistration ? 'Register and get quotes' : 'Get quotes'}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    {requiresCustomerRegistration ? 'Registering...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {requiresCustomerRegistration ? 'Register & Get Quotes' : 'Get Quotes'}
                  </>
                )}
              </button>
            )}
          </div>

          {errors.submit && (
            <div className="mx-6 mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm font-medium flex items-center">
                <X className="w-4 h-4 mr-2" />
                {errors.submit}
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Categories;