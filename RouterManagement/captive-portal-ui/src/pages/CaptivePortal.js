import React, { useState } from "react";
import PricingCard from "../components/PricingCard";
import PaymentModal from "../components/PaymentModal";

const plans = [
  { label: "Full Day", price: 100, duration: "24 Hours" },
  { label: "Half Day", price: 50, duration: "12 Hours" },
  { label: "1 Hour", price: 20, duration: "1 Hour" },
  { label: "30 Minutes", price: 10, duration: "30 Minutes" }
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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Buy Internet Access</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl w-full">
        {plans.map((plan, index) => (
          <PricingCard key={index} plan={plan} onSelect={() => handleSelect(plan)} />
        ))}
      </div>

      {selectedPlan && (
        <PaymentModal plan={selectedPlan} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default CaptivePortal;
