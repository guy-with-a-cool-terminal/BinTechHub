import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion'; // Import framer-motion for animations
import {
  Lock,
  Settings,
  ShieldCheck,
  FolderKanban,
  Smartphone,
  Sparkles,
} from 'lucide-react';

const App = () => {
  const features = [
    {
      title: "End-to-End Encryption",
      desc: "All your passwords are encrypted and stored securely.",
      icon: <Lock className="w-6 h-6 text-indigo-500" />,
    },
    {
      title: "Strong Password Generator",
      desc: "Generate complex, secure passwords with one click.",
      icon: <Settings className="w-6 h-6 text-indigo-500" />,
    },
    {
      title: "GitHub Repo Scanning",
      desc: "Automatically scan your repos for exposed secrets.",
      icon: <ShieldCheck className="w-6 h-6 text-indigo-500" />,
    },
    {
      title: "Easy Password Management",
      desc: "Edit, organize, and store credentials effortlessly.",
      icon: <FolderKanban className="w-6 h-6 text-indigo-500" />,
    },
    {
      title: "Responsive Design",
      desc: "Use SecureVault on desktop, tablet, or phone.",
      icon: <Smartphone className="w-6 h-6 text-indigo-500" />,
    },
    {
      title: "Clean, Modern UI",
      desc: "A sleek and intuitive interface that just works.",
      icon: <Sparkles className="w-6 h-6 text-indigo-500" />,
    },
  ];

  return (
    <div className="bg-white min-h-screen flex flex-col justify-between font-inter">
      {/* Header */}
      <header className="px-6 py-4 flex justify-between items-center border-b">
        <div className="flex items-center space-x-2">
          <div className="w-9 h-9 bg-indigo-500 text-white flex items-center justify-center rounded-full text-lg font-bold">
            🔐
          </div>
          <span className="text-xl font-semibold text-indigo-600">SecureVault</span>
        </div>
        <div className="space-x-4">
          <Link
            to="/login"
            className="text-gray-600 hover:text-indigo-600 font-medium transition"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <motion.main
        className="flex flex-col items-center text-center px-6 py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 max-w-2xl">
          Secure Passwords. Smart Scanning.
        </h1>
        <p className="text-gray-600 text-lg mb-8 max-w-xl">
          SecureVault protects your passwords with strong encryption, generates powerful credentials, and scans GitHub for exposed secrets.
        </p>
        <Link
          to="/signup"
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg text-base font-medium shadow-lg transition hover:scale-105"
        >
          Create Your Vault
        </Link>
      </motion.main>

      {/* Features Section */}
      <motion.section
        className="bg-gray-50 py-16 px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.0, delay: 0.2 }}
      >
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-10">
            Why SecureVault?
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-lg shadow hover:shadow-md transition text-left hover:scale-105"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * index, duration: 0.6 }}
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="font-semibold text-lg text-indigo-600 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-12">
            <Link
              to="/signup"
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg text-base font-medium shadow-lg transition hover:scale-105"
            >
              Get Started for Free
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        className="text-center text-sm text-gray-500 py-6 border-t"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        © {new Date().getFullYear()} SecureVault. All rights reserved.
      </motion.footer>
    </div>
  );
};

export default App;
