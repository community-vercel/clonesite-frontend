'use client';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../../lib/api';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Link from 'next/link';
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  PhoneIcon,
  MapPinIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';

export default function RegisterPage() {
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
    defaultValues: {
      step: 1,
      category: '',
      isNationwide: false,
      serviceRadius: '30',
      postcode: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phone: '',
      businessName: '',
      website: '',
      companySize: ''
    }
  });

  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const isNationwide = watch('isNationwide');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data.data);
        setFilteredCategories(response.data.data);
      } catch (error) {
        toast.error('Failed to load service categories');
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const filtered = categories.filter((cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [searchQuery, categories]);

  const handleCategorySelect = (categoryId) => {
    setValue('category', categoryId, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    try {
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        phone: data.phone || null,
        category: data.category,
        isNationwide: data.isNationwide,
        serviceRadius: data.isNationwide ? null : parseInt(data.serviceRadius),
        postcode: data.isNationwide ? null : data.postcode,
        businessName: data.businessName || null,
        website: data.website || null,
        companySize: data.companySize || null
      };
      await api.post('/auth/register', payload);
      toast.success('Registered successfully! Please check your email for verification.');
      router.push('/auth/login');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Registration failed');
    }
  };
 
  const [isLoading, setIsLoading] = useState(false);

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
   <div className="min-h-screen bg-gray-50 py-10">
      <div className={`mx-auto ${step === 1 ? 'max-w-7xl' : 'max-w-lg'} px-4 sm:px-6 lg:px-8`}>
        <div className={step === 1 ? 'grid gap-8 lg:grid-cols-3' : ''}>
          <div className={step === 1 ? 'lg:col-span-2' : ''}>
            <div className="bg-white rounded-2xl shadow-md border-none">
              <div className="p-8">
                <div className="mb-6 text-center">
                  <h2 className="text-3xl font-bold text-gray-900">Join as a Seller</h2>
                  <p className="mt-2 text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link href="/auth/login" className="text-blue-600 hover:underline">
                      Sign in
                    </Link>
                  </p>
                  <div className="mt-4 flex justify-center gap-2">
                    {[1, 2, 3].map((s) => (
                      <div
                        key={s}
                        className={`h-2 w-2 rounded-full ${
                          step >= s ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-gray-500">Step {step} of 3</p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                  {step === 1 && (
                    <div className="space-y-5">
                      <div>
                        <h3 className="text-2xl font-semibold text-gray-900">
                          Secure jobs and grow your business
                        </h3>
                        <p className="mt-1 text-sm text-gray-600">
                          1000s of local and remote clients are already waiting for your services.
                        </p>
                      </div>
                      <div className="mt-4">
                        <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                          What service do you provide?
                        </label>
                        <div className="mt-2 relative">
                          <input
                            id="search"
                            type="text"
                            placeholder="Search for a service..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-12 rounded-2xl border border-gray-200 bg-white px-4 sm:px-5 pr-12 text-base sm:text-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <MagnifyingGlassIcon className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="hidden"
                          {...register('category', { required: 'Please select a service' })}
                        />
                        {errors.category && (
                          <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>
                        )}
                      </div>
                      <div className="pt-4">
                        <p className="text-sm font-medium text-gray-700">Popular services</p>
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {filteredCategories.slice(0, 12).map((cat) => (
                            <button
                              key={cat._id}
                              type="button"
                              onClick={() => handleCategorySelect(cat._id)}
                              className={`flex items-center p-3 rounded-xl border text-sm text-gray-700 hover:bg-blue-50 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                watch('category') === cat._id ? 'bg-blue-50 border-blue-500' : 'border-gray-200'
                              }`}
                            >
                              <span
                                className="mr-2 inline-block h-2 w-2 rounded-full bg-gray-400"
                                aria-hidden
                              />
                              {cat.name}
                            </button>
                          ))}
                        </div>
                        {filteredCategories.length === 0 && (
                          <p className="text-sm text-gray-500">No categories found</p>
                        )}
                      </div>
                      <div className="flex justify-end">
                        {/* <button
                          type="submit"
                          aria-label="Proceed to next step"
                          disabled={isLoading}
                          className={`rounded-2xl px-6 py-3 text-base font-semibold text-white focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-500 hover:bg-blue-600 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {isLoading ? 'Processing...' :''}
                        </button> */}
                      </div>
                    </div>
                  )}
                  

                {step === 2 && (
                  <div className="space-y-5">
                    <div>
                      <h3 className="text-2xl font-semibold text-gray-900">
                        Where would you like to see leads from?
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        Tell us your service area to find the right clients for you.
                      </p>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isNationwide"
                        {...register('isNationwide')}
                        className="h-5 w-5 text-blue-600 focus:ring-blue-600 border-gray-300 rounded"
                      />
                      <label htmlFor="isNationwide" className="ml-2 text-sm font-medium text-gray-700">
                        I serve customers nationwide
                      </label>
                    </div>

                    {!isNationwide && (
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="serviceRadius" className="block text-sm font-medium text-gray-700">
                            Service Radius (miles)
                          </label>
                          <div className="mt-2 relative">
                            <select
                              id="serviceRadius"
                              {...register('serviceRadius', { required: 'Please select a service radius' })}
                              className="w-full h-12 rounded-xl border border-gray-300 bg-white px-3 pr-10 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                              aria-invalid={errors.serviceRadius ? 'true' : 'false'}
                            >
                              <option value="10">10 miles</option>
                              <option value="20">20 miles</option>
                              <option value="30">30 miles</option>
                              <option value="50">50 miles</option>
                              <option value="100">100 miles</option>
                            </select>
                          </div>
                          {errors.serviceRadius && (
                            <p className="mt-2 text-sm text-red-600">{errors.serviceRadius.message}</p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="postcode" className="block text-sm font-medium text-gray-700">
                            Postcode
                          </label>
                          <div className="mt-2 relative">
                            <input
                              id="postcode"
                              type="text"
                              {...register('postcode', {
                                required: 'Postcode is required',
                                pattern: {
                                  value: /^[A-Z0-9 ]{5,10}$/,
                                  message: 'Please provide a valid postcode'
                                }
                              })}
                              className="w-full h-12 rounded-xl border border-gray-300 bg-white px-3 pr-12 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                              aria-invalid={errors.postcode ? 'true' : 'false'}
                            />
                            <MapPinIcon className="absolute right-3 top-3.5 h-6 w-6 text-gray-400" />
                          </div>
                          {errors.postcode && (
                            <p className="mt-2 text-sm text-red-600">{errors.postcode.message}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-5">
                    <div>
                      <h3 className="text-2xl font-semibold text-gray-900">
                        Tell us about yourself
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        Provide your details to create your account.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                          First Name
                        </label>
                        <div className="mt-2 relative">
                          <input
                            id="firstName"
                            type="text"
                            {...register('firstName', {
                              required: 'First name is required',
                              minLength: { value: 2, message: 'First name must be at least 2 characters' },
                              maxLength: { value: 50, message: 'First name must be less than 50 characters' }
                            })}
                            className="w-full h-12 rounded-xl border border-gray-300 bg-white px-3 pr-12 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                            aria-invalid={errors.firstName ? 'true' : 'false'}
                          />
                          <UserIcon className="absolute right-3 top-3.5 h-6 w-6 text-gray-400" />
                        </div>
                        {errors.firstName && (
                          <p className="mt-2 text-sm text-red-600">{errors.firstName.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                          Last Name
                        </label>
                        <div className="mt-2 relative">
                          <input
                            id="lastName"
                            type="text"
                            {...register('lastName', {
                              required: 'Last name is required',
                              minLength: { value: 2, message: 'Last name must be at least 2 characters' },
                              maxLength: { value: 50, message: 'Last name must be less than 50 characters' }
                            })}
                            className="w-full h-12 rounded-xl border border-gray-300 bg-white px-3 pr-12 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                            aria-invalid={errors.lastName ? 'true' : 'false'}
                          />
                          <UserIcon className="absolute right-3 top-3.5 h-6 w-6 text-gray-400" />
                        </div>
                        {errors.lastName && (
                          <p className="mt-2 text-sm text-red-600">{errors.lastName.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Email address
                        </label>
                        <div className="mt-2 relative">
                          <input
                            id="email"
                            type="email"
                            {...register('email', {
                              required: 'Email is required',
                              pattern: { value: /^\S+@\S+$/i, message: 'Please provide a valid email' }
                            })}
                            className="w-full h-12 rounded-xl border border-gray-300 bg-white px-3 pr-12 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                            aria-invalid={errors.email ? 'true' : 'false'}
                          />
                          <EnvelopeIcon className="absolute right-3 top-3.5 h-6 w-6 text-gray-400" />
                        </div>
                        {errors.email && (
                          <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                          Password
                        </label>
                        <div className="mt-2 relative">
                          <input
                            id="password"
                            type="password"
                            {...register('password', {
                              required: 'Password is required',
                              minLength: { value: 6, message: 'Password must be at least 6 characters' },
                              pattern: {
                                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                                message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
                              }
                            })}
                            className="w-full h-12 rounded-xl border border-gray-300 bg-white px-3 pr-12 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                            aria-invalid={errors.password ? 'true' : 'false'}
                          />
                          <LockClosedIcon className="absolute right-3 top-3.5 h-6 w-6 text-gray-400" />
                        </div>
                        {errors.password && (
                          <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                          Phone Number (Optional)
                        </label>
                        <div className="mt-2 relative">
                          <input
                            id="phone"
                            type="tel"
                            {...register('phone', {
                              pattern: {
                                value: /^\+?[\d\s-]{10,}$/,
                                message: 'Please provide a valid phone number'
                              }
                            })}
                            className="w-full h-12 rounded-xl border border-gray-300 bg-white px-3 pr-12 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                            aria-invalid={errors.phone ? 'true' : 'false'}
                          />
                          <PhoneIcon className="absolute right-3 top-3.5 h-6 w-6 text-gray-400" />
                        </div>
                        {errors.phone && (
                          <p className="mt-2 text-sm text-red-600">{errors.phone.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
                          Company Name (Optional)
                        </label>
                        <div className="mt-2">
                          <input
                            id="businessName"
                            type="text"
                            {...register('businessName')}
                            className="w-full h-12 rounded-xl border border-gray-300 bg-white px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                          Company Website (Optional)
                        </label>
                        <div className="mt-2">
                          <input
                            id="website"
                            type="url"
                            {...register('website', {
                              pattern: {
                                value: /^https?:\/\/[^\s$.?#].[^\s]*$/,
                                message: 'Please provide a valid URL'
                              }
                            })}
                            className="w-full h-12 rounded-xl border border-gray-300 bg-white px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                            aria-invalid={errors.website ? 'true' : 'false'}
                          />
                        </div>
                        {errors.website && (
                          <p className="mt-2 text-sm text-red-600">{errors.website.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="companySize" className="block text-sm font-medium text-gray-700">
                          Company Size (Optional)
                        </label>
                        <div className="mt-2">
                          <select
                            id="companySize"
                            {...register('companySize')}
                            className="w-full h-12 rounded-xl border border-gray-300 bg-white px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                          >
                            <option value="">Select company size</option>
                            <option value="self-employed">Self-employed, Sole trader</option>
                            <option value="2-10">2–10</option>
                            <option value="11-50">11–50</option>
                            <option value="51-200">51–200</option>
                            <option value="200+">200+</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-6 flex justify-between">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="rounded-xl bg-gray-200 px-6 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    >
                      Back
                    </button>
                  ) : (
                    <span />
                  )}
                  <button
                    type="submit"
                    className={`rounded-xl px-6 py-3 text-sm font-semibold text-white focus:outline-none focus:ring-2
                    ${step === 3 ? 'bg-green-600 hover:bg-green-700 focus:ring-green-600' : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-600'}`}
                  >
                    {step === 3 ? 'Create Account' : 'Next'}
                  </button>
                </div>
              </form>
            </div>
          </div>
      </div>
          {step === 1 && (
            <aside className="hidden md:block">
              <div className="relative h-full min-h-[480px] overflow-hidden rounded-2xl shadow-sm ring-1 ring-gray-100">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-gray-900 via-gray-800 to-gray-700" />
                                                       <img src='https://d18jakcjgoan9.cloudfront.net/s/img/images/pro-register/rated-excellent-image.jpg!d=PRGs7J' />

                <div className="relative h-full w-full p-6 flex flex-col justify-between">
                  
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-1">
                      {[0,1,2,3,4].map((i) => (
                        <StarIcon key={i} className="h-6 w-6 text-green-400" />
                      ))}
                    </div>
                    <div className="text-xs text-white/80">
                      <span className="inline-flex items-center gap-1 rounded-md bg-white/10 px-2 py-1">
                        <span className="font-semibold">Trustpilot</span>
                        <span>•</span>
                        <span>5,000+ reviews</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          )}
        </div>
  
      </div>
    </div>
  );
}