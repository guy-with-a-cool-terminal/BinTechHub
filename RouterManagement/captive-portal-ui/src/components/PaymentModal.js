import React, { useState } from "react";

const PaymentModal = ({ plan, onClose }) => {
  const [method, setMethod] = useState(null);

  const handlePayment = () => {
    // Later: handle actual payment logic
    alert(`Proceeding to pay Sh ${plan.price} with ${method}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-sm w-full">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          Pay for {plan.label} - Sh {plan.price}
        </h3>

        <div className="space-y-3 mb-4">
          <label className="block">
            <input
              type="radio"
              name="payment"
              value="Mpesa"
              onChange={(e) => setMethod(e.target.value)}
              className="mr-2"
            />
            <span className="text-gray-800 dark:text-gray-300">M-Pesa</span>
          </label>

          <label className="block">
            <input
              type="radio"
              name="payment"
              value="PayPal"
              onChange={(e) => setMethod(e.target.value)}
              className="mr-2"
            />
            <span className="text-gray-800 dark:text-gray-300">PayPal (USD)</span>
          </label>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handlePayment}
            disabled={!method}
            className={`px-4 py-2 rounded ${
              method ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-400 text-gray-200 cursor-not-allowed"
            }`}
          >
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
