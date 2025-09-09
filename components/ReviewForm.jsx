'use client';
import { useForm } from 'react-hook-form';
import api from '../lib/api';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

export default function ReviewForm({ providerId }) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      await api.post('/reviews', { ...data, providerId });
      toast.success('Review submitted successfully!');
      router.refresh();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Write a Review</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Rating</label>
          <select
            {...register('rating', { required: 'Rating is required' })}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select rating</option>
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>{num} Star{num > 1 ? 's' : ''}</option>
            ))}
          </select>
          {errors.rating && <p className="text-red-500 text-sm">{errors.rating.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Comment</label>
          <textarea
            {...register('comment', { required: 'Comment is required' })}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.comment && <p className="text-red-500 text-sm">{errors.comment.message}</p>}
        </div>
        <button
          type="submit"
          className="bg-primary text-white py-2 px-6 rounded-lg hover:bg-green-600"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
}