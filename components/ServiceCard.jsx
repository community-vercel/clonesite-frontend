import Link from 'next/link';
import Image from 'next/image';
import { StarIcon } from '@heroicons/react/solid';

export default function ServiceCard({ service }) {
  return (
    <div className="bg-white border rounded-lg shadow-md p-4 hover:shadow-lg transition">
      <Image
        src={service.image || '/placeholder.jpg'}
        alt={service.title}
        width={300}
        height={200}
        className="rounded-lg mb-4 object-cover"
      />
      <h3 className="text-xl font-semibold text-gray-800">{service.title}</h3>
      <p className="text-gray-600 line-clamp-2">{service.description}</p>
      <div className="flex items-center my-2">
        {[...Array(5)].map((_, i) => (
          <StarIcon
            key={i}
            className={`w-5 h-5 ${i < Math.round(service.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-500">({service.reviewsCount} reviews)</span>
      </div>
      <p className="text-primary font-bold">${service.price}</p>
      <Link
        href={`/services/${service._id}`}
        className="mt-3 inline-block bg-primary text-white py-2 px-4 rounded hover:bg-green-600"
      >
        View Details
      </Link>
    </div>
  );
}