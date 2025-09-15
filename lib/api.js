// import axios from 'axios';
// import Cookies from 'js-cookie';
// import { toast } from 'react-hot-toast';

// // Create axios instance
// const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
//   timeout: 30000,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Request interceptor to add auth token
// api.interceptors.request.use(
//   (config) => {
//     const token = Cookies.get('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor for error handling
// api.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async (error) => {
//     const originalRequest = error.config;

//     // Handle 401 errors (unauthorized)
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
      
//       // Clear token and redirect to login
//       Cookies.remove('token');
//       Cookies.remove('user');
      
//       if (typeof window !== 'undefined') {
//         window.location.href = '/login';
//       }
      
//       return Promise.reject(error);
//     }

//     // Handle other errors
//     if (error.response?.data?.message) {
//       toast.error(error.response.data.message);
//     } else if (error.message) {
//       toast.error(error.message);
//     } else {
//       toast.error('An unexpected error occurred');
//     }

//     return Promise.reject(error);
//   }
// );

// // Auth API calls
// export const authAPI = {
//   register: (data) => api.post('/auth/register', data),
//   login: (data) => api.post('/auth/login', data),
//   logout: () => api.post('/auth/logout'),
//   getProfile: () => api.get('/auth/me'),
//   forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
//   resetPassword: (token, password) => api.put(`/auth/reset-password/${token}`, { password }),
//   updatePassword: (data) => api.put('/auth/update-password', data),
//   verifyEmail: (token) => api.get(`/auth/verify-email/${token}`),
//   resendVerification: () => api.post('/auth/resend-verification'),
//   refreshToken: () => api.post('/auth/refresh-token'),
// };

// // Users API calls
// export const usersAPI = {
//   getUsers: (params) => api.get('/users', { params }),
//   getUser: (id) => api.get(`/users/${id}`),
//   updateProfile: (data) => api.put('/users/profile', data),
//   uploadAvatar: (file) => {
//     const formData = new FormData();
//     formData.append('avatar', file);
//     return api.post('/users/avatar', formData, {
//       headers: { 'Content-Type': 'multipart/form-data' }
//     });
//   },
//   updateLocation: (data) => api.put('/users/location', data),
//   addPortfolio: (data) => {
//     const formData = new FormData();
//     Object.keys(data).forEach(key => {
//       if (key === 'images' && data[key]) {
//         data[key].forEach((file, index) => {
//           formData.append('images', file);
//         });
//       } else {
//         formData.append(key, data[key]);
//       }
//     });
//     return api.post('/users/portfolio', formData, {
//       headers: { 'Content-Type': 'multipart/form-data' }
//     });
//   },
//   updatePortfolio: (portfolioId, data) => api.put(`/users/portfolio/${portfolioId}`, data),
//   deletePortfolio: (portfolioId) => api.delete(`/users/portfolio/${portfolioId}`),
//   addCertification: (data) => {
//     const formData = new FormData();
//     Object.keys(data).forEach(key => {
//       if (key === 'image' && data[key]) {
//         formData.append('image', data[key]);
//       } else {
//         formData.append(key, data[key]);
//       }
//     });
//     return api.post('/users/certifications', formData, {
//       headers: { 'Content-Type': 'multipart/form-data' }
//     });
//   },
//   updateAvailability: (data) => api.put('/users/availability', data),
//   updatePreferences: (data) => api.put('/users/preferences', data),
//   getDashboard: () => api.get('/users/dashboard'),
//   getNearby: (params) => api.get('/users/nearby', { params }),
//   deactivateAccount: (data) => api.delete('/users/account', { data }),
// };

// // Services API calls
// export const servicesAPI = {
//   getServices: (params) => api.get('/services', { params }),
//   getService: (id) => api.get(`/services/${id}`),
//   createService: (data) => {
//     const formData = new FormData();
//     Object.keys(data).forEach(key => {
//       if (key === 'images' && data[key]) {
//         data[key].forEach((file) => {
//           formData.append('images', file);
//         });
//       } else if (typeof data[key] === 'object') {
//         formData.append(key, JSON.stringify(data[key]));
//       } else {
//         formData.append(key, data[key]);
//       }
//     });
//     return api.post('/services', formData, {
//       headers: { 'Content-Type': 'multipart/form-data' }
//     });
//   },
//   updateService: (id, data) => {
//     const formData = new FormData();
//     Object.keys(data).forEach(key => {
//       if (key === 'newImages' && data[key]) {
//         data[key].forEach((file) => {
//           formData.append('newImages', file);
//         });
//       } else if (typeof data[key] === 'object') {
//         formData.append(key, JSON.stringify(data[key]));
//       } else {
//         formData.append(key, data[key]);
//       }
//     });
//     return api.put(`/services/${id}`, formData, {
//       headers: { 'Content-Type': 'multipart/form-data' }
//     });
//   },
//   deleteService: (id) => api.delete(`/services/${id}`),
//   togglePause: (id) => api.patch(`/services/${id}/toggle-pause`),
//   getMyServices: (params) => api.get('/services/my-services', { params }),
//   getProviderServices: (providerId, params) => api.get(`/services/provider/${providerId}`, { params }),
//   getFeatured: (params) => api.get('/services/featured', { params }),
//   searchServices: (params) => api.get('/services/search', { params }),
//   addFAQ: (id, data) => api.post(`/services/${id}/faqs`, data),
//   updateFAQ: (id, faqId, data) => api.put(`/services/${id}/faqs/${faqId}`, data),
//   deleteFAQ: (id, faqId) => api.delete(`/services/${id}/faqs/${faqId}`),
//   removeImage: (id, imageId) => api.delete(`/services/${id}/images/${imageId}`),
//   setPrimaryImage: (id, imageId) => api.patch(`/services/${id}/images/${imageId}/primary`),
// };

// // Categories API calls
// export const categoriesAPI = {
//   getCategories: (params) => api.get('/categories', { params }),
//   getCategory: (id) => api.get(`/categories/${id}`),
//   getCategoryTree: () => api.get('/categories/tree'),
//   createCategory: (data) => api.post('/categories', data),
//   updateCategory: (id, data) => api.put(`/categories/${id}`, data),
//   deleteCategory: (id) => api.delete(`/categories/${id}`),
// };

// // Requests API calls
// export const requestsAPI = {
//   getRequests: (params) => api.get('/requests', { params }),
//   getRequest: (id) => api.get(`/requests/${id}`),
//   createRequest: (data) => {
//     const formData = new FormData();
//     Object.keys(data).forEach(key => {
//       if (key === 'attachments' && data[key]) {
//         data[key].forEach((file) => {
//           formData.append('attachments', file);
//         });
//       } else if (typeof data[key] === 'object') {
//         formData.append(key, JSON.stringify(data[key]));
//       } else {
//         formData.append(key, data[key]);
//       }
//     });
//     return api.post('/requests', formData, {
//       headers: { 'Content-Type': 'multipart/form-data' }
//     });
//   },
//   updateRequest: (id, data) => api.put(`/requests/${id}`, data),
//   cancelRequest: (id) => api.patch(`/requests/${id}/cancel`),
//   submitQuote: (id, data) => api.post(`/requests/${id}/quotes`, data),
//   updateQuote: (id, quoteId, data) => api.put(`/requests/${id}/quotes/${quoteId}`, data),
//   withdrawQuote: (id, quoteId) => api.delete(`/requests/${id}/quotes/${quoteId}`),
//   acceptQuote: (id, quoteId) => api.post(`/requests/${id}/quotes/${quoteId}/accept`),
//   getMyRequests: (params) => api.get('/requests/my-requests', { params }),
//   getMyQuotes: (params) => api.get('/requests/my-quotes', { params }),
//   startProject: (id) => api.post(`/requests/${id}/start`),
//   completeProject: (id) => api.post(`/requests/${id}/complete`),
// };

// // Reviews API calls
// export const reviewsAPI = {
//   getReviews: (params) => api.get('/reviews', { params }),
//   getReview: (id) => api.get(`/reviews/${id}`),
//   createReview: (data) => {
//     const formData = new FormData();
//     Object.keys(data).forEach(key => {
//       if (key === 'images' && data[key]) {
//         data[key].forEach((file) => {
//           formData.append('images', file);
//         });
//       } else if (typeof data[key] === 'object') {
//         formData.append(key, JSON.stringify(data[key]));
//       } else {
//         formData.append(key, data[key]);
//       }
//     });
//     return api.post('/reviews', formData, {
//       headers: { 'Content-Type': 'multipart/form-data' }
//     });
//   },
//   updateReview: (id, data) => api.put(`/reviews/${id}`, data),
//   deleteReview: (id) => api.delete(`/reviews/${id}`),
//   markHelpful: (id) => api.post(`/reviews/${id}/helpful`),
//   unmarkHelpful: (id) => api.delete(`/reviews/${id}/helpful`),
//   respondToReview: (id, data) => api.post(`/reviews/${id}/respond`, data),
// };

// // Notifications API calls
// export const notificationsAPI = {
//   getNotifications: (params) => api.get('/notifications', { params }),
//   markAsRead: (id) => api.put(`/notifications/${id}/read`),
//   markAllAsRead: () => api.put('/notifications/mark-all-read'),
//   deleteNotification: (id) => api.delete(`/notifications/${id}`),
//   getUnreadCount: () => api.get('/notifications/unread-count'),
// };

// // Payments API calls
// export const paymentsAPI = {
//   createPaymentIntent: (data) => api.post('/payments/create-intent', data),
//   confirmPayment: (data) => api.post('/payments/confirm', data),
//   getPaymentHistory: (params) => api.get('/payments/history', { params }),
//   refundPayment: (id, data) => api.post(`/payments/${id}/refund`, data),
// };

// export default api
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';

// Create axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

import { 
  HomeIcon,
  ComputerDesktopIcon,
  WrenchScrewdriverIcon,
  AcademicCapIcon,
  TruckIcon,
  BeakerIcon,
  CameraIcon,
  HeartIcon,
  BriefcaseIcon,
  PaintBrushIcon,
  MusicalNoteIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
// Dummy data for fallback when API is not available
const DUMMY_DATA = {
   categories : [
    {
      name: 'Home & Garden',
      icon: HomeIcon,
      count: '12,500+ services',
      color: 'from-green-400 to-green-600',
      description: 'Cleaning, repairs, landscaping'
    },
    {
      name: 'Technology',
      icon: ComputerDesktopIcon,
      count: '8,200+ services',
      color: 'from-blue-400 to-blue-600',
      description: 'Web dev, IT support, apps'
    },
    {
      name: 'Handyman',
      icon: WrenchScrewdriverIcon,
      count: '15,300+ services',
      color: 'from-orange-400 to-orange-600',
      description: 'Repairs, assembly, maintenance'
    },
    {
      name: 'Education',
      icon: AcademicCapIcon,
      count: '6,800+ services',
      color: 'from-purple-400 to-purple-600',
      description: 'Tutoring, courses, training'
    },
    {
      name: 'Moving & Delivery',
      icon: TruckIcon,
      count: '4,500+ services',
      color: 'from-red-400 to-red-600',
      description: 'Moving, shipping, logistics'
    },
    {
      name: 'Health & Wellness',
      icon: HeartIcon,
      count: '3,200+ services',
      color: 'from-pink-400 to-pink-600',
      description: 'Fitness, nutrition, therapy'
    },
    {
      name: 'Creative Services',
      icon: PaintBrushIcon,
      count: '7,900+ services',
      color: 'from-indigo-400 to-indigo-600',
      description: 'Design, writing, photography'
    },
    {
      name: 'Business',
      icon: BriefcaseIcon,
      count: '9,600+ services',
      color: 'from-gray-400 to-gray-600',
      description: 'Consulting, marketing, admin'
    },
    {
      name: 'Events',
      icon: UserGroupIcon,
      count: '2,100+ services',
      color: 'from-yellow-400 to-yellow-600',
      description: 'Planning, catering, entertainment'
    },
    {
      name: 'Beauty & Style',
      icon: BeakerIcon,
      count: '1,800+ services',
      color: 'from-teal-400 to-teal-600',
      description: 'Hair, makeup, styling'
    },
    {
      name: 'Photography',
      icon: CameraIcon,
      count: '3,400+ services',
      color: 'from-cyan-400 to-cyan-600',
      description: 'Events, portraits, commercial'
    },
    {
      name: 'Music & Audio',
      icon: MusicalNoteIcon,
      count: '1,500+ services',
      color: 'from-emerald-400 to-emerald-600',
      description: 'Lessons, production, DJ'
    },
  ],

  services: [
    {
      _id: '1',
      title: 'Professional House Cleaning',
      description: 'Deep cleaning services for your home with eco-friendly products',
      price: { min: 25, max: 50, unit: 'hour' },
      provider: { 
        _id: 'p1',
        name: 'CleanPro Services', 
        rating: 4.9, 
        reviewCount: 127,
        avatar: '/api/placeholder/40/40',
        verified: true
      },
      location: { city: 'London', postcode: 'SW1A 1AA' },
      images: ['/api/placeholder/400/300'],
      verified: true,
      category: { _id: '1', name: 'Home & Garden' },
      tags: ['cleaning', 'residential', 'eco-friendly'],
      availability: 'immediate',
      createdAt: new Date().toISOString()
    },
    {
      _id: '2',
      title: 'Personal Fitness Training',
      description: 'One-on-one fitness coaching tailored to your goals',
      price: { min: 40, max: 80, unit: 'session' },
      provider: { 
        _id: 'p2',
        name: 'FitLife Trainers', 
        rating: 4.8, 
        reviewCount: 89,
        avatar: '/api/placeholder/40/40',
        verified: true
      },
      location: { city: 'Manchester', postcode: 'M1 1AA' },
      images: ['/api/placeholder/400/300'],
      verified: true,
      category: { _id: '2', name: 'Health & Wellbeing' },
      tags: ['fitness', 'personal-training', 'health'],
      availability: 'within-week',
      createdAt: new Date().toISOString()
    },
    {
      _id: '3',
      title: 'Web Design & Development',
      description: 'Custom website design and development for your business',
      price: { min: 500, max: 2000, unit: 'project' },
      provider: { 
        _id: 'p3',
        name: 'Digital Craft Studio', 
        rating: 5.0, 
        reviewCount: 45,
        avatar: '/api/placeholder/40/40',
        verified: true
      },
      location: { city: 'Birmingham', postcode: 'B1 1AA' },
      images: ['/api/placeholder/400/300'],
      verified: true,
      category: { _id: '4', name: 'Business Services' },
      tags: ['web-design', 'development', 'responsive'],
      availability: 'within-month',
      createdAt: new Date().toISOString()
    }
  ],
  user: {
    _id: 'user1',
    name: 'John Doe',
    email: 'john@example.com',
    userType: 'customer',
    avatar: '/api/placeholder/100/100',
    location: { city: 'London', postcode: 'SW1A 1AA' },
    verified: true
  }
};

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshTokenValue = Cookies.get('refreshToken');
        if (refreshTokenValue) {
          const response = await api.post('/auth/refresh-token', { refreshToken: refreshTokenValue });
          const { token } = response.data.data || response.data;
          Cookies.set('token', token, { expires: 7 });
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest); // Retry the original request
        }
      } catch (refreshError) {
        console.warn('Refresh token failed:', refreshError.message);
        Cookies.remove('token');
        Cookies.remove('user');
        Cookies.remove('refreshToken');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }

    if (error.response?.data?.message && !error.config._isDummy) {
      toast.error(error.response.data.message);
    }

    return Promise.reject(error);
  }
);

// Helper function to handle API calls with fallback to dummy data
const apiWithFallback = async (apiCall, dummyData) => {
  try {
    const response = await apiCall();
    return response.data;
  } catch (error) {
    console.warn('API call failed, using dummy data:', error.message);
    return { success: true, data: dummyData };
  }
};

// Auth API calls
export const authAPI = {
  register: (data) => apiWithFallback(
    () => api.post('/auth/register', data),
    { success: true, message: 'Registration successful', data: DUMMY_DATA.user }
  ),
  
  login: async (data) => {
    try {
      const response = await api.post('/auth/login', data);
      if (response.data.token) {
        Cookies.set('token', response.data.token, { expires: 7 });
        Cookies.set('user', JSON.stringify(response.data.data), { expires: 7 });
      }
      return response.data;
    } catch (error) {
      console.warn('Login API failed, using dummy auth');
      const token = 'dummy-token-' + Date.now();
      Cookies.set('token', token, { expires: 7 });
      Cookies.set('user', JSON.stringify(DUMMY_DATA.user), { expires: 7 });
      return { success: true, data: DUMMY_DATA.user, token };
    }
  },
  
  logout: () => apiWithFallback(
    () => api.post('/auth/logout'),
    { success: true }
  ),
  
  getProfile: () => apiWithFallback(
    () => api.get('/auth/me'),
    DUMMY_DATA.user
  )
};

// Services API calls
export const servicesAPI = {
  getServices: (params) => apiWithFallback(
    () => api.get('/services', { params }),
    {
      items: DUMMY_DATA.services,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: DUMMY_DATA.services.length,
        itemsPerPage: 10
      }
    }
  ),
  
  getService: (id) => apiWithFallback(
    () => api.get(`/services/${id}`),
    DUMMY_DATA.services.find(s => s._id === id) || DUMMY_DATA.services[0]
  ),
  
  getFeatured: (params) => apiWithFallback(
    () => api.get('/services/featured', { params }),
    DUMMY_DATA.services
  ),
  
  searchServices: (params) => apiWithFallback(
    () => api.get('/services/search', { params }),
    DUMMY_DATA.services.filter(service => 
      params.q ? service.title.toLowerCase().includes(params.q.toLowerCase()) : true
    )
  ),
  
  createService: (data) => apiWithFallback(
    () => {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if (key === 'images' && data[key]) {
          data[key].forEach((file) => {
            formData.append('images', file);
          });
        } else if (typeof data[key] === 'object') {
          formData.append(key, JSON.stringify(data[key]));
        } else {
          formData.append(key, data[key]);
        }
      });
      return api.post('/services', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    },
    { ...data, _id: Date.now().toString(), createdAt: new Date().toISOString() }
  )
};

// Categories API calls
export const categoriesAPI = {
  getCategories: (params) => apiWithFallback(
    () => api.get('/categories', { params }),
    DUMMY_DATA.categories
  ),
  
  getCategory: (id) => apiWithFallback(
    () => api.get(`/categories/${id}`),
    DUMMY_DATA.categories.find(c => c._id === id) || DUMMY_DATA.categories[0]
  )
};
export const dashboardAPI={
   getDashboard: () => api.get('/users/dashboard'),
}
// Requests API calls
export const requestsAPI = {
  createRequest: (data) => apiWithFallback(
    () => {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if (key === 'attachments' && data[key]) {
          data[key].forEach((file) => {
            formData.append('attachments', file);
          });
        } else if (typeof data[key] === 'object') {
          formData.append(key, JSON.stringify(data[key]));
        } else {
          formData.append(key, data[key]);
        }
      });
      return api.post('/requests', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    },
    { 
      ...data, 
      _id: Date.now().toString(), 
      status: 'active', 
      quotesCount: 0,
      createdAt: new Date().toISOString() 
    }
  ),
  
  getMyRequests: (params) => apiWithFallback(
    () => api.get('/requests/my-requests', { params }),
    []
  )
};
export default api;

