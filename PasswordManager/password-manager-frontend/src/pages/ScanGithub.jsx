import React from "react";
import { HiOutlineSearchCircle } from "react-icons/hi";
import { HiCheckCircle, HiExclamationCircle } from "react-icons/hi";

const ScanGithub = () => {
  return (
    <div className="p-4 space-y-3 bg-gray-100 min-h-screen">

      {/* ✅ Repo Card */}
      <div className="flex justify-between items-center w-full max-w-xl bg-white border rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow h-28">
        <div className="flex flex-col space-y-0.5 flex-1 pr-3 text-sm">
          <h2 className="font-semibold text-gray-900 text-sm flex items-center gap-1">
            <HiOutlineSearchCircle className="text-blue-500 text-base" />
            Frontend Repo
          </h2>
          <p className="text-xs text-gray-500">Last scanned: 2 days ago</p>
          <p className="text-xs text-gray-600 truncate">Repository for UI work</p>
          <button className="mt-1 w-fit px-3 py-1 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 text-xs transition">
            Scan Now
          </button>
        </div>
        <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
          <img
            src="https://images.unsplash.com/photo-1581090700227-1e8e6f7f7f70"
            alt="Frontend Repo"
            className="w-full h-full object-cover rounded-md"
          />
        </div>
      </div>

      {/* ✅ Scan Result Card */}
      <div className="flex justify-between items-center w-full max-w-xl bg-white border rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow h-28">
        <div className="flex flex-col space-y-0.5 flex-1 pr-3 text-sm">
          <h2 className="font-semibold text-gray-900 text-sm flex items-center gap-1">
            <HiExclamationCircle className="text-yellow-500 text-base" />
            Frontend Repo
          </h2>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <HiCheckCircle className="text-green-500 text-sm" />
            Scan completed successfully
          </p>
          <p className="text-xs text-red-500 font-medium">⚠️ 5 vulnerabilities found</p>
          <button className="mt-1 w-fit px-3 py-1 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 text-xs transition">
            View Details
          </button>
        </div>
        <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
          <img
            src="https://images.unsplash.com/photo-1623052213564-7ac8b0557ce5"
            alt="Scan Result"
            className="w-full h-full object-cover rounded-md"
          />
        </div>
      </div>

    </div>
  );
};

export default ScanGithub;
