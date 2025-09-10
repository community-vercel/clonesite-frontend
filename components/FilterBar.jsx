'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../lib/api';

export default function FilterBar() {
  const [filters, setFilters] = useState({ category: '', location: '', price: '' });
  const router = useRouter();
  const { data: categories } = []
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    router.push(`/services?${new URLSearchParams({ ...filters, [name]: value }).toString()}`);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-col md:flex-row gap-4">
      <select
        name="category"
        value={filters.category}
        onChange={handleFilterChange}
        className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="">All Categories</option>
        {categories?.map((cat) => (
          <option key={cat._id} value={cat._id}>{cat.name}</option>
        ))}
      </select>
      <input
        name="location"
        value={filters.location}
        onChange={handleFilterChange}
        placeholder="Enter location"
        className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <select
        name="price"
        value={filters.price}
        onChange={handleFilterChange}
        className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="">All Prices</option>
        <option value="0-50">$0 - $50</option>
        <option value="50-100">$50 - $100</option>
        <option value="100+">$100+</option>
      </select>
    </div>
  );
}