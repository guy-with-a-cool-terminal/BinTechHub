import React, { useState } from "react";
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
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 py-4 px-4 flex items-center justify-between max-w-7xl mx-auto z-10 bg-white">
        <div className="text-xl font-bold text-blue-500">PortalConnect</div>
        <nav className="space-x-8">
          <a href="#" className="text-gray-600 hover:text-blue-500 transition duration-200">Payment Plans</a>
          <a href="#" className="text-gray-600 hover:text-blue-500 transition duration-200">Support</a>
          <a href="#" className="text-gray-600 hover:text-blue-500 transition duration-200">Terms</a>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto py-8 lg:py-12 px-4 lg:px-8">
        <div className="text-center mb-8 lg:mb-12">
          <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight mb-3">
            Choose a plan below to get started.
          </h1>
          <p className="text-lg text-gray-500">
            Payment is quick and secure.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {plansData.map((plan, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl shadow-md p-6 lg:p-8 flex flex-col cursor-pointer transition duration-200 transform hover:translate-y-1 hover:shadow-lg`}
              onClick={() => handleSelect(plan)}
            >
              <h3 className="text-xl font-semibold text-blue-500 mb-3">{plan.label}</h3>
              <div className="flex items-baseline mb-4">
                <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                <span className="ml-1 text-gray-500 text-sm">{plan.duration}</span>
              </div>
              <ul className="space-y-3 mb-5">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-full focus:outline-none focus:shadow-outline transition duration-200"
              >
                Select Plan
              </button>
            </div>
          ))}
        </div>
      </main>

      {selectedPlan && (
        <PaymentModal plan={selectedPlan} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default CaptivePortal;