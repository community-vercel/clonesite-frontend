 
'use client';
import { useQuery } from 'react-query';
import api from '../../lib/api';
import { useAuth } from '../../lib/auth';
import Link from 'next/link';
// import RequestProgress from '../components/RequestProgress';

export default function Dashboard() {
  const { user } = useAuth();
  const { data: dashboardData, isLoading } = useQuery('dashboard', () =>
    api.get('/users/dashboard').then((res) => res.data.data)
  );

  if (isLoading) return <p className="text-center py-12">Loading...</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Your Requests</h2>
          {dashboardData.requests?.map((request) => (
            <div key={request._id} className="mb-4">
              <Link href={`/requests/${request._id}`} className="text-primary hover:underline">
                {request.title}
              </Link>
              {/* <RequestProgress status={request.status} /> */}
            </div>
          ))}
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Your Quotes</h2>
          {dashboardData.quotes?.map((quote) => (
            <div key={quote._id} className="mb-4">
              <p>{quote.request.title} - ${quote.amount}</p>
              <p className="text-sm text-gray-500">Status: {quote.status}</p>
            </div>
          ))}
        </div>
        {user.role === 'provider' && (
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Your Services</h2>
            {dashboardData.services?.map((service) => (
              <div key={service._id} className="mb-4">
                <Link href={`/services/${service._id}`} className="text-primary hover:underline">
                  {service.title}
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}