export default function PaymentSuccess() {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 text-center">
        <div className="text-green-500 mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-20 w-20"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Success!</h1>
        <p className="text-lg text-gray-600 mb-6">
          Your payment has been received
        </p>
        <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded">
          Go back to Home
        </button>
      </div>
    );
  }
  