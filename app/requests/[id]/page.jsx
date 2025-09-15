'use client';
import { useState, useEffect } from 'react';
import api from '../../../lib/api';
import QuoteCard from '../../../components/QuoteCard';
// import PaymentForm from '../../../components/PaymentForm';

export default function RequestPage({ params }) {
  const { id } = params;
  const [request, setRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get token from cookies
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('token='))
          ?.split('=')[1];

        if (!token) {
          throw new Error('No authentication token found');
        }

        // Validate ObjectId format
        if (!/^[0-9a-fA-F]{24}$/.test(id)) {
          throw new Error('Invalid request ID');
        }

        console.log('Fetching request from:', `http://localhost:5000/api/requests/${id}`);
        const response = await api.get(`/requests/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = response.data; // Use response.data for axios
        if (response.status >= 200 && response.status < 300) {
          console.log('Fetched request:', data.data);
          setRequest(data.data);
        } else {
          throw new Error(data.message || 'Failed to fetch request');
        }
      } catch (error) {
        console.error('Error fetching request:', error);
        setError(error.message || 'Failed to load request');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequest();
  }, [id]);

  if (isLoading) {
    return <p className="text-center py-12">Loading...</p>;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-4xl mx-auto">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="bg-white p-6 rounded-lg shadow max-w-4xl mx-auto">
        <p className="text-gray-600">Request not found</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800">{request.title}</h1>
      <p className="text-gray-600 mt-2">{request.description}</p>
      <p className="text-sm text-gray-500 mt-2">
        Posted on {new Date(request.createdAt).toLocaleDateString()}
      </p>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Quotes</h2>
        {request.quotes?.length > 0 ? (
          request.quotes.map((quote) => (
            <QuoteCard key={quote._id} quote={quote} requestId={id} />
          ))
        ) : (
          <p className="text-gray-600">No quotes received yet.</p>
        )}
      </div>
      {request.status === 'provider_selected' && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Payment</h2>
          {/* <PaymentForm quoteId={request.selectedQuote} /> */}
        </div>
      )}
    </div>
  );
}