import { StarIcon } from '@heroicons/react/solid';

export default function ReviewCard({ review }) {
  return (
    <div className="bg-white border rounded-lg p-4 mb-4 shadow">
      <div className="flex items-center mb-2">
        {[...Array(5)].map((_, i) => (
          <StarIcon
            key={i}
            className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
      <p className="text-gray-600">{review.comment}</p>
      <p className="text-sm text-gray-500 mt-2">By {review.user.name} on {new Date(review.createdAt).toLocaleDateString()}</p>
      <button className="text-primary text-sm hover:underline mt-2">
        Helpful ({review.helpfulCount})
      </button>
    </div>
  );
}