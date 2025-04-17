import React, { useState } from "react";
// Removing the import for PlanCard
import PaymentModal from "../components/PaymentModal";

const plansData = [
  { label: "Basic Plan", price: 10, duration: "/year/month", features: ["Basic Feature 1", "Basic Feature 2"], isPopular: false },
  { label: "Pro Plan", price: 30, duration: "/year/month", features: ["Pro Feature 1", "Pro Feature 2"], isPopular: true },
  { label: "Enterprise Plan", price: 100, duration: "/year/month", features: ["Enterprise Feature 1", "Enterprise Feature 2"], isPopular: false },
];

const CaptivePortal = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleSelect = (plan) => {
    setSelectedPlan(plan);
  };

  const handleCloseModal = () => {
    setSelectedPlan(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <header className="py-6 px-4 flex items-center justify-between max-w-6xl mx-auto">
        <div className="text-xl font-bold text-blue-500">ConnectWiFi</div>
        <nav className="space-x-4">
          <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-blue-500">Payment Plans</a>
          <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-blue-500">Support</a>
          <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-blue-500">Terms</a>
        </nav>
      </header>

      <div className="text-center py-12 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Choose a plan below to get started.</h2>
        <p className="text-lg text-gray-600 dark:text-gray-400">Payment is quick and secure.</p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        {plansData.map((plan, index) => (
          <div
            key={index}
            className={`bg-white rounded-lg shadow-md p-6 flex flex-col cursor-pointer hover:shadow-lg transition duration-200 ${plan.isPopular ? 'border-2 border-blue-500' : ''}`}
            onClick={() => handleSelect(plan)}
          >
            {/* {plan.isPopular && (
              <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-semibold rounded-full px-2 py-1">
                Popular
              </div>
            )} */}
            <h3 className="text-xl font-semibold text-gray-900 mb-4">{plan.label}</h3>
            <div className="flex items-baseline mb-4">
              <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
              <span className="ml-1 text-gray-500">{plan.duration}</span>
            </div>
            <ul className="space-y-2 mb-4">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center text-gray-700">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
            >
              Select Plan
            </button>
          </div>
        ))}
      </div>

      {selectedPlan && (
        <PaymentModal plan={selectedPlan} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default CaptivePortal;