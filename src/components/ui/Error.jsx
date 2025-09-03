import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ 
  title = "Something went wrong", 
  message = "We encountered an error while loading your data. Please try again.", 
  onRetry,
  className = ""
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`text-center py-12 ${className}`}
    >
      <div className="mx-auto mb-4">
        <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
          <ApperIcon name="AlertTriangle" className="h-8 w-8 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">{message}</p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          {onRetry && (
            <Button onClick={onRetry}>
              <ApperIcon name="RefreshCw" className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}
          <Button variant="outline" onClick={() => window.location.reload()}>
            <ApperIcon name="Home" className="h-4 w-4 mr-2" />
            Refresh Page
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default Error;