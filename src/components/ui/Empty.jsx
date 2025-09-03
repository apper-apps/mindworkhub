import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No data found", 
  message = "There's nothing to show here yet.", 
  icon = "Inbox",
  actionLabel,
  onAction,
  className = ""
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`text-center py-12 ${className}`}
    >
      <div className="mx-auto mb-6">
        <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <ApperIcon name={icon} className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">{message}</p>
        
        {actionLabel && onAction && (
          <Button onClick={onAction}>
            <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
            {actionLabel}
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default Empty;