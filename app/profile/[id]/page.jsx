'use client';
import api from '../../lib/api';
import Image from 'next/image';
import ReviewCard from '../../components/ReviewCard';
import PortfolioUpload from '../../components/PortfolioUpload';
import { useAuth } from '../../lib/auth';

export default function ProviderProfile({ params }) {
  const { id } = params;
  const { user } = useAuth();
  const { data: provider, isLoading } = []
  // useQuery(['provider', id], () =>
  //   api.get(`/users/${id}`).then((res) => res.data.data)
  // );

  if (isLoading) return <p className="text-center py-12">Loading...</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6">
        <Image
          src={provider.avatar || '/placeholder.jpg'}
          alt={provider.name}
          width={200}
          height={200}
          className="rounded-full"
        />
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{provider.name}</h1>
          <p className="text-gray-600 mt-2">{provider.bio}</p>
          <div className="flex items-center mt-4">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className={`w-5 h-5 ${i < Math.round(provider.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
              />
            ))}
            <span className="ml-2 text-sm text-gray-500">({provider.reviewsCount} reviews)</span>
          </div>
        </div>
      </div>
      {user?._id === id && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Add to Portfolio</h2>
          <PortfolioUpload />
        </div>
      )}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Portfolio</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {provider.portfolio?.map((item) => (
            <Image
              key={item._id}
              src={item.image}
              alt="Portfolio item"
              width={200}
              height={200}
              className="rounded-lg object-cover"
            />
          ))}
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Reviews</h2>
        {provider.reviews?.map((review) => (
          <ReviewCard key={review._id} review={review} />
        ))}
      </div>
    </div>
  );
}