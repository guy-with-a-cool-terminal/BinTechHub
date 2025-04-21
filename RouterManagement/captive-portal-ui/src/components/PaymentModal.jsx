import React, { useState } from "react";
import { sendSTKPush } from "../api/api";

const PaymentModal = ({ plan, onClose }) => {
  const [method, setMethod] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false); // New state to handle loading
  const [toast, setToast] = useState(""); // New state to handle toast notifications

  const handlePayment = async () => {
    if (!method) return;

    if (method === "Mpesa") {
      if (!phoneNumber || !/^\d{10,12}$/.test(phoneNumber)) {
        setToast("Please enter a valid phone number.");
        return;
      }

      // Convert 07xxxxxxxx to 2547xxxxxxxx
      const formattedPhone = phoneNumber.startsWith("254")
        ? phoneNumber
        : phoneNumber.replace(/^0/, "254");

      try {
        setLoading(true); // Show loading spinner
        const res = await sendSTKPush(formattedPhone, plan.price);
        setToast("STK Push sent! Check your phone.");
        onClose();
      } catch (error) {
        setToast(`Payment failed: ${error.message}`);
      } finally {
        setLoading(false); // Hide loading spinner
      }
    } else {
      setToast(`Proceeding to pay Sh ${plan.price} with ${method}`);
      onClose();
    }
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
            <span className="text-gray-800 dark:text-gray-300">M-Pesa 💸</span>
          </label>

          <label className="block">
            <input
              type="radio"
              name="payment"
              value="PayPal"
              onChange={(e) => setMethod(e.target.value)}
              className="mr-2"
            />
            <span className="text-gray-800 dark:text-gray-300">Visa 💳</span>
          </label>
        </div>

        {method === "Mpesa" && (
          <div className="mb-4 p-4 border rounded bg-gray-50 dark:bg-gray-700">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
              Enter your phone number:
            </label>
            <input
              type="tel"
              placeholder="e.g. 07XXXXXXXX"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-800 dark:text-white"
            />
          </div>
        )}

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handlePayment}
            disabled={!method || (method === "Mpesa" && !phoneNumber) || loading}
            className={`px-4 py-2 rounded ${
              method && (method !== "Mpesa" || phoneNumber)
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-400 text-gray-200 cursor-not-allowed"
            }`}
          >
            {loading ? (
              <span className="spinner-border animate-spin"></span> // A simple spinner icon
            ) : (
              "Pay Now"
            )}
          </button>
        </div>

        {toast && (
          <div className="toast-notification bg-gray-800 text-white p-4 mt-4 rounded">
            {toast}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
