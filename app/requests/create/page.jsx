'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../app/context/AuthContext';
import { ChevronLeft, ChevronRight, MapPin, Calendar, DollarSign, Clock, Upload, X, CheckCircle, Star, Shield, Users, Phone } from 'lucide-react';
import { EnvelopeIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import api from '../../../lib/api';
import Cookies from 'js-cookie'
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
export default function CreateRequest() {
  const [currentStep, setCurrentStep] = useState(1);
  const [categories, setCategories] = useState([]);
  const [requiresCustomerRegistration, setRequiresCustomerRegistration] = useState(false);

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
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [dynamicFields, setDynamicFields] = useState([]);

  const { user, login, logins } = useAuth();
  const router = useRouter();

  const totalSteps = 7;

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        if (response.data.success) {
          setCategories(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        setErrors({ submit: 'Failed to load categories. Please try again.' });
      }
    };
    fetchCategories();
  }, []);

  // Fetch dynamic fields when category or subcategory changes
  useEffect(() => {
    const fetchDynamicFields = async () => {
      if (formData.category && categories.length > 0) {
        try {
          const category = categories.find(cat => cat._id === formData.category);
          const subCategory = formData.subCategory;
          const response = await api.get(`/categories/${category.slug}/questions`);
          const fields = [
            ...(response.data.data.category?.customFields || []),
            ...response.data.data.subCategories
              .find(sub => sub.slug === subCategory?.toLowerCase().replace(/ /g, '-'))?.customFields || []
          ].sort((a, b) => a.order - b.order);
          setDynamicFields(fields);
        } catch (error) {
          console.error('Failed to fetch dynamic fields:', error);
        }
      }
    };
    fetchDynamicFields();
  }, [formData.category, formData.subCategory, categories]);

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData.category) newErrors.category = 'Please select a category';
        break;
      case 2:
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
      case 3:
        if (!formData.location.address.trim()) newErrors.address = 'Please enter your address';
        if (!formData.location.city.trim()) newErrors.city = 'Please enter your city';
        if (!formData.location.postcode.trim()) newErrors.postcode = 'Please enter your postcode';
        break;
      case 4:
        if (!formData.timeline.urgency) newErrors.urgency = 'Please select when you need this done';
        break;
      case 5:
        if (formData.budget.min === 0 && formData.budget.max === 0) {
          newErrors.budget = 'Please select a budget range';
        }
        break;
      case 6:
        if (!formData.category) newErrors.category = 'Please select a category';
        if (!formData.title.trim()) newErrors.title = 'Please enter a title';
        if (!formData.description.trim()) newErrors.description = 'Please describe your request';
        if (!formData.location.city.trim()) newErrors.city = 'Please enter your city';
        if (!formData.location.postcode.trim()) newErrors.postcode = 'Please enter your postcode';
        if (!formData.timeline.urgency) newErrors.urgency = 'Please select when you need this done';
        if (formData.budget.min === 0 && formData.budget.max === 0) {
          newErrors.budget = 'Please select a budget range';
        }
        break;
      case 7:
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

  const handleCategorySelect = (categoryId) => {
    setFormData(prev => ({
      ...prev,
      category: categoryId,
      subCategory: ''
    }));
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
    const newFiles = Array.from(files).slice(0, 5 - formData.attachments.length);
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...newFiles]
    }));
  };

  const removeFile = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const needsCustomerRegistration = () => {
    const token = Cookies.get('token')
    if (!token || !user) return true;
    return !['customer', 'both'].includes(user.userType);
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
  async function getCoordinatesFromPostcode(postcode) {
  try {
    const res = await fetch(
`https://nominatim.openstreetmap.org/search?postalcode=${encodeURIComponent(postcode)}&countrycodes=pk&format=json&limit=1`,
      {
        headers: {
          "User-Agent": "ServiceFinder/1.0 (contact@nameretailer.com)" // change to your app/email
        }
      }
    );

    const data = await res.json();

    if (data && data.length > 0) {
      const { lon, lat } = data[0];
      return [parseFloat(lon), parseFloat(lat)]; // GeoJSON expects [lon, lat]
    }

    return null; // no results found
  } catch (err) {
    console.error("Error fetching coordinates for postcode:", err);
    return null;
  }
}

async function getCityAndAddress(lat, lon) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
  );
  const data = await res.json();

  return {
    address: data.display_name, 
    city: data.address.city || data.address.town || data.address.village,
    postcode: data.address.postcode
  };
}
  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    const token = Cookies.get('token')
    const rawCookie = Cookies.get("user"); // replace 'user' with actual cookie name
    const decoded = decodeURIComponent(rawCookie);

    const user = JSON.parse(decoded);

    console.log("User object:", user);

    // Example: get coordinates
let coordinates = user.location.coordinates;
if (
  (!coordinates || (coordinates[0] === 0 && coordinates[1] === 0)) &&
  formData.location?.postcode
) {
  const coords = await getCoordinatesFromPostcode(formData.location.postcode);
  if (coords) {
    coordinates = coords;
  }
}

    
    if (!token || !user || !['customer', 'both'].includes(user?.userType)) {
      console.log('Navigating to step 7: User not authenticated or not a customer')
      setRequiresCustomerRegistration(true)
      setCurrentStep(7)
      return
    }

const [lon, lat] = coordinates;

const geoData = await getCityAndAddress(lat, lon);
    setLoading(true);
    try {
      // Create the request payload
      const requestPayload = {
        category: formData.category,
        subCategory: formData.subCategory || undefined,
        title: formData.title,
        description: formData.description,
        location: {
       address: geoData.address,
    city: geoData.city,
    postcode: geoData.postcode,
          coordinates:coordinates,
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
function appendFormData(formData, data, parentKey = '') {
  if (Array.isArray(data)) {
    data.forEach((value, index) => {
      appendFormData(formData, value, `${parentKey}[${index}]`);
    });
  } else if (typeof data === 'object' && data !== null) {
    Object.entries(data).forEach(([key, value]) => {
      appendFormData(formData, value, parentKey ? `${parentKey}[${key}]` : key);
    });
  } else if (data !== undefined && data !== null) {
    // Dates -> ISO string
    if (data instanceof Date) {
      formData.append(parentKey, data.toISOString());
    } else {
      formData.append(parentKey, data);
    }
  }
}


      // Create FormData for file upload
      const formDataToSend = new FormData();
      
      // Append all fields
  appendFormData(formDataToSend, requestPayload);



      // Append files
      formData.attachments.forEach((file, index) => {
        formDataToSend.append('attachments', file);
      });

      const response = await api.post('/requests', formDataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Request response:', response.data);
     if (response.data.success) {
      const requestId = response.data.data.request._id;
      const leadsCount = response.data.data.leadsCount;
      
      // Store request ID for leads page
      localStorage.setItem('lastRequestId', requestId);
      
      // Show success message with leads count
      if (leadsCount > 0) {
        // Navigate to leads page with request ID
        router.push(`/leads?requestId=${requestId}`);
      } else {
        // Navigate to dashboard if no leads found
        router.push(`/leads?requestId=${requestId}`);
      }
    }
    } catch (error) {
      console.error('Failed to create request:', error);
      setErrors({ submit: error.response?.data?.message || 'Failed to submit request' });
      if (error.response?.data?.requiresCustomerRegistration) {
        console.log('Error response requires customer registration, navigating to step 7');
        setRequiresCustomerRegistration(true);
        setCurrentStep(7);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerRegistration = async () => {
    if (!validateStep(7)) return;

    setLoading(true);
    try {
      const response = await api.post('/auth/register-customer', {
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        postcode: formData.location.postcode,
      });

      console.log('Registration response:', response.data);
      if (response.data.success) {
        await logins({ email: formData.email, password: formData.password });
        // After successful login, retry submitting the request
        await handleSubmit();
      }
    } catch (error) {
      console.error('Failed to register:', error);
      setErrors({ submit: error.response?.data?.message || 'Failed to register as customer' });
    } finally {
      setLoading(false);
    }
  };

  const selectedCategory = categories.find(cat => cat._id === formData.category);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">What service do you need?</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Choose the category that best describes your project and connect with skilled professionals
              </p>
            </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {categories.map((category) => {
    const gradientClasses = getGradientClasses(category);
    const IconComponent = getIconComponent(category.icon);

    return (
      <div
        key={category._id}
        className={`group relative overflow-hidden p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
          formData.category === category._id
            ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg'
            : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
        }`}
        onClick={() => handleCategorySelect(category._id)}
      >
        {/* Background gradient overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-br opacity-5 ${
            formData.category === category._id
              ? 'from-blue-600 to-indigo-600'
              : 'from-gray-600 to-gray-800'
          }`}
        />

        {/* Content */}
        <div className="relative z-10">
          {/* Gradient Icon */}
          <div
            className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${gradientClasses} mb-4 group-hover:scale-110 transition-transform duration-300`}
          >
            <IconComponent className="h-6 w-6 text-white" />
          </div>

     
          <h3
            className={`font-semibold text-lg mb-2 ${
              formData.category === category._id
                ? 'text-blue-900'
                : 'text-gray-900'
            }`}
          >
            {category.name}
          </h3>

          {/* Category Description */}
          <p className="text-sm text-gray-600 leading-relaxed">
            Professional services for {category.name.toLowerCase()}
          </p>

          {/* Check Icon if Selected */}
          {formData.category === category._id && (
            <div className="absolute top-4 right-4">
              <CheckCircle className="w-6 h-6 text-blue-600 fill-current" />
            </div>
          )}
        </div>
      </div>
    );
  })}
</div>

            {errors.category && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm font-medium">{errors.category}</p>
              </div>
            )}
          </div>
        );
      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-4">
                <span className="text-2xl">✍️</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Describe your project</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                The more details you provide, the better quotes you'll receive from professionals
              </p>
            </div>
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <label className="flex items-center text-base font-semibold text-gray-900 mb-3">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  Project title
                </label>
                <input
                  type="text"
                  className={`w-full px-4 py-4 text-lg border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                    errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50 focus:bg-white'
                  }`}
                  placeholder="e.g., Kitchen renovation needed"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
                {errors.title && <p className="text-red-500 text-sm mt-2 font-medium">{errors.title}</p>}
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <label className="flex items-center text-base font-semibold text-gray-900 mb-3">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  Project description
                </label>
                <textarea
                  rows={6}
                  className={`w-full px-4 py-4 text-base border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none ${
                    errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50 focus:bg-white'
                  }`}
                  placeholder="Describe your project in detail. Include any specific requirements, materials, timeline, or other important information..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
                <div className="flex justify-between items-center mt-2">
                  {errors.description && <p className="text-red-500 text-sm font-medium">{errors.description}</p>}
                  <p className={`text-sm ml-auto ${formData.description.length < 20 ? 'text-gray-400' : 'text-green-600'}`}>
                    {formData.description.length} characters
                  </p>
                </div>
              </div>
              {dynamicFields.length > 0 && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-blue-600 text-sm">+</span>
                    </span>
                    Additional Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {dynamicFields.map((field) => (
                      <div key={field.key} className="bg-white rounded-lg p-4 border border-blue-100">
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>
                        {field.type === 'text' && (
                          <input
                            type="text"
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              errors[field.key] ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder={field.placeholder || ''}
                            value={formData.customFields[field.key] || ''}
                            onChange={(e) => handleCustomFieldChange(field.key, e.target.value)}
                          />
                        )}
                        {field.type === 'textarea' && (
                          <textarea
                            rows={3}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
                              errors[field.key] ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder={field.placeholder || ''}
                            value={formData.customFields[field.key] || ''}
                            onChange={(e) => handleCustomFieldChange(field.key, e.target.value)}
                          />
                        )}
                        {field.type === 'number' && (
                          <input
                            type="number"
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              errors[field.key] ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder={field.placeholder || ''}
                            value={formData.customFields[field.key] || ''}
                            onChange={(e) => handleCustomFieldChange(field.key, e.target.value)}
                          />
                        )}
                        {(field.type === 'select' || field.type === 'radio') && (
                          <select
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              errors[field.key] ? 'border-red-300' : 'border-gray-300'
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
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              errors[field.key] ? 'border-red-300' : 'border-gray-300'
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
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              errors[field.key] ? 'border-red-300' : 'border-gray-300'
                            }`}
                            value={formData.customFields[field.key] || ''}
                            onChange={(e) => handleCustomFieldChange(field.key, e.target.value)}
                          />
                        )}
                        {field.type === 'boolean' && (
                          <select
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              errors[field.key] ? 'border-red-300' : 'border-gray-300'
                            }`}
                            value={formData.customFields[field.key] || ''}
                            onChange={(e) => handleCustomFieldChange(field.key, e.target.value === 'true')}
                          >
                            <option value="">Select</option>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                          </select>
                        )}
                        {errors[field.key] && <p className="text-red-500 text-sm mt-1 font-medium">{errors[field.key]}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
              <h4 className="font-bold text-lg mb-3 flex items-center">
                <span className="text-2xl mr-3">💡</span>
                Tips for a great description
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-white rounded-full mr-2"></span>
                    Include specific details about the work needed
                  </div>
                  <div className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-white rounded-full mr-2"></span>
                    Mention any materials or equipment required
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-white rounded-full mr-2"></span>
                    Describe the size/scope of the project
                  </div>
                  <div className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-white rounded-full mr-2"></span>
                    Include any special requirements or preferences
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full mb-4">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Where do you need this service?</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We'll find trusted professionals in your area to help with your project
              </p>
            </div>
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <label className="flex items-center text-base font-semibold text-gray-900 mb-3">
                  <MapPin className="w-5 h-5 text-green-600 mr-2" />
                  Full Address
                  <span className="w-2 h-2 bg-red-500 rounded-full ml-2"></span>
                </label>
                <input
                  type="text"
                  className={`w-full px-4 py-4 text-lg border-2 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all ${
                    errors.address ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50 focus:bg-white'
                  }`}
                  placeholder="123 Main Street"
                  value={formData.location.address}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    location: { ...prev.location, address: e.target.value }
                  }))}
                />
                {errors.address && <p className="text-red-500 text-sm mt-2 font-medium">{errors.address}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <label className="flex items-center text-base font-semibold text-gray-900 mb-3">
                    City
                    <span className="w-2 h-2 bg-red-500 rounded-full ml-2"></span>
                  </label>
                  <input
                    type="text"
                    className={`w-full px-4 py-4 text-lg border-2 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all ${
                      errors.city ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50 focus:bg-white'
                    }`}
                    placeholder="London"
                    value={formData.location.city}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      location: { ...prev.location, city: e.target.value }
                    }))}
                  />
                  {errors.city && <p className="text-red-500 text-sm mt-2 font-medium">{errors.city}</p>}
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <label className="flex items-center text-base font-semibold text-gray-900 mb-3">
                    Postcode
                    <span className="w-2 h-2 bg-red-500 rounded-full ml-2"></span>
                  </label>
                  <input
                    type="text"
                    className={`w-full px-4 py-4 text-lg border-2 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all ${
                      errors.postcode ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50 focus:bg-white'
                    }`}
                    placeholder="SW1A 1AA"
                    value={formData.location.postcode}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      location: { ...prev.location, postcode: e.target.value }
                    }))}
                  />
                  {errors.postcode && <p className="text-red-500 text-sm mt-2 font-medium">{errors.postcode}</p>}
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-6 text-white">
              <div className="flex items-start space-x-4">
                <Shield className="w-8 h-8 text-white flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-lg mb-2">Your privacy is protected</h4>
                  <p className="text-green-100 leading-relaxed">
                    Your exact address won't be shared until you choose a professional to work with. We only show your general area to help professionals understand the location.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-full mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">When do you need this done?</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Let professionals know your timeline to get the most relevant quotes
              </p>
            </div>
            <div className="max-w-3xl mx-auto space-y-4">
              {URGENCY_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`group flex items-center p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    formData.timeline.urgency === option.value
                      ? 'border-orange-500 bg-gradient-to-r from-orange-50 to-red-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-orange-300 hover:shadow-sm'
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
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all ${
                    formData.timeline.urgency === option.value
                      ? `bg-${option.color}-100`
                      : 'bg-gray-100 group-hover:bg-orange-50'
                  }`}>
                    {option.icon}
                  </div>
                  <div className="ml-6 flex-grow">
                    <div className={`font-semibold text-lg ${
                      formData.timeline.urgency === option.value ? 'text-orange-900' : 'text-gray-900'
                    }`}>
                      {option.label}
                    </div>
                    <div className={`text-sm mt-1 ${
                      formData.timeline.urgency === option.value ? 'text-orange-700' : 'text-gray-600'
                    }`}>
                      {option.description}
                    </div>
                  </div>
                  {formData.timeline.urgency === option.value && (
                    <CheckCircle className="w-6 h-6 text-orange-600 flex-shrink-0" />
                  )}
                </label>
              ))}
            </div>
            {formData.timeline.urgency && (
              <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <label className="flex items-center text-base font-semibold text-gray-900 mb-3">
                  <Calendar className="w-5 h-5 text-orange-600 mr-2" />
                  Preferred start date (optional)
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-4 text-lg border-2 border-gray-300 bg-gray-50 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all"
                  value={formData.timeline.preferredDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    timeline: { ...prev.timeline, preferredDate: e.target.value }
                  }))}
                />
              </div>
            )}
            {errors.urgency && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-2xl mx-auto">
                <p className="text-red-600 text-sm font-medium">{errors.urgency}</p>
              </div>
            )}
          </div>
        );
      case 5:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-full mb-4">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">What's your budget?</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                This helps us find professionals in your price range and ensures accurate quotes
              </p>
            </div>
            <div className="max-w-3xl mx-auto space-y-4">
              {BUDGET_RANGES.map((range, index) => (
                <label
                  key={index}
                  className={`group flex items-center p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    formData.budget.min === range.min && formData.budget.max === range.max
                      ? 'border-yellow-500 bg-gradient-to-r from-yellow-50 to-orange-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-yellow-300 hover:shadow-sm'
                  }`}
                >
                  <input
                    type="radio"
                    name="budget"
                    checked={formData.budget.min === range.min && formData.budget.max === range.max}
                    onChange={() => handleBudgetSelect(range)}
                    className="sr-only"
                  />
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all ${
                    formData.budget.min === range.min && formData.budget.max === range.max
                      ? 'bg-yellow-100'
                      : 'bg-gray-100 group-hover:bg-yellow-50'
                  }`}>
                    {range.icon}
                  </div>
                  <div className="ml-6 flex-grow">
                    <span className={`font-semibold text-lg ${
                      formData.budget.min === range.min && formData.budget.max === range.max 
                        ? 'text-yellow-900' 
                        : 'text-gray-900'
                    }`}>
                      {range.label}
                    </span>
                  </div>
                  {formData.budget.min === range.min && formData.budget.max === range.max && (
                    <CheckCircle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
                  )}
                </label>
              ))}
            </div>
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-6 text-white max-w-4xl mx-auto">
              <h4 className="font-bold text-lg mb-4 flex items-center">
                <span className="text-2xl mr-3">💰</span>
                Budget tips for better results
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-white rounded-full mt-2 flex-shrink-0"></span>
                  <span>Your budget helps professionals provide accurate quotes</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-white rounded-full mt-2 flex-shrink-0"></span>
                  <span>You can negotiate with professionals once they contact you</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-white rounded-full mt-2 flex-shrink-0"></span>
                  <span>Consider the full scope of work when setting your budget</span>
                </div>
              </div>
            </div>
            {errors.budget && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-2xl mx-auto">
                <p className="text-red-600 text-sm font-medium">{errors.budget}</p>
              </div>
            )}
          </div>
        );
      case 6:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mb-4">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Add photos or documents</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Help professionals understand your project better with visual references (optional)
              </p>
            </div>
            <div className="max-w-3xl mx-auto">
              <div
                className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                  dragActive 
                    ? 'border-indigo-500 bg-indigo-50 scale-105' 
                    : 'border-gray-300 bg-gray-50 hover:border-indigo-400 hover:bg-indigo-50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="space-y-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg">
                    <Upload className="w-8 h-8 text-indigo-600" />
                  </div>
                  <div className="space-y-3">
                    <p className="text-xl font-semibold text-gray-900">
                      Drop files here or click to upload
                    </p>
                    <p className="text-gray-600">
                      Upload up to 5 files (images, PDFs, documents) • Max 10MB per file
                    </p>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => handleFileUpload(e.target.files)}
                  />
                  <button
                    type="button"
                    className="inline-flex items-center bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    Choose Files
                  </button>
                </div>
              </div>
              {formData.attachments.length > 0 && (
                <div className="mt-8 space-y-4">
                  <h4 className="font-semibold text-lg text-gray-900 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Uploaded files ({formData.attachments.length}/5)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formData.attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <span className="text-indigo-600 font-semibold">📄</span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-gray-900 truncate">{file.name}</p>
                            <p className="text-sm text-gray-500">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="flex-shrink-0 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="mt-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl p-6 text-white">
                <h4 className="font-bold text-lg mb-4 flex items-center">
                  <span className="text-2xl mr-3">📸</span>
                  Photo tips for better quotes
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 bg-white rounded-full mt-2 flex-shrink-0"></span>
                    <span>Include photos of the area where work is needed</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 bg-white rounded-full mt-2 flex-shrink-0"></span>
                    <span>Add reference images of what you want to achieve</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 bg-white rounded-full mt-2 flex-shrink-0"></span>
                    <span>Include any relevant documents or plans</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="max-w-4xl mx-auto bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-2xl p-8 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                  <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
                  Request Summary
                </h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>Ready to connect with professionals</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-xl border border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Service Category</span>
                      <span className="font-bold text-gray-900">{selectedCategory?.name}</span>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Location</span>
                      <span className="font-bold text-gray-900">{formData.location.city}, {formData.location.postcode}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-xl border border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Timeline</span>
                      <span className="font-bold text-gray-900">
                        {URGENCY_OPTIONS.find(opt => opt.value === formData.timeline.urgency)?.label}
                      </span>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Budget Range</span>
                      <span className="font-bold text-gray-900">
                        {BUDGET_RANGES.find(range => 
                          range.min === formData.budget.min && range.max === formData.budget.max
                        )?.label}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {Object.keys(formData.customFields).length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Additional Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(formData.customFields).map(([key, value]) => (
                      <div className="bg-white p-3 rounded-lg border border-gray-100" key={key}>
                        <div className="flex justify-between">
                          <span className="text-gray-600 text-sm">{dynamicFields.find(f => f.key === key)?.label || key}:</span>
                          <span className="font-medium text-gray-900 text-sm">{Array.isArray(value) ? value.join(', ') : value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      case 7:
        return (
          <div className="space-y-8 max-w-md mx-auto">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Complete Your Registration</h2>
              <p className="text-lg text-gray-600">
                Sign up as a customer to view professionals who can help with your request
              </p>
            </div>
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <label className="flex items-center text-base font-semibold text-gray-900 mb-3">
                  <EnvelopeIcon className="w-5 h-5 text-blue-600 mr-2" />
                  Email
                  <span className="w-2 h-2 bg-red-500 rounded-full ml-2"></span>
                </label>
                <input
                  type="email"
                  className={`w-full px-4 py-4 text-lg border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                    errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50 focus:bg-white'
                  }`}
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
                {errors.email && <p className="text-red-500 text-sm mt-2 font-medium">{errors.email}</p>}
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <label className="flex items-center text-base font-semibold text-gray-900 mb-3">
                  <Phone className="w-5 h-5 text-blue-600 mr-2" />
                  Phone Number
                  <span className="w-2 h-2 bg-red-500 rounded-full ml-2"></span>
                </label>
                <input
                  type="tel"
                  className={`w-full px-4 py-4 text-lg border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                    errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50 focus:bg-white'
                  }`}
                  placeholder="+44 123 456 7890"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                />
                {errors.phone && <p className="text-red-500 text-sm mt-2 font-medium">{errors.phone}</p>}
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <label className="flex items-center text-base font-semibold text-gray-900 mb-3">
                  <ShieldCheckIcon className="w-5 h-5 text-blue-600 mr-2" />
                  Password
                  <span className="w-2 h-2 bg-red-500 rounded-full ml-2"></span>
                </label>
                <input
                  type="password"
                  className={`w-full px-4 py-4 text-lg border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                    errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50 focus:bg-white'
                  }`}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                />
                {errors.password && <p className="text-red-500 text-sm mt-2 font-medium">{errors.password}</p>}
              </div>
            </div>
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm font-medium">{errors.submit}</p>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8 md:p-12">
            {renderStep()}

            <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200">
              <button
                onClick={handlePrev}
                disabled={currentStep === 1}
                className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  currentStep === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 bg-gray-100 hover:bg-gray-200 hover:shadow-lg'
                }`}
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Previous
              </button>

              <div className="flex items-center space-x-2">
                {Array.from({ length: totalSteps }, (_, i) => (
                  <div
                    key={i + 1}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      i + 1 <= currentStep
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg'
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              {currentStep < 6 ? (
                <button
                  onClick={handleNext}
                  className="flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Next
                  <ChevronRight className="w-5 h-5 ml-2" />
                </button>
              ) : currentStep === 6 ? (
                <button
                  onClick={needsCustomerRegistration() ? handleNext : handleSubmit}
                  disabled={loading}
                  className="flex items-center bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                      Creating Request...
                    </>
                  ) : needsCustomerRegistration() ? (
                    <>
                      Continue to Registration
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Post Request & View Leads
                    </>
                  )}
                </button>
              ) : currentStep === 7 && requiresCustomerRegistration ? (
                <button
                  onClick={handleCustomerRegistration}
                  disabled={loading}
                  className="flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                      Creating Account & Request...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Register & View Leads
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex items-center bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                      Creating Request...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Post Request & View Leads
                    </>
                  )}
                </button>
              )}
            </div>
            {errors.submit && (
              <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-600 text-sm font-medium flex items-center">
                  <X className="w-4 h-4 mr-2" />
                  {errors.submit}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    
  


          
          )}