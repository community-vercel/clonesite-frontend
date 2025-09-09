'use client';
import api from '../lib/api';
import { toast } from 'react-toastify';
import Link from 'next/link';

export default function QuoteCard({ quote, requestId }) {
  const handleAccept = async () => {
    try {
      await api.post(`/requests/${requestId}/quotes/${quote._id}/accept`);
      toast.success('Quote accepted!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to accept quote');
    }
  };

  return (
    <div className="bg-white border rounded-lg p-4 mb-4 shadow">
      <h3 className="text-lg font-semibold">
        <Link href={`/profile/${quote.provider._id}`} className="text-primary hover:underline">
          {quote.provider.name}
        </Link>
      </h3>
      <p className="text-gray-600">{quote.message}</p>
      <p className="text-primary font-bold mt-2">${quote.amount}</p>
      <button
        onClick={handleAccept}
        className="mt-3 bg-primary text-white py-2 px-4 rounded hover:bg-green-600"
      >
        Accept Quote
      </button>
    </div>
  );
}