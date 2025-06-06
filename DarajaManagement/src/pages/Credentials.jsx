import React, { useState } from 'react';
import { Network, Eye, EyeOff } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Credentials() {
  const [showPasskey, setShowPasskey] = useState(false);
  const currentYear = new Date().getFullYear();

  const handleSaveCredentials = () => {
    console.log('Credentials saved! (This is a placeholder action)');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800 font-sans">
      {/* Full-width Header */}
      <Header />

      {/* Main Form Section */}
      <main className="flex-grow w-full max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-2">Manage API Credentials</h1>
        <p className="text-gray-600 mb-8 text-sm">
          Provide your Safaricom Daraja API keys and environment details. These will be used securely for transactions.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveCredentials();
          }}
          className="space-y-6"
        >
          {/* Consumer Key */}
          <div>
            <label htmlFor="consumerKey" className="block text-sm font-medium text-gray-700 mb-1">
              Consumer Key
            </label>
            <input
              type="text"
              id="consumerKey"
              placeholder="Enter Consumer Key"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Consumer Secret */}
          <div>
            <label htmlFor="consumerSecret" className="block text-sm font-medium text-gray-700 mb-1">
              Consumer Secret
            </label>
            <div className="relative">
              <input
                type={showPasskey ? 'text' : 'password'}
                id="consumerSecret"
                placeholder="Enter Consumer Secret"
                className="w-full p-3 border border-gray-300 rounded-lg pr-10 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowPasskey(!showPasskey)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                aria-label={showPasskey ? 'Hide secret' : 'Show secret'}
              >
                {showPasskey ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Shortcode */}
          <div>
            <label htmlFor="shortcode" className="block text-sm font-medium text-gray-700 mb-1">
              Shortcode
            </label>
            <input
              type="text"
              id="shortcode"
              placeholder="Enter Shortcode"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Passkey */}
          <div>
            <label htmlFor="passkey" className="block text-sm font-medium text-gray-700 mb-1">
              Passkey
            </label>
            <div className="relative">
              <input
                type={showPasskey ? 'text' : 'password'}
                id="passkey"
                placeholder="Enter Passkey"
                className="w-full p-3 border border-gray-300 rounded-lg pr-10 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowPasskey(!showPasskey)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                aria-label={showPasskey ? 'Hide passkey' : 'Show passkey'}
              >
                {showPasskey ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Environment and Service Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="environment" className="block text-sm font-medium text-gray-700 mb-1">
                Environment
              </label>
              <select
                id="environment"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              >
                <option value="">Select environment</option>
                <option value="sandbox">Sandbox</option>
                <option value="production">Production</option>
              </select>
            </div>
            <div>
              <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-1">
                Service Type
              </label>
              <select
                id="serviceType"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              >
                <option value="">Select service type</option>
                <option value="c2b">C2B</option>
                <option value="b2c">B2C</option>
                <option value="b2b">B2B</option>
              </select>
            </div>
          </div>

          {/* Submit */}
          <div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white p-3 rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Save Credentials
            </button>
          </div>
        </form>
      </main>
      {/* Footer */}
      <Footer/>  
    </div>
  );
}

export default Credentials;
