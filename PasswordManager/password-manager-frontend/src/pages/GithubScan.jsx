import React, { useState } from "react";
import Header from "../components/Header";
import { HiOutlineSearchCircle, HiCheckCircle, HiExclamationCircle } from "react-icons/hi";
import { motion } from "framer-motion";

// Sample data for repositories and results
const repositories = [
  {
    title: "Frontend Repo",
    lastScanned: "2 days ago",
    description: "Active repository for frontend development",
    image: "https://images.unsplash.com/photo-1581090700227-1e8e6f7f7f70",
  },
  {
    title: "Backend Repo",
    lastScanned: "5 days ago",
    description: "Repository for backend services",
    image: "https://images.unsplash.com/photo-1603415526960-f8fba72729d0",
  },
  {
    title: "Deploy Repo",
    lastScanned: "7 days ago",
    description: "Deployment repository for cloud services",
    image: "https://images.unsplash.com/photo-1573497491208-6b1acb260507",
  },
];

const results = [
  {
    name: "Repo A",
    status: "Scan completed successfully",
    issues: "Detected 5 vulnerabilities",
    image: "https://images.unsplash.com/photo-1587982335078-795dfb7cc270",
  },
  {
    name: "Repo B",
    status: "Scan completed successfully",
    issues: "No issues found",
    image: "https://images.unsplash.com/photo-1610034829906-fdfd4db6f58d",
  },
  {
    name: "Repo C",
    status: "Scan completed successfully",
    issues: "10 critical issues",
    image: "https://images.unsplash.com/photo-1618221195710-d4c7cc2d9e8b",
  },
  {
    name: "Repo D",
    status: "Scan completed successfully",
    issues: "2 warnings detected",
    image: "https://images.unsplash.com/photo-1583281952164-d7d5d78b6c4e",
  },
];

const GithubScan = () => {
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [repoLoading, setRepoLoading] = useState(false);
  const [reposToScan, setReposToScan] = useState([]);

  // Simulate the process of selecting a GitHub repo
  const handleSelectRepo = () => {
    setRepoLoading(true);
    setTimeout(() => {
      const newRepo = {
        name: `Repo ${reposToScan.length + 1}`,
        description: `This is an active repository for scan ${reposToScan.length + 1}`,
        image: "https://images.unsplash.com/photo-1581090700227-1e8e6f7f7f70",
      };
      setReposToScan([...reposToScan, newRepo]);
      setRepoLoading(false);
    }, 2000); // Simulating a 2s delay for loading repo
  };

  const handleDeselectRepo = (repoIndex) => {
    setReposToScan(reposToScan.filter((_, idx) => idx !== repoIndex));
  };

  return (
    <div className="bg-white min-h-screen">
      <Header />
      <main className="px-6 md:px-12 lg:px-24 py-10 space-y-10">
        {/* Intro Text */}
        <p className="text-gray-700 text-base md:text-lg leading-relaxed tracking-wide">
          Automatically detect and remediate secrets in your code with our GitHub integration.
        </p>

        {/* Repo Selection Section */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Select a repository to scan</h2>
          <motion.div
            className="bg-white border rounded-xl p-6 shadow-md cursor-pointer"
            whileHover={{
              scale: 1.02,
              boxShadow: "0 12px 20px rgba(0, 0, 0, 0.1)",
              backgroundColor: "#f7fafc",
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={handleSelectRepo}
          >
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900">Select Repo to Scan</h3>
              <p className="text-sm text-gray-500 mt-2">Click to load and scan your repository from GitHub</p>
            </div>
          </motion.div>
        </section>

        {/* Loading state when the user is selecting a repo */}
        {repoLoading && (
          <section>
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600"></div>
              <p className="ml-4 text-lg text-gray-600">Loading your repository...</p>
            </div>
          </section>
        )}

        {/* Dynamically added Repo Cards */}
        {reposToScan.length > 0 && (
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Scanned Repositories</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reposToScan.map((repo, idx) => (
                <motion.div
                  key={idx}
                  className="bg-white border rounded-xl p-5 shadow-md transition-all ease-in-out duration-300"
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 12px 20px rgba(0, 0, 0, 0.1)",
                    backgroundColor: "#f7fafc",
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <div className="flex flex-col justify-between h-full">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">{repo.name}</h2>
                      <p className="text-sm text-gray-500">Last scanned: {repo.lastScanned || "Just now"}</p>
                      <p className="text-sm text-gray-600 mt-1">{repo.description}</p>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <button
                        className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
                      >
                        <span className="flex items-center gap-2">
                          <HiOutlineSearchCircle className="text-lg" />
                          Scan Now
                        </span>
                      </button>
                      <img
                        src={repo.image}
                        alt={repo.name}
                        className="w-20 h-20 object-cover rounded-md"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Scan Results Section */}
        <section>
          <h3 className="text-base text-gray-700 mb-2 font-medium">Scan results for exposed secrets.</h3>

          {/* Toggle buttons (static for now) */}
          <div className="flex justify-center space-x-6 mb-6">
            <button className="text-indigo-600 font-semibold border-b-2 border-indigo-600 pb-1">
              Overview
            </button>
            <button className="text-gray-400 hover:text-indigo-500 transition">
              Alerts
            </button>
          </div>

          {/* Result Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.map((repo, idx) => (
              <motion.div
                key={idx}
                className="bg-white border rounded-xl p-5 shadow-md transition-all ease-in-out duration-300"
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 12px 20px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "#f7fafc",
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <div className="flex justify-between items-center h-full">
                  <div className="flex flex-col space-y-1 pr-4">
                    <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <HiExclamationCircle className="text-yellow-500 text-xl" />
                      {repo.name}
                    </h4>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <HiCheckCircle className="text-green-500 text-base" />
                      {repo.status}
                    </p>
                    <p
                      className={`text-sm font-medium ${
                        repo.issues.includes("No issues") ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {repo.issues}
                    </p>
                    <button
                      className="mt-2 w-fit px-4 py-1.5 border border-indigo-500 text-indigo-500 rounded hover:bg-indigo-50 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    >
                      View Details
                    </button>
                  </div>
                  <img
                    src={repo.image}
                    alt={`Scan result for ${repo.name}`}
                    className="w-20 h-20 object-cover rounded-md"
                    loading="lazy"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default GithubScan;
