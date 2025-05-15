import React, { useState } from "react";
import Header from "../components/Header";
import { HiOutlineSearchCircle, HiCheckCircle, HiExclamationCircle, HiX } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";

// import your API functions (commented out for now)
// import { fetchRepositories, scanRepository } from "../services/api";

const sampleRepositories = [
  {
    title: "Frontend Repo",
    lastScanned: "2 days ago",
    description: "Active repository for frontend development",
    image: "https://images.unsplash.com/photo-1581090700227-1e8e6f7f7f70",
  },
];

const GithubScan = () => {
  const [reposToScan, setReposToScan] = useState([]);
  const [repoLoading, setRepoLoading] = useState(false);
  const [scanStatus, setScanStatus] = useState({});
  const [showDetails, setShowDetails] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [showRepoSelector, setShowRepoSelector] = useState(false);

  // Example handler for connecting GitHub (placeholder)
  const handleGithubConnect = () => {
    alert("GitHub OAuth not yet implemented.");
    // TODO: Redirect to your Django backend OAuth endpoint
  };

  // Open repo selection modal
  const openRepoSelector = () => {
    setShowRepoSelector(true);

    // Uncomment to fetch repos from backend instead of sample
    /*
    setRepoLoading(true);
    fetchRepositories()
      .then((repos) => {
        // Update state or modal list with fetched repos here
        // e.g., setReposToScan(repos);
      })
      .catch((error) => {
        console.error("Failed to fetch repositories", error);
      })
      .finally(() => setRepoLoading(false));
    */
  };

  // Scan a repository now
  const handleScanNow = (repoName) => {
    setScanStatus((prev) => ({ ...prev, [repoName]: "scanning" }));

    // Uncomment to call real API scan endpoint
    /*
    scanRepository(repoName)
      .then((result) => {
        setScanStatus((prev) => ({ ...prev, [repoName]: "completed" }));
        // Optionally update repo scan details or results here
      })
      .catch((error) => {
        setScanStatus((prev) => ({ ...prev, [repoName]: "failed" }));
        console.error("Scan failed", error);
      });
    */

    // Temporary simulated scan for demo
    setTimeout(() => {
      setScanStatus((prev) => ({ ...prev, [repoName]: "completed" }));
    }, 3000);
  };

  const openDetails = (repo) => {
    setSelectedDetails(repo);
    setShowDetails(true);
  };

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedDetails(null);
  };

  return (
    <div className="bg-white min-h-screen relative">
      <Header />

      <main className="px-6 md:px-12 lg:px-24 py-10 space-y-10">
        {/* Intro Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-gray-700 text-base md:text-lg leading-relaxed tracking-wide">
          <p>
            Automatically detect and remediate secrets in your code with our GitHub integration.
          </p>
          <button
            onClick={handleGithubConnect}
            className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 text-sm"
          >
            Connect GitHub
          </button>
        </div>

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
            onClick={openRepoSelector}
          >
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900">Select Repo to Scan</h3>
              <p className="text-sm text-gray-500 mt-2">Click to load and scan your repository from GitHub</p>
            </div>
          </motion.div>
        </section>

        {/* Loading State */}
        {repoLoading && (
          <section>
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600"></div>
              <p className="ml-4 text-lg text-gray-600">Loading your repository...</p>
            </div>
          </section>
        )}

        {/* Scanned Repositories */}
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
                      <p className="text-sm text-gray-500">Last scanned: {repo.lastScanned}</p>
                      <p className="text-sm text-gray-600 mt-1">{repo.description}</p>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <button
                        onClick={() => handleScanNow(repo.name)}
                        className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
                      >
                        <span className="flex items-center gap-2">
                          <HiOutlineSearchCircle className="text-lg" />
                          {scanStatus[repo.name] === "scanning"
                            ? "Scanning..."
                            : scanStatus[repo.name] === "completed"
                            ? "Re-scan"
                            : "Scan Now"}
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

        {/* Results Section */}
        <section>
          <h3 className="text-base text-gray-700 mb-2 font-medium">Scan results for exposed secrets.</h3>

          <div className="flex justify-center space-x-6 mb-6">
            <button className="text-indigo-600 font-semibold border-b-2 border-indigo-600 pb-1">
              Overview
            </button>
            <button className="text-gray-400 hover:text-indigo-500 transition">Alerts</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <div className="flex justify-between items-center h-full">
                  <div className="flex flex-col space-y-1 pr-4">
                    <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <HiExclamationCircle className="text-yellow-500 text-xl" />
                      {repo.name}
                    </h4>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <HiCheckCircle className="text-green-500 text-base" />
                      Scan completed successfully
                    </p>
                    <p className="text-sm font-medium text-red-500">3 critical issues found</p>
                    <button
                      onClick={() => openDetails(repo)}
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

      {/* Scan Details Modal */}
      <AnimatePresence>
        {showDetails && selectedDetails && (
          <motion.div
            className="fixed inset-0 z-40 bg-black bg-opacity-40 flex justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg relative"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
                onClick={closeDetails}
              >
                <HiX size={22} />
              </button>
              <h2 className="text-xl font-semibold mb-4">{selectedDetails.name} - Scan Details</h2>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Description:</strong> {selectedDetails.description}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Findings:</strong> Exposed AWS key at `config.js:23`, Hardcoded token in `main.py:101`
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Severity:</strong> 2 Critical, 1 Medium
              </p>
              <p className="text-sm text-green-600 mt-4 italic">
                Suggestion: Consider using environment variables and GitHub Secret Scanning for automation.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Repository Selection Modal */}
      <AnimatePresence>
        {showRepoSelector && (
          <motion.div
            className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.target.id === "repoSelectorBackdrop" && setShowRepoSelector(false)}
            id="repoSelectorBackdrop"
            aria-modal="true"
            role="dialog"
          >
            <motion.div
              className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
                onClick={() => setShowRepoSelector(false)}
                aria-label="Close repository selector"
              >
                <HiX size={22} />
              </button>
              <h2 className="text-xl font-semibold mb-4">Select a Repository</h2>
              <ul>
                {sampleRepositories.map((repo, i) => (
                  <li
                    key={i}
                    className="border rounded p-3 mb-3 cursor-pointer hover:bg-indigo-50"
                    onClick={() => {
                      setReposToScan([
                        ...reposToScan,
                        {
                          name: repo.title,
                          description: repo.description,
                          image: repo.image,
                          lastScanned: "Never",
                        },
                      ]);
                      setShowRepoSelector(false);
                    }}
                  >
                    <h3 className="font-semibold">{repo.title}</h3>
                    <p className="text-sm text-gray-600">{repo.description}</p>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GithubScan;
