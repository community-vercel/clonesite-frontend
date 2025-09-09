'use client';
import { useQuery } from 'react-query';
import api from '../../lib/api';
import ServiceCard from '../../components/ServiceCard';
import FilterBar from '../../components/FilterBar';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function ServicesPage() {
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const query = searchParams.get('query') || '';
  const category = searchParams.get('category') || '';
  const location = searchParams.get('location') || '';
  const price = searchParams.get('price') || '';

  const { data: services, isLoading } = useQuery(
    ['services', page, query, category, location, price],
    () => api.get(`/services?page=${page}&query=${query}&category=${category}&location=${location}&price=${price}`).then((res) => res.data.data),
    { keepPreviousData: true }
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Find Professionals</h1>
      <FilterBar />
      {isLoading ? (
        <p className="text-center py-12">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services?.items.map((service) => (
            <ServiceCard key={service._id} service={service} />
          ))}
        </div>
      )}
      <div className="mt-8 flex justify-center space-x-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="bg-primary text-white py-2 px-4 rounded-lg hover:bg-green-600 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-gray-800">Page {page} of {services?.pagination.totalPages}</span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={page === services?.pagination.totalPages}
          className="bg-primary text-white py-2 px-4 rounded-lg hover:bg-green-600 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

