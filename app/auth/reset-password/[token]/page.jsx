 
'use client';
import { useForm } from 'react-hook-form';
import api from '../../../../lib/api';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const router = useRouter();
  const { token } = useParams();

  const onSubmit = async (data) => {
    try {
      await api.put(`/auth/reset-password/${token}`, data);
      toast.success('Password reset successfully! Please log in.');
      router.push('/auth/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-800">Reset Password</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your new password.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                id="password"
                type="password"
                {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                aria-invalid={errors.password ? 'true' : 'false'}
              />
              {errors.password && <p className="mt-1 text-red-500 text-sm">{errors.password.message}</p>}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                {...register('confirmPassword', { required: 'Please confirm your password' })}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                aria-invalid={errors.confirmPassword ? 'true' : 'false'}
              />
              {errors.confirmPassword && <p className="mt-1 text-red-500 text-sm">{errors.confirmPassword.message}</p>}
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Reset Password
          </button>
          <p className="text-center text-sm text-gray-600">
            Back to{' '}
            <Link href="/auth/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}


