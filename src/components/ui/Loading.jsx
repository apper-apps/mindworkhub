import React from "react";
import { motion } from "framer-motion";

const Loading = ({ type = "page", className = "" }) => {
  if (type === "page") {
    return (
      <div className={`flex items-center justify-center min-h-[400px] ${className}`}>
        <div className="text-center space-y-4">
          <motion.div
            className="relative w-16 h-16 mx-auto"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-primary-500 rounded-full border-t-transparent animate-spin"></div>
          </motion.div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-900">Loading WorkHub</h3>
            <p className="text-gray-500">Getting your workspace ready...</p>
          </div>
        </div>
      </div>
    );
  }

  if (type === "card") {
    return (
      <div className={`p-6 ${className}`}>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded-lg animate-shimmer"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-shimmer"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3 animate-shimmer"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded animate-shimmer"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6 animate-shimmer"></div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "list") {
    return (
      <div className={`space-y-4 ${className}`}>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-shimmer"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-shimmer"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4 animate-shimmer"></div>
                <div className="flex space-x-2">
                  <div className="h-6 w-16 bg-gray-200 rounded-full animate-shimmer"></div>
                  <div className="h-6 w-20 bg-gray-200 rounded-full animate-shimmer"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default spinner
  return (
    <div className={`flex items-center justify-center p-4 ${className}`}>
      <motion.div
        className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};

export default Loading;