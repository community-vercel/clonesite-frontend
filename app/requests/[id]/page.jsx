'use client';
// import api from '../../../../lib/api';
import QuoteCard from '../../../components/QuoteCard';
// import PaymentForm from '../../../components/PaymentForm';

export default function RequestPage({ params }) {
  const { id } = params;
  const { data: request, isLoading } =[]
  //  useQuery(['request', id], () =>
  //   api.get(`/requests/${id}`).then((res) => res.data.data)
  // );

  if (isLoading) return <p className="text-center py-12">Loading...</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800">{request.title}</h1>
      <p className="text-gray-600 mt-2">{request.description}</p>
      <p className="text-sm text-gray-500 mt-2">Posted on {new Date(request.createdAt).toLocaleDateString()}</p>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Quotes</h2>
        {request.quotes?.map((quote) => (
          <QuoteCard key={quote._id} quote={quote} requestId={id} />
        ))}
      </div>
      {request.status === 'quote_accepted' && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Payment</h2>
          {/* <PaymentForm quoteId={request.acceptedQuote} /> */}
        </div>
      )}
    </div>
  );
}