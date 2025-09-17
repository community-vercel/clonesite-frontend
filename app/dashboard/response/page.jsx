'use client';
import React, { useState, useEffect } from 'react';
import api from '../../../lib/api';

const MyResponses = () => {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const fetchResponses = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/requests/my-responses', {
          params: { page, limit: 10, status: statusFilter, sortBy }
        });
        setResponses(data.data.responses);
        setTotalPages(data.data.pagination.totalPages);
      } catch (error) {
        console.error('Failed to fetch responses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchResponses();
  }, [page, statusFilter, sortBy]);

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      {/* Header and Filters */}
      <h1 className="text-2xl font-bold mb-6">My Responses</h1>
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div className="flex gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded p-2"
          >
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="withdrawn">Withdrawn</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded p-2"
          >
            <option value="newest">Newest First</option>
            <option value="status">Status</option>
            <option value="responseTime">Response Time</option>
          </select>
        </div>
        <div className="text-sm text-gray-600">
          Showing {responses.length} of {totalPages * 10} responses
        </div>
      </div>

      {/* Responses List */}
      <div className="grid gap-6">
        {responses.map((response) => (
          <div
            key={response.id}
            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold">{response.title}</h3>
                <p className="text-gray-600 text-sm">
                  Category: {response.category}
                </p>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  response.status === 'accepted'
                    ? 'bg-green-100 text-green-800'
                    : response.status === 'rejected'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {response.status.charAt(0).toUpperCase() + response.status.slice(1)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-700">
                  <strong>Customer:</strong>{' '}
                  {response.customer.name}{' '}
                  {response.customer.isVerified && (
                    <span className="text-green-600 text-xs">✓ Verified</span>
                  )}
                </p>
                <p className="text-gray-700">
                  <strong>Email:</strong>{' '}
                  {response.customer.email || 'Available after contact'}
                </p>
                <p className="text-gray-700">
                  <strong>Phone:</strong>{' '}
                  {response.customer.phone || 'Available after contact'}
                </p>
              </div>
              <div>
                <p className="text-gray-700">
                  <strong>Submitted:</strong>{' '}
                  {new Date(response.submittedAt).toLocaleDateString()}
                </p>
                {response.contactedAt && (
                  <p className="text-gray-700">
                    <strong>Contacted:</strong>{' '}
                    {new Date(response.contactedAt).toLocaleDateString()}
                  </p>
                )}
                {response.responseTime && (
                  <p className="text-gray-700">
                    <strong>Response Time:</strong> {response.responseTime} hours
                  </p>
                )}
                <p className="text-gray-700">
                  <strong>Amount:</strong> {response.amount || 'Not specified'}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-gray-600 italic">
                {response.message || 'No message provided'}
              </p>
            </div>

            <div className="mt-4 flex gap-2">
              {response.status === 'pending' && (
                <>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Send Quote
                  </button>
                  <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                    Withdraw
                  </button>
                </>
              )}
              {response.status === 'accepted' && (
                <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                  View Project
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MyResponses;