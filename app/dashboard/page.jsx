'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../app/context/AuthContext';
import { ChevronUp, ChevronDown, Play, Volume2, Maximize2, MapPin, Eye, Clock, CheckCircle, MessageSquare, Star } from 'lucide-react';
import Link from 'next/link';
import api from '../../lib/api'
import { useRouter } from 'next/navigation';

const Dashboard = () => {
  const [welcomeExpanded, setWelcomeExpanded] = useState(true);
  const [stats, setStats] = useState({});
  const [recentRequests, setRecentRequests] = useState([]);
  const [error, setError] = useState(null);
const { login, isAuthenticated, loading,user } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && isAuthenticated) {
         if(user.userType==='service_provider'){
        router.replace('/dashboard');
  
        }
        else{
              router.push('/');
  
        }
      }
    }, [isAuthenticated, loading, router]);
  // Use current date and time (05:47 PM PKT on Thursday, September 11, 2025)
  const currentDate = new Date();
  const formattedTime = currentDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  const formattedDate = currentDate.toLocaleDateString('en-US', { weekday: 'long', day: '2-digit', month: 'short' });

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        const response = await api.get('/users/dashboard')
        const { stats, recentRequests } = response.data.data;
        setStats(stats);
        setRecentRequests(recentRequests);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return <div className="text-center py-16">Loading...</div>;
  }

  if (!user || error) {
    return <div className="text-center py-16 text-red-600">{error || 'Please log in to view your dashboard'}</div>;
  }

  // Extract user data
  const {
    firstName,
    businessName,
    categories,
    location,
    isNationwide,
    serviceRadius,
    avatar,
    totalJobs,
    email,
  } = user;

  // Default avatar if not customized
  const userAvatar = avatar === 'default-avatar.jpg' ? (
    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-semibold">
      {/* {firstName.charAt(0).toUpperCase() + businessName.charAt(0).toUpperCase()} */}
    </div>
  ) : (
    <img src={`/uploads/${avatar}`} alt={`${firstName}'s avatar`} className="w-16 h-16 rounded-full" />
  );

  // Format location
  const locationText = isNationwide
    ? 'Nationwide'
    : `${location?.postcode || 'Unknown'}, ${serviceRadius}km radius`;

  // Get activity icon based on type
  const getActivityIcon = (type) => {
    switch (type) {
      case 'quote_received':
        return <MessageSquare className="w-5 h-5 text-blue-600" />;
      case 'request_completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'review_received':
        return <Star className="w-5 h-5 text-yellow-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };


    if (user && user.userType!='service_provider') return null;


  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
 

      {/* Greeting */}
      <div className="px-6 py-6">
        <h1 className="text-xl font-semibold mb-1">Good afternoon, {firstName}!</h1>
        <p className="text-sm text-gray-600">{formattedDate}, {formattedTime} PKT</p>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-12 grid lg:grid-cols-3 gap-6">
        {/* Left (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Welcome Card */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div
              onClick={() => setWelcomeExpanded(!welcomeExpanded)}
              className="px-6 py-4 border-b border-gray-200 flex justify-between items-center cursor-pointer"
            >
              <h2 className="text-base font-medium">Welcome to your new dashboard.</h2>
              {welcomeExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </div>
            {welcomeExpanded && (
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Steps */}
                  <div>
                    <h3 className="text-base font-semibold mb-2">Welcome to Bark, {firstName}</h3>
                    <p className="text-sm text-gray-600 mb-6">
                      We’re excited to help you grow your business.
                    </p>
                    <ol className="space-y-5 text-sm">
                      {[
                        {
                          title: 'Customers tell us what they need',
                          desc: 'Customers answer specific questions about their requirements.',
                        },
                        {
                          title: 'We send you matching leads',
                          desc: `You receive leads that match your preferences (${categories[0]?.name || 'No categories'}) instantly by email and on the app.`,
                        },
                        {
                          title: 'You choose leads you like',
                          desc: 'Get customer contact details right away.',
                        },
                        {
                          title: 'You contact the customer',
                          desc: 'Call or email the customer and sell your services.',
                        },
                        {
                          title: 'You get hired',
                          desc: 'There’s no commission and nothing more to pay.',
                        },
                      ].map((step, i) => (
                        <li key={i} className="flex items-start space-x-3">
                          <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-900 text-white text-xs font-medium">
                            {i + 1}
                          </div>
                          <div>
                            <p className="font-medium">{step.title}</p>
                            <p className="text-gray-600">{step.desc}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                    <p className="mt-6 text-sm text-gray-600">
                      To learn more, check out our 1 minute explainer video now
                    </p>
                  </div>

                  {/* Video + Cost */}
                  <div className="space-y-6">
                    <div className="rounded-lg overflow-hidden relative bg-gray-900 aspect-video flex items-center justify-center">
                      <Play className="w-12 h-12 text-white opacity-90" />
                      <div className="absolute bottom-3 right-3 flex space-x-2 text-white opacity-75">
                        <Volume2 className="w-4 h-4" />
                        <Maximize2 className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">How much does Bark cost?</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        It’s free to receive leads and you only pay to contact those you like. Leads are priced in credits, based on the value of the job.
                      </p>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-3">
                          We offer a discounted starter pack with enough credits for about 10 responses, backed by our Get Hired Guarantee.
                        </p>
                        <p className="text-sm text-gray-600 mb-3">
                          We’re so confident you’ll get hired at least once from this pack, that if you don’t we’ll give you all your credits back.
                        </p>
                        <Link href="#" className="bg-blue-600 text-white text-sm px-5 py-2 rounded-md hover:bg-blue-700 transition">
                          View {stats.provider?.totalQuotes || 0} live leads
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 border-t border-gray-200 pt-4 text-right">
                  <button
                    onClick={() => setWelcomeExpanded(false)}
                    className="text-blue-600 text-sm font-medium hover:text-blue-700"
                  >
                    Hide
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start space-x-4">
              {userAvatar}
              <div className="flex-1">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold">{businessName}</h3>
                    <p className="text-sm text-gray-600">Your profile is 83% complete</p>
                  </div>
                  <Link href="/profile" className="text-blue-600 text-sm font-medium hover:text-blue-700">
                    Edit
                  </Link>
                </div>
                <div className="h-2 bg-gray-200 rounded-full mb-3">
                  <div className="h-2 bg-blue-600 rounded-full" style={{ width: '83%' }} />
                </div>
                <p className="text-sm text-gray-600">
                  Completing your profile is a great way to appeal to customers –{' '}
                  <Link href="/profile" className="text-blue-600 hover:text-blue-700">Edit profile</Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Get Started */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold mb-4">Get started</h3>
            <div className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full inline-block mb-4">
              20% OFF STARTER PACK OFFER
            </div>
            <h4 className="font-medium mb-1">Starter pack offer</h4>
            <p className="text-sm text-gray-600">Respond to up to 10 customers</p>
            <p className="text-sm text-gray-600 mb-3">20% OFF and a get hired guarantee.</p>
            <Link href="#" className="text-blue-600 text-sm font-medium hover:text-blue-700">
              More info
            </Link>
          </div>

          {/* Lead Settings */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold mb-4">Lead settings</h3>
            <div className="space-y-5 text-sm">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Services</h4>
                  <Link href="/profile" className="text-blue-600 hover:text-blue-700">
                    Edit
                  </Link>
                </div>
                <p className="text-gray-600">You’ll receive leads in these categories</p>
                <p className="text-gray-800">{categories[0]?.name || 'No categories'}</p>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Locations</h4>
                  <Link href="/profile" className="text-blue-600 hover:text-blue-700">
                    Edit
                  </Link>
                </div>
                <p className="text-gray-600">You’re receiving customers within</p>
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-800">{locationText}</span>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-1">Estimated {stats.provider?.totalQuotes || 0} leads per day</h4>
                <p className="text-gray-600">Sending new leads to</p>
                <p className="font-medium">{email}</p>
                <Link href="/profile" className="text-blue-600 hover:text-blue-700">
                  Change
                </Link>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.provider?.activeJobs || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-xl">
                  <MessageSquare className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Quotes</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.provider?.totalQuotes || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-xl">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Average Rating</p>
                  <p className="text-2xl font-bold text-gray-900">{user.rating?.average.toFixed(1) || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                  <p className="text-2xl font-bold text-gray-900">${(stats.provider?.totalEarnings || 0).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
              <Link href="/activity" className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                View all
              </Link>
            </div>

            {recentRequests.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="font-medium">No recent activity</p>
                <p className="text-sm">Your activity will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentRequests.map((activity) => (
                  <div key={activity._id} className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex-shrink-0 p-2 bg-gray-100 rounded-lg">
                      {getActivityIcon(activity.status === 'completed' ? 'request_completed' : 'quote_received')}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {activity.status === 'completed' ? 'Job Completed' : 'New Quote Received'} - {activity.category?.name || 'Unknown'}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center mt-1">
                        <Clock size={12} className="mr-1" />
                        {new Date(activity.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;