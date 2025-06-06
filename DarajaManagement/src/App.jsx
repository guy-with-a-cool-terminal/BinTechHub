import React from 'react';
import { Lock, Zap, Shield, Globe, CreditCard, Users } from 'lucide-react';
import LandingPageHeader from './components/LandingPageHeader';
import Footer from './components/Footer';
import { Link } from 'react-router-dom';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center font-sans text-gray-800 scroll-smooth">
      {/* Header */}
      <LandingPageHeader />

      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-20 px-4 md:px-8 flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-white opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-300 opacity-10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>

        <div className="max-w-4xl z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 animate-fade-in-down">
            Simplify Your M-Pesa API Integrations
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-90 animate-fade-in delay-200">
            Securely manage Daraja API credentials and streamline your STK Push transactions with ease.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in delay-400">
            <Link
              to="/signup"
              className="bg-white text-indigo-700 font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300 ease-in-out transform hover:scale-105"
            >
              Get Started Free
            </Link>
            <a
              href="#features"
              className="border-2 border-white text-white font-bold py-3 px-8 rounded-lg hover:bg-white hover:text-indigo-700 transition duration-300 ease-in-out transform hover:scale-105"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="w-full max-w-5xl mx-auto py-16 px-4 md:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">About Us</h2>
        <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
          Daraja Credentials Manager is designed for developers, startups, and businesses looking to integrate M-Pesa APIs without the usual complexity.
          Whether you're working in production or testing in sandbox, our tools help you manage keys securely, trigger STK Push transactions, and monitor usage.
          Built with modern architecture, it's the ideal solution for efficient mobile payments in East Africa.
        </p>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full max-w-7xl mx-auto py-16 px-4 md:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
          Why Choose Daraja Credentials Manager?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <Lock className="w-12 h-12 text-indigo-600 mb-4" />,
              title: 'Enhanced Security',
              desc: 'Keep your sensitive API keys and passkeys encrypted and safe, eliminating the risk of exposure.'
            },
            {
              icon: <Zap className="w-12 h-12 text-green-600 mb-4" />,
              title: 'Rapid STK Push',
              desc: 'Initiate M-Pesa STK Push transactions swiftly with a user-friendly interface.'
            },
            {
              icon: <Shield className="w-12 h-12 text-rose-600 mb-4" />,
              title: 'Reliable & Robust',
              desc: 'Built on a stable and scalable architecture to ensure your operations are always smooth.'
            },
            {
              icon: <Globe className="w-12 h-12 text-blue-600 mb-4" />,
              title: 'Any Environment',
              desc: 'Seamlessly switch between sandbox and live environments without configuration hassle.'
            },
            {
              icon: <CreditCard className="w-12 h-12 text-purple-600 mb-4" />,
              title: 'Transaction Overview',
              desc: 'Monitor your recent STK Push transactions and analyze their status at a glance.'
            },
            {
              icon: <Users className="w-12 h-12 text-orange-600 mb-4" />,
              title: 'User Friendly',
              desc: 'An intuitive and clean interface designed for developers and businesses alike.'
            }
          ].map((f, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center text-center transition-transform duration-300 hover:scale-105 hover:shadow-xl"
            >
              {f.icon}
              <h3 className="text-xl font-semibold text-gray-800 mb-3">{f.title}</h3>
              <p className="text-gray-600 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="w-full bg-indigo-700 text-white py-16 px-4 md:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-lg md:text-xl mb-8 opacity-90">
          Join hundreds of businesses simplifying their M-Pesa integrations.
        </p>
        <Link
          to="/signup"
          className="bg-white text-indigo-700 font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300 ease-in-out transform hover:scale-105"
        >
          Create Your Account Now
        </Link>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
