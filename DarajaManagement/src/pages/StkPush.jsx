import React, { useState, useEffect } from 'react';
import { Network, Phone, DollarSign, Filter } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

function StkPush() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [submitMessage, setSubmitMessage] = useState(null); // { type: 'success' | 'error', text: string }
  const [filterStatus, setFilterStatus] = useState('');
  const [displayCount, setDisplayCount] = useState(3);

  // Placeholder transactions data
  const transactions = [
    { id: 1, phone: '254701234567', amount: 1500, type: 'Paybill', date: '2024-07-20 10:30 AM', status: 'Success' },
    { id: 2, phone: '254712345678', amount: 500, type: 'Buy Goods', date: '2024-07-19 03:15 PM', status: 'Failed' },
    { id: 3, phone: '254723456789', amount: 2000, type: 'Paybill', date: '2024-07-18 11:00 AM', status: 'Success' },
    { id: 4, phone: '254734567890', amount: 750, type: 'Buy Goods', date: '2024-07-18 09:45 AM', status: 'Pending' },
    { id: 5, phone: '254745678901', amount: 1200, type: 'Paybill', date: '2024-07-17 06:00 PM', status: 'Success' },
  ];

  // Form validation function
  const validateForm = () => {
    const errors = {};

    // Phone validation: Kenyan phone number starts with 2547 and 12 digits total
    if (!/^2547\d{8}$/.test(phoneNumber)) {
      errors.phoneNumber = 'Enter a valid Kenyan phone number starting with 2547 and 12 digits.';
    }

    // Amount validation: positive number and max limit (e.g. 100000)
    const amt = Number(amount);
    if (!amt || amt <= 0) {
      errors.amount = 'Amount must be a positive number.';
    } else if (amt > 100000) {
      errors.amount = 'Amount must not exceed 100,000 Ksh.';
    }

    // Service type validation
    if (!serviceType) {
      errors.serviceType = 'Please select a service type.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submit
  const handleSubmitTransaction = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSubmitMessage(null);

    try {
      // Simulate API call delay
      await new Promise((r) => setTimeout(r, 1500));

      // In a real app, send data to API here and handle response
      console.log('STK Push Request:', { phoneNumber, amount, serviceType });

      setSubmitMessage({ type: 'success', text: 'STK Push transaction submitted successfully!' });
      setPhoneNumber('');
      setAmount('');
      setServiceType('');
      setFormErrors({});
    } catch (error) {
      setSubmitMessage({ type: 'error', text: 'Failed to submit transaction. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case 'Success':
        return 'bg-green-100 text-green-700';
      case 'Failed':
        return 'bg-red-100 text-red-700';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Mask phone number display (e.g. 2547***4567)
  const maskPhone = (phone) => {
    if (phone.length === 12) {
      return `${phone.slice(0, 4)}***${phone.slice(7)}`;
    }
    return phone;
  };

  // Filter and paginate transactions
  const filteredTransactions = transactions
    .filter((t) => (filterStatus ? t.status === filterStatus : true))
    .slice(0, displayCount);

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800 font-sans">
      {/* Header */}
      <Header />

      {/* Main content */}
      <main className="flex-grow w-full max-w-7xl mx-auto p-4 py-8 flex flex-col lg:flex-row items-start justify-center gap-8">
        {/* Left: STK Push form */}
        <section
          className="bg-white p-6 sm:p-8 rounded-xl shadow-lg w-full lg:w-1/2 max-w-md"
          aria-labelledby="stkpush-form-heading"
        >
          <h2 id="stkpush-form-heading" className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            Initiate STK Push
          </h2>
          <p className="text-gray-600 mb-6 text-sm">
            Effortlessly send funds via M-Pesa STK Push. Fill in the details below to complete your transaction securely.
          </p>

          <form onSubmit={handleSubmitTransaction} className="space-y-4" noValidate>
            {/* Phone Number */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <Phone className="h-5 w-5" />
                </span>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="e.g., 2547XXXXXXXXX"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  aria-invalid={!!formErrors.phoneNumber}
                  aria-describedby={formErrors.phoneNumber ? 'phone-error' : undefined}
                  className={`w-full p-3 pl-10 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-800 transition duration-150 ease-in-out ${
                    formErrors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={loading}
                />
              </div>
              {formErrors.phoneNumber && (
                <p id="phone-error" className="text-red-600 text-xs mt-1">
                  {formErrors.phoneNumber}
                </p>
              )}
            </div>

            {/* Amount */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                Amount (Ksh)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <DollarSign className="h-5 w-5" />
                </span>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  placeholder="e.g., 1500"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  aria-invalid={!!formErrors.amount}
                  aria-describedby={formErrors.amount ? 'amount-error' : undefined}
                  className={`w-full p-3 pl-10 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-800 transition duration-150 ease-in-out ${
                    formErrors.amount ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={loading}
                  min={1}
                  max={100000}
                />
              </div>
              {formErrors.amount && (
                <p id="amount-error" className="text-red-600 text-xs mt-1">
                  {formErrors.amount}
                </p>
              )}
            </div>

            {/* Service Type */}
            <div>
              <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-1">
                Service Type
              </label>
              <select
                id="serviceType"
                name="serviceType"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                aria-invalid={!!formErrors.serviceType}
                aria-describedby={formErrors.serviceType ? 'service-error' : undefined}
                className={`w-full p-3 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-800 bg-white appearance-none pr-8 transition duration-150 ease-in-out ${
                  formErrors.serviceType ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={loading}
              >
                <option value="">Select a service type</option>
                <option value="Paybill">Paybill</option>
                <option value="Buy Goods">Buy Goods</option>
                <option value="Airtime">Airtime</option>
              </select>
              <p className="text-gray-400 text-xs mt-1 italic">
                Choose the type of service for your transaction.
              </p>
              {formErrors.serviceType && (
                <p id="service-error" className="text-red-600 text-xs mt-1">
                  {formErrors.serviceType}
                </p>
              )}
            </div>

            {/* Submit and Back */}
            <div className="flex justify-between items-center mt-6">
              <Link to="/dashboard" className="text-indigo-600 hover:underline text-sm font-medium">
                &larr; Back to Dashboard
              </Link>
              <button
                type="submit"
                disabled={loading || Object.keys(formErrors).length > 0}
                className={`bg-indigo-600 text-white p-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 ease-in-out ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
                aria-busy={loading}
              >
                {loading ? 'Submitting...' : 'Submit Transaction'}
              </button>
            </div>

            {/* Submission message */}
            {submitMessage && (
              <p
                role="alert"
                className={`mt-4 font-medium ${
                  submitMessage.type === 'success' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {submitMessage.text}
              </p>
            )}
          </form>
        </section>

        {/* Right: Transactions list */}
        <section
          className="bg-white p-6 sm:p-8 rounded-xl shadow-lg w-full lg:w-1/2 max-w-md lg:max-w-none"
          aria-labelledby="transactions-heading"
        >
          <h2 id="transactions-heading" className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
            <Filter className="w-5 h-5 text-indigo-600" />
            Recent Transactions
          </h2>
          <p className="text-gray-600 mb-6 text-sm">
            A brief overview of your last few STK Push operations.
          </p>

          {/* Filter by status */}
          <div className="mb-4 flex items-center gap-3">
            <label htmlFor="filterStatus" className="text-sm font-medium text-gray-700">
              Filter by Status:
            </label>
            <select
              id="filterStatus"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="p-2 border border-gray-300 rounded-md text-gray-800"
            >
              <option value="">All</option>
              <option value="Success">Success</option>
              <option value="Failed">Failed</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          {filteredTransactions.length === 0 ? (
            <p className="text-gray-500 italic">No transactions to display.</p>
          ) : (
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-indigo-50 transition-colors cursor-default"
                  tabIndex={0}
                  aria-label={`Transaction to ${maskPhone(transaction.phone)} for Ksh ${transaction.amount.toLocaleString()}, status ${transaction.status}`}
                >
                  <div className="flex-1">
                    <p className="text-gray-800 font-semibold">{maskPhone(transaction.phone)}</p>
                    <p className="text-gray-600 text-sm">
                      <span className="font-bold">Ksh {transaction.amount.toLocaleString()}</span> &bull; {transaction.type} &bull; {transaction.date}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClasses(transaction.status)}`}
                    aria-label={`Status: ${transaction.status}`}
                  >
                    {transaction.status}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Load More button */}
          {displayCount < transactions.length && (
            <button
              onClick={() => setDisplayCount((count) => count + 3)}
              className="mt-6 block mx-auto bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
            >
              Load More
            </button>
          )}
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default StkPush;
