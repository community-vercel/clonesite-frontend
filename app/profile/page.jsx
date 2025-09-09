 
'use client';
import { useQuery } from 'react-query';
import api from '../../lib/api';
import { useAuth } from '../../lib/auth';
import Link from 'next/link';
import Image from 'next/image';
import { StarIcon } from '@heroicons/react/solid';
import PortfolioUpload from '../../components/PortfolioUpload';
import ReviewCard from '../../components/ReviewCard';

export default function ProfilePage() {
  const { user } = useAuth();
  const { data: profile, isLoading } = useQuery('profile', () =>
    api.get('/users/profile').then((res) => res.data.data)
  );

  if (isLoading) return <p className="text-center py-12">Loading...</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white p-6 rounded-lg shadow max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
          <Image
            src={profile.avatar || '/placeholder.jpg'}
            alt={profile.name}
            width={200}
            height={200}
            className="rounded-full"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{profile.name}</h1>
            <p className="text-gray-600 mt-2">{profile.bio || 'No bio provided'}</p>
            <div className="flex items-center mt-4">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className={`w-5 h-5 ${i < Math.round(profile.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                />
              ))}
              <span className="ml-2 text-sm text-gray-500">({profile.reviewsCount || 0} reviews)</span>
            </div>
            <Link
              href="/profile/edit"
              className="mt-4 inline-block bg-primary text-white py-2 px-4 rounded-lg hover:bg-green-600"
            >
              Edit Profile
            </Link>
          </div>
        </div>
        {user.role === 'provider' && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Portfolio</h2>
            <PortfolioUpload />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {profile.portfolio?.map((item) => (
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
        )}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Reviews</h2>
          {profile.reviews?.map((review) => (
            <ReviewCard key={review._id} review={review} />
          ))}
        </div>
        {user.role === 'provider' && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Your Services</h2>
            <Link
              href="/services/my-services"
              className="text-primary hover:underline"
            >
              View all services
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

