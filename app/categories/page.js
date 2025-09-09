'use client';
import { useQuery } from 'react-query';
import api from '../../lib/api';
import Link from 'next/link';

export default function CategoriesPage() {
  const { data: categories, isLoading } = useQuery('categoryTree', () =>
    api.get('/categories/tree').then((res) => res.data.data)
  );

  if (isLoading) return <p className="text-center py-12">Loading...</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Browse Categories</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories?.map((category) => (
          <div key={category._id} className="bg-white p-4 rounded-lg shadow">
            <Link href={`/services?category=${category._id}`} className="text-primary font-semibold hover:underline">
              {category.name}
            </Link>
            {category.subcategories?.length > 0 && (
              <ul className="mt-2 space-y-1">
                {category.subcategories.map((sub) => (
                  <li key={sub._id}>
                    <Link href={`/services?category=${sub._id}`} className="text-gray-600 hover:text-primary">
                      {sub.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}