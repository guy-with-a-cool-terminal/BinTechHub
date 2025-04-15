import React from "react";

const PricingCard = ({ plan, onSelect }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-xl transition cursor-pointer" onClick={onSelect}>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{plan.label}</h2>
      <p className="text-gray-700 dark:text-gray-300 mb-1">{plan.duration}</p>
      <p className="text-green-600 dark:text-green-400 font-bold text-lg">Sh {plan.price}</p>
    </div>
  );
};

export default PricingCard;
