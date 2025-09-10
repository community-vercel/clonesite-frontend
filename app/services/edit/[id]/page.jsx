'use client';
import { useForm } from 'react-hook-form';
import api from '../../../../lib/api';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-toastify';

export default function EditService() {
  const { id } = useParams();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const router = useRouter();
  const { data: categories } = []
  // useQuery('categories', () =>
  //   api.get('/categories').then((res) => res.data.data)
  // );
  const { data: service, isLoading } = useQuery(['service', id], () =>
    api.get(`/services/${id}`).then((res) => res.data.data)
  );

  useEffect(() => {
    if (service) reset(service);
  }, [service, reset]);

  const onSubmit = async (data) => {
    try {
      await api.put(`/services/${id}`, data);
      toast.success('Service updated successfully!');
      router.push('/services/my-services');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update service');
    }
  };

  if (isLoading) return <p className="text-center py-12">Loading...</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Service</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            {...register('title', { required: 'Title is required' })}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            {...register('category', { required: 'Category is required' })}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select a category</option>
            {categories?.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
          {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            {...register('description', { required: 'Description is required' })}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <input
            type="number"
            {...register('price', { required: 'Price is required', min: 0 })}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
        </div>
        <button
          type="submit"
          className="bg-primary text-white py-2 px-6 rounded-lg hover:bg-green-600"
        >
          Update Service
        </button>
      </form>
    </div>
  );
}