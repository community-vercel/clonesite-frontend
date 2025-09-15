'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Plus, Filter, Search, MapPin, Clock, DollarSign, Eye, MessageSquare, Calendar, CheckCircle, XCircle, Loader } from 'lucide-react';
import api from '../../lib/api';

const STATUS_CONFIG = {
  published: { label: 'Published', color: 'bg-blue-100 text-blue-800', icon: '📝' },
  receiving_quotes: { label: 'Receiving Quotes', color: 'bg-yellow-100 text-yellow-800', icon: '📨' },
  quotes_received: { label: 'Quotes Received', color: 'bg-purple-100 text-purple-800', icon: '💬' },
  provider_selected: { label: 'Provider Selected', color: 'bg-orange-100 text-orange-800', icon: '👤' },
  in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-800', icon: '🔄' },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-800', icon: '✅' },
  cancelled: { label: 'Cancelled', color: 'bg-gray-100 text-gray-800', icon: '❌' },
};

export default function RequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    page: 1,
  });
  const [pagination, setPagination] = useState({});
  const [error, setError] = useState(null);

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetchRequests();
    } else {
      setError('Please log in to view requests');
      setLoading(false);
    }
  }, [user, filters]);

  const fetchRequests = async () => {
  try {
    setLoading(true);
    setError(null);
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];

    if (!token) {
      throw new Error('No authentication token found');
    }

    const queryParams = new URLSearchParams();
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.search) queryParams.append('search', filters.search);
    queryParams.append('page', filters.page);
    queryParams.append('limit', '10');

    const url = `/requests/my-requests?${queryParams}`;
    console.log('Fetching from:', `http://localhost:5000/api${url}`);
    const response = await api.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = response.data; // Use response.data instead of response.json()
    if (response.status >= 200 && response.status < 300) {
      console.log('Fetched requests:', data.data.requests);
      setRequests(data.data.requests || []);
      setStats(data.data.stats || {});
      setPagination(data.data.pagination || {});
    } else {
      throw new Error(data.message || 'Failed to fetch requests');
    }
  } catch (error) {
    console.error('Error fetching requests:', error);
    setError(error.message || 'Failed to load requests');
  } finally {
    setLoading(false);
  }
};
  const handleCreateRequest = () => {
    router.push('/requests/create');
  };

  const handleViewRequest = (id) => {
    // Validate ObjectId format (24-character hexadecimal)
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      console.error(`Invalid request ID: ${id}`);
      setError(`Invalid request ID: ${id}`);
      return;
    }
    router.push(`/requests/${id}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(amount);
  };

  const RequestCard = ({ request }) => {
    const statusConfig = STATUS_CONFIG[request.status] || STATUS_CONFIG.published;

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{request.title}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                {statusConfig.icon} {statusConfig.label}
              </span>
            </div>
            <p className="text-gray-600 text-sm line-clamp-2 mb-3">{request.description}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {request.location?.city || 'N/A'}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(request.createdAt)}
              </div>
              {request.budget?.max > 0 && (
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  Up to {formatCurrency(request.budget.max)}
                </div>
              )}
              {request.quotes?.length > 0 && (
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" />
                  {request.quotes.length} quote{request.quotes.length !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => handleViewRequest(request._id)}
            className="ml-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>
        {request.selectedProvider && (
          <div className="border-t pt-3 mt-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">👤</div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {request.selectedProvider.businessName || `${request.selectedProvider.firstName} ${request.selectedProvider.lastName}`}
                </p>
                <p className="text-xs text-gray-500">Selected Provider</p>
              </div>
            </div>
          </div>
        )}
        <div className="flex justify-between items-center mt-4 pt-3 border-t">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            Updated {formatDate(request.updatedAt)}
          </div>
          <button
            onClick={() => handleViewRequest(request._id)}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
          >
            View Details →
          </button>
        </div>
      </div>
    );
  };

  const StatsCard = ({ title, value, subtitle, color = 'blue' }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center">
        <div className={`flex-shrink-0 w-8 h-8 bg-${color}-100 rounded-lg flex items-center justify-center`}>
          {color === 'blue' && <CheckCircle className={`w-5 h-5 text-${color}-600`} />}
          {color === 'green' && <CheckCircle className={`w-5 h-5 text-${color}-600`} />}
          {color === 'yellow' && <Clock className={`w-5 h-5 text-${color}-600`} />}
          {color === 'red' && <XCircle className={`w-5 h-5 text-${color}-600`} />}
        </div>
        <div className="ml-4">
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Requests</h1>
              <p className="text-gray-600 mt-1">Manage your service requests and track progress</p>
            </div>
            <button
              onClick={handleCreateRequest}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
            >
              <Plus className="w-5 h-5" />
              Post New Request
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard title="Total Requests" value={stats.total || 0} color="blue" />
          <StatsCard title="Active" value={stats.active || 0} color="yellow" />
          <StatsCard title="Completed" value={stats.completed || 0} color="green" />
          <StatsCard title="Total Spent" value={formatCurrency(stats.totalSpent || 0)} color="blue" />
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search requests..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={filters.search}
                  onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }))}
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.status}
                onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value, page: 1 }))}
              >
                <option value="">All Status</option>
                {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                  <option key={key} value={key}>{config.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading requests...</span>
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No requests yet</h3>
            <p className="text-gray-600 mb-6">Get started by posting your first service request</p>
            <button
              onClick={handleCreateRequest}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Post Your First Request
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <RequestCard key={request._id} request={request} />
            ))}
          </div>
        )}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-8">
            <p className="text-sm text-gray-600">
              Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{' '}
              {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{' '}
              {pagination.totalItems} requests
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilters((prev) => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.currentPage <= 1}
                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .slice(Math.max(0, pagination.currentPage - 3), pagination.currentPage + 2)
                .map((page) => (
                  <button
                    key={page}
                    onClick={() => setFilters((prev) => ({ ...prev, page }))}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      page === pagination.currentPage ? 'bg-blue-600 text-white' : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              <button
                onClick={() => setFilters((prev) => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.currentPage >= pagination.totalPages}
                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}