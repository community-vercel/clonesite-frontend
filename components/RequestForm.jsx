'use client';
import { useForm } from 'react-hook-form';
import api from '../lib/api';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useState } from 'react';

export default function RequestForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const router = useRouter();
  const [step, setStep] = useState(1);

  const onSubmit = async (data) => {
    try {
      await api.post('/requests', data);
      toast.success('Request created successfully!');
      router.push('/requests');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create request');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Post a Service Request</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {step === 1 && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Service Category</label>
              <select
                {...register('category', { required: 'Category is required' })}
                className="w-full p-2 border rounded"
              >
                <option value="">Select a category</option>
                {/* Fetch categories dynamically from API */}
              </select>
              {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
            </div>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="bg-primary text-white py-2 px-4 rounded hover:bg-green-600"
            >
              Next
            </button>
          </>
        )}
        {step === 2 && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                {...register('title', { required: 'Title is required' })}
                className="w-full p-2 border rounded"
              />
              {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                {...register('description', { required: 'Description is required' })}
                className="w-full p-2 border rounded"
              />
              {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
              >
                Back
              </button>
              <button
                type="submit"
                className="bg-primary text-white py-2 px-4 rounded hover:bg-green-600"
              >
                Submit Request
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}