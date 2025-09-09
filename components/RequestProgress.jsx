export default function RequestProgress({ status }) {
  const steps = [
    { name: 'Posted', status: 'posted' },
    { name: 'Quotes Received', status: 'quotes_received' },
    { name: 'Quote Accepted', status: 'quote_accepted' },
    { name: 'In Progress', status: 'in_progress' },
    { name: 'Completed', status: 'completed' },
  ];

  const currentStep = steps.findIndex((step) => step.status === status);

  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
      {steps.map((step, index) => (
        <div key={step.status} className="flex flex-col items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              index <= currentStep ? 'bg-primary text-white' : 'bg-gray-300 text-gray-600'
            }`}
          >
            {index + 1}
          </div>
          <span className="text-sm mt-2 text-gray-700">{step.name}</span>
        </div>
      ))}
    </div>
  );
}