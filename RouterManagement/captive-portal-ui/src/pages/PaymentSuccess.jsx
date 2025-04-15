import { useState } from "react";

export default function PaymentSuccess() {
  const [showCredits, setShowCredits] = useState(false);

  return (
    <div className="min-h-screen bg-white text-gray-800">

      {/* ========== HEADER WITH ACTION BUTTONS ========== */}
      <header className="w-full flex items-center justify-between px-6 py-4 border-b">
        <div className="text-xl font-semibold text-gray-800">
          {/* TODO: Replace "PortalConnect" with dynamic logo or site name from config */}
          PortalConnect
        </div>
        <div className="flex gap-4">
          <button
            // TODO: Replace with actual route or function to open purchase screen/modal
            aria-label="Buy more internet access"
            className="bg-purple-500 hover:bg-purple-600 text-white font-medium px-6 py-3 rounded text-base"
          >
            Buy More
          </button>
          <button
            // This toggles a credits panel locally. Replace content with live data below.
            onClick={() => setShowCredits(!showCredits)}
            aria-label="View remaining credits and session time"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-6 py-3 rounded text-base"
          >
            View Credits
          </button>
        </div>
      </header>

      {/* ========== SESSION STATUS BANNER ========== */}
      <div className="bg-yellow-50 text-yellow-800 text-sm p-4 text-center">
        {/* TODO: Replace hardcoded session time with dynamic data from user/session state */}
        You’re currently connected. Your session expires in 3 hours.
      </div>

      {/* ========== MAIN CONFIRMATION MESSAGE ========== */}
      <main className="flex flex-col items-center justify-start px-4 py-12">
        <div className="max-w-2xl w-full text-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">
            SUCCESS! YOUR PAYMENT HAS BEEN COMPLETED
          </h1>

          {/* TODO: Adjust instructions below if flow changes or if wording needs localizing */}
          <ol className="text-left text-base md:text-lg mb-10 space-y-3 px-4">
            <li>
              1. Use the{" "}
              <span className="font-semibold text-purple-600">“View Credits”</span>{" "}
              button above to check your remaining time and access status.
            </li>
            <li>
              2. Use the{" "}
              <span className="font-semibold text-purple-600">“Buy More”</span>{" "}
              button if you’d like to top up your access.
            </li>
          </ol>

          {/* ========== CONDITIONAL CREDITS PANEL ========== */}
          {showCredits && (
            <div className="bg-gray-100 border border-gray-300 rounded p-6 text-left mb-8 text-sm text-gray-700 shadow-inner">
              {/* TODO: Replace with real data fetched from backend or state (e.g. time left, status) */}
              <p className="mb-2">
                <strong>Remaining Time:</strong> 3 hours 12 minutes
              </p>
              <p className="mb-2">
                <strong>Credits Used:</strong> 2 out of 5
              </p>
              <p className="mb-2">
                <strong>Status:</strong>{" "}
                <span className="text-green-600 font-medium">Active</span>
              </p>
            </div>
          )}

          {/* ========== OPTIONAL: LAST PAYMENT SUMMARY ========== */}
          <div className="bg-white border border-gray-200 rounded p-4 mb-10 text-sm text-left shadow-sm">
            <h2 className="font-semibold text-gray-700 mb-2">Last Payment Summary</h2>
            {/* TODO: Populate this section dynamically from the payment response or backend */}
            <p>Amount: $10</p>
            <p>Date: April 15, 2025</p>
            <p>Plan: 5-hour access</p>
          </div>

          {/* ========== NEXT ACTION LINKS (NAVIGATION) ========== */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-4">What would you like to do next?</h2>
            <div className="flex flex-col md:flex-row justify-center items-center gap-6 text-blue-600 underline text-base">
              {/* TODO: Link to appropriate pages/routes */}
              <a href="#">Check My Access Status</a>
              <a href="#">Top Up My Access</a>
              <a href="#">Talk to Support</a>
            </div>
          </div>
        </div>
      </main>

      {/* ========== FLOATING HELP BUTTON ========== */}
      {/* TODO: Connect to your support/chat module or redirect to help center */}
      <button
        aria-label="Help and support"
        className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded shadow-md text-sm hover:bg-blue-700"
      >
        Need Help?
      </button>
    </div>
  );
}
