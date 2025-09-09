'use client';
import { useForm } from 'react-hook-form';
import api from '../lib/api';
import { toast } from 'react-toastify';

export default function EmailSubscription() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      await api.post('/subscribe', data); // Assumes API endpoint for subscriptions
      toast.success('Subscribed successfully!');
    } catch (error) {
      toast.error('Failed to subscribe');
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h2 className="text-lg font-semibold text-white mb-2">Stay Updated</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
        <input
          {...register('email', { required: 'Email is required', pattern: /^\S+@\S+$/i })}
          placeholder="Enter your email"
          className="flex-grow p-2 rounded text-gray-800"
        />
        <button className="bg-primary text-white py-2 px-4 rounded hover:bg-green-600">
          Subscribe
        </button>
      </form>
      {errors.email && <p className="text-red-400 text-sm mt-2">{errors.email.message}</p>}
    </div>
  );
}