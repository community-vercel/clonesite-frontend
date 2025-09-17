'use client';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login, isAuthenticated, loading,user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
console.log('user is',user)
  useEffect(() => {
    if (!loading && isAuthenticated) {
       if(user.userType==='service_provider'){
      router.replace('/dashboard');

      }
      else{
            router.push('/');

      }
    }
  }, [isAuthenticated, loading, router]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const result = await login(data);
      if (result.success) {
        toast.success('Logged in successfully!');
        // router.replace('/dashboard');
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      if (message.includes('Invalid credentials')) {
        toast.error('Incorrect email or password');
      } else if (message.includes('deactivated')) {
        toast.error('Your account is deactivated. Please contact support.');
      } else {
        toast.error(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-16">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-800">Sign in to ServiceHub</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link href="/auth/register" className="text-green-600 hover:underline">
              create an account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative">
                <input
                  id="email"
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Please provide a valid email',
                    },
                  })}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  aria-invalid={errors.email ? 'true' : 'false'}
                />
                <EnvelopeIcon className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
              </div>
              {errors.email && <p className="mt-1 text-red-500 text-sm">{errors.email.message}</p>}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  type="password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' },
                  })}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  aria-invalid={errors.password ? 'true' : 'false'}
                />
                <LockClosedIcon className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
              </div>
              {errors.password && <p className="mt-1 text-red-500 text-sm">{errors.password.message}</p>}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Link href="/auth/forgot-password" className="text-sm text-green-600 hover:underline">
              Forgot your password?
            </Link>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}