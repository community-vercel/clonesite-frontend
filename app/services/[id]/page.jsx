 
// 'use client';
// import { useQuery } from 'react-query';
// import api from '../../lib/api';
// import Image from 'next/image';
// import Link from 'next/link';
// // import ReviewCard from '../../components/ReviewCard';
// import { StarIcon } from '@heroicons/react/solid';

// export default function ServicePage({ params }) {
//   const { id } = params;
//   const { data: service, isLoading } = useQuery(['service', id], () =>
//     api.get(`/services/${id}`).then((res) => res.data.data)
//   );

//   if (isLoading) return <p className="text-center py-12">Loading...</p>;

//   return (
//     <div className="bg-white p-6 rounded-lg shadow max-w-4xl mx-auto">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <Image
//           src={service.image || '/placeholder.jpg'}
//           alt={service.title}
//           width={500}
//           height={300}
//           className="rounded-lg object-cover"
//         />
//         <div>
//           <h1 className="text-3xl font-bold text-gray-800">{service.title}</h1>
//           <p className="text-gray-600 mt-2">{service.description}</p>
//           <div className="flex items-center mt-4">
//             {[...Array(5)].map((_, i) => (
//               <StarIcon
//                 key={i}
//                 className={`w-5 h-5 ${i < Math.round(service.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
//               />
//             ))}
//             <span className="ml-2 text-sm text-gray-500">({service.reviewsCount} reviews)</span>
//           </div>
//           <p className="text-primary font-bold text-xl mt-4">${service.price}</p>
//           <Link
//             href={`/requests/create?service=${id}`}
//             className="mt-6 inline-block bg-primary text-white py-3 px-6 rounded-lg hover:bg-green-600"
//           >
//             Request a Quote
//           </Link>
//         </div>
//       </div>
//       <div className="mt-8">
//         <h2 className="text-2xl font-bold mb-4">Provider</h2>
//         <Link href={`/profile/${service.provider._id}`} className="text-primary hover:underline">
//           {service.provider.name}
//         </Link>
//       </div>
//       <div className="mt-8">
//         <h2 className="text-2xl font-bold mb-4">Reviews</h2>
//         {/* {service.reviews?.map((review) => (
//           <ReviewCard key={review._id} review={review} />
//         ))} */}
//       </div>
//     </div>
//   );
// }