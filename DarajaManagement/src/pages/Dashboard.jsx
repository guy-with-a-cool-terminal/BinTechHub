import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle,
  XCircle,
  Hourglass,
  ChevronRight,
  Rocket,
  CreditCard,
  Users,
  TrendingUp
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Dashboard() {
  // State for credentials to allow editing
  const [credentials, setCredentials] = useState({
    sandbox: {
      consumerKey: '****************GL',
      consumerSecret: '****************',
      shortcode: '600987',
      passkey: '************',
      lastUpdated: '2023-10-26 14:30'
    },
    live: {
      consumerKey: '****************QL',
      consumerSecret: '****************AA',
      shortcode: '900123',
      passkey: '************',
      lastUpdated: '2023-11-01 09:15'
    }
  });

  // Track which credential is being edited: null, 'sandbox', or 'live'
  const [editing, setEditing] = useState(null);
  // Temporary state to hold form changes while editing
  const [tempData, setTempData] = useState({});
  // Validation errors state
  const [errors, setErrors] = useState({});

  // Ref to auto-focus first input when editing
  const firstInputRef = useRef(null);

  // Transactions (unchanged)
  const transactions = [
    { id: 1, txnId: 'TXN20231...', phone: '254712345678', amount: 150.0, status: 'Success', date: '2023-11-04 10:00 AM' },
    { id: 2, txnId: 'TXN20232...', phone: '254723456789', amount: 250.0, status: 'Pending', date: '2023-11-04 02:20 PM' },
    { id: 3, txnId: 'TXN20233...', phone: '254701234567', amount: 400.0, status: 'Failed', date: '2023-11-03 09:05 AM' },
    { id: 4, txnId: 'TXN20234...', phone: '254700123223', amount: 1000.0, status: 'Success', date: '2023-11-03 08:30 AM' },
    { id: 5, txnId: 'TXN20235...', phone: '254733455566', amount: 75.0, status: 'Success', date: '2023-11-03 11:00 AM' },
    { id: 6, txnId: 'TXN20236...', phone: '254744556677', amount: 380.0, status: 'Failed', date: '2023-10-31 03:00 PM' }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Success':
        return <CheckCircle className="w-5 h-5 text-green-500 mr-2" />;
      case 'Failed':
        return <XCircle className="w-5 h-5 text-red-500 mr-2" />;
      case 'Pending':
        return <Hourglass className="w-5 h-5 text-yellow-500 mr-2" />;
      default:
        return null;
    }
  };

  // Handle form field changes when editing
  const handleChange = (section, field, value) => {
    setTempData(prev => ({ ...prev, [field]: value }));
    // Remove error on change if field is valid
    if (value.trim() !== '') {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Start editing a section (sandbox or live)
  const startEdit = (section) => {
    setEditing(section);
    setTempData({ ...credentials[section] });
    setErrors({});
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditing(null);
    setTempData({});
    setErrors({});
  };

  // Focus first input when editing starts
  useEffect(() => {
    if (editing && firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, [editing]);

  // Validation function for the credentials form
  const validate = () => {
    const newErrors = {};
    ['consumerKey', 'consumerSecret', 'shortcode', 'passkey'].forEach((field) => {
      if (!tempData[field] || tempData[field].trim() === '') {
        newErrors[field] = `${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required.`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save edited data
  const saveEdit = () => {
    if (!validate()) {
      return;
    }
    setCredentials(prev => ({
      ...prev,
      [editing]: {
        ...tempData,
        lastUpdated: new Date().toISOString().slice(0, 16).replace('T', ' ')
      }
    }));
    setEditing(null);
    setTempData({});
    setErrors({});
    alert(`${editing.charAt(0).toUpperCase() + editing.slice(1)} credentials saved successfully.`);
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col font-sans">
      <Header />

      <main className="flex-grow w-full max-w-6xl mx-auto px-6 py-12 space-y-12">
        {/* Title */}
        <div>
          <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
          <p className="text-gray-600 text-sm">Manage credentials and monitor transaction activity</p>
        </div>

        {/* Credentials + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Credentials Section */}
          <section className="lg:col-span-2 space-y-8">
            <h2 className="text-xl font-semibold text-gray-800">Your Daraja Credentials</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {['sandbox', 'live'].map((section) => {
                const data = credentials[section];
                const isEditing = editing === section;

                return (
                  <div key={section} className="border border-gray-200 rounded-lg p-6 relative">
                    <h3 className="text-lg font-semibold text-gray-700 capitalize mb-2">
                      {section} Credentials
                    </h3>
                    <p className="text-xs text-gray-500 mb-5">
                      Last Updated: {data.lastUpdated}
                    </p>

                    {isEditing ? (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          saveEdit();
                        }}
                        className="space-y-4"
                        noValidate
                      >
                        {['consumerKey', 'consumerSecret', 'shortcode', 'passkey'].map((field, idx) => (
                          <div key={field}>
                            <label
                              htmlFor={`${section}-${field}`}
                              className="block text-gray-700 text-sm font-medium mb-1"
                            >
                              {field
                                .replace(/([A-Z])/g, ' $1')
                                .replace(/^./, (str) => str.toUpperCase())}
                              :
                            </label>
                            <input
                              id={`${section}-${field}`}
                              type={field === 'consumerSecret' || field === 'passkey' ? 'password' : 'text'}
                              value={tempData[field]}
                              onChange={(e) => handleChange(section, field, e.target.value)}
                              className={`w-full border rounded-md p-2 text-sm ${
                                errors[field] ? 'border-red-500' : 'border-gray-300'
                              }`}
                              aria-invalid={errors[field] ? 'true' : 'false'}
                              aria-describedby={errors[field] ? `${section}-${field}-error` : undefined}
                              required
                              ref={idx === 0 ? firstInputRef : null}
                              autoComplete="off"
                            />
                            {errors[field] && (
                              <p
                                id={`${section}-${field}-error`}
                                className="text-red-600 text-xs mt-1"
                              >
                                {errors[field]}
                              </p>
                            )}
                          </div>
                        ))}

                        <div className="flex space-x-4">
                          <button
                            type="submit"
                            disabled={Object.keys(errors).length > 0}
                            className={`flex-1 py-2 rounded-md text-sm text-white ${
                              Object.keys(errors).length > 0 ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                            }`}
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm('Discard changes?')) cancelEdit();
                            }}
                            className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <div className="text-sm text-gray-700 space-y-3">
                          <p>
                            <strong>Consumer Key:</strong> {data.consumerKey}
                          </p>
                          <p>
                            <strong>Consumer Secret:</strong> {data.consumerSecret}
                          </p>
                          <p>
                            <strong>Shortcode:</strong> {data.shortcode}
                          </p>
                          <p>
                            <strong>Passkey:</strong> {data.passkey}
                          </p>
                        </div>
                        <div className="flex space-x-3 mt-5">
                          <button
                            onClick={() => startEdit(section)}
                            className="flex-1 bg-gray-100 text-gray-800 py-2 rounded-md hover:bg-gray-200 text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => alert(`Delete ${section} credentials not implemented.`)}
                            className="flex-1 bg-red-100 text-red-700 py-2 rounded-md hover:bg-red-200 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Quick Actions */}
          <section className="space-y-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Quick Actions</h2>
            <div className="flex flex-col space-y-6">
              <Link
                to="/stkpush"
                className="flex items-center border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
              >
                <Rocket className="w-12 h-12 text-indigo-600 mr-6" />
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg mb-1">Initiate STK Push</h3>
                  <p className="text-gray-600 text-sm mb-3 max-w-xs">
                    Send STK Push requests instantly.
                  </p>
                  <div className="inline-block bg-indigo-600 text-white py-2 px-5 rounded-md hover:bg-indigo-700 text-sm cursor-pointer">
                    Start STK Push
                  </div>
                </div>
              </Link>

              <Link
                to="/credentials"
                className="flex items-center border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
              >
                <CreditCard className="w-12 h-12 text-indigo-600 mr-6" />
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg mb-1">Manage Credentials</h3>
                  <p className="text-gray-600 text-sm mb-3 max-w-xs">
                    Add or edit your API credentials.
                  </p>
                  <div className="inline-block bg-indigo-600 text-white py-2 px-5 rounded-md hover:bg-indigo-700 text-sm cursor-pointer">
                    Add/Edit Credentials
                  </div>
                </div>
              </Link>
            </div>
          </section>
        </div>

        {/* Transactions + Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Recent Transactions */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Recent STK Transactions</h2>
            <div className="space-y-5">
              {transactions.map((txn) => (
                <div
                  key={txn.id}
                  className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 transition"
                >
                  <div className="flex items-center">
                    {getStatusIcon(txn.status)}
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {txn.txnId}{' '}
                        <span className="ml-2 text-gray-600">{txn.status}</span>
                      </p>
                      <p className="text-sm text-gray-600">
                        {txn.phone} · KES {txn.amount.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">{txn.date}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              ))}
            </div>
          </section>

          {/* Overview Metrics */}
         <section className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Overview</h2>
            <div className="space-y-6">
              <div className="border border-gray-200 rounded-lg p-6 flex items-center">
                <Users className="w-10 h-10 text-indigo-600 mr-5" />
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">1,245</h3>
                  <p className="text-sm text-gray-600">Total STK Transactions</p>
                  <p className="text-xs text-gray-500">Since portal launch</p>
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-6 flex items-center">
                <TrendingUp className="w-10 h-10 text-green-600 mr-5" />
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">98.5%</h3>
                  <p className="text-sm text-gray-600">Success rate (last 30 days)</p>
                  <p className="text-xs text-green-600">↑ 2.7% from last month</p>
                </div>
              </div>
            </div>
          </section>

        </div>
        <section className="bg-gray-50 border border-gray-200 rounded-lg p-8 flex items-start gap-6">
          <div className="bg-gray-200 rounded-full w-12 h-12 flex items-center justify-center text-gray-600 font-bold text-2xl select-none">
            ?
          </div>
          <div>
            <h2 className="font-semibold text-gray-800 mb-2">Need Help Getting Started?</h2>
            <p className="text-sm text-gray-600 max-w-xl">
              See our{' '}
              <a href="#" className="text-indigo-600 hover:underline">
                API documentation
              </a>
              , or explore{' '}
              <a href="#" className="text-indigo-600 hover:underline">
                STK Push guides
              </a>
              . For support, visit our{' '}
              <a href="#" className="text-indigo-600 hover:underline">
                Help Center
              </a>
              .
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Dashboard;
