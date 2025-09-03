import React from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Avatar from "@/components/atoms/Avatar";
import Button from "@/components/atoms/Button";
import StatusPill from "@/components/molecules/StatusPill";
import ApperIcon from "@/components/ApperIcon";

const EmployeeCard = ({ employee, onContact }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="hover:shadow-lg transition-all duration-200">
        <div className="flex items-center space-x-4">
          <Avatar
            src={employee.avatar}
            alt={employee.name}
            size="lg"
            fallback={employee.name?.charAt(0)}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-semibold text-gray-900 text-base truncate">
                {employee.name}
              </h3>
              <StatusPill status={employee.status} />
            </div>
            <p className="text-sm font-medium text-primary-600 mb-1">
              {employee.role}
            </p>
            <p className="text-sm text-gray-500 mb-2">
              {employee.department}
            </p>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <ApperIcon name="Mail" className="h-3 w-3" />
                <span className="truncate">{employee.email}</span>
              </div>
              {employee.phone && (
                <div className="flex items-center space-x-1">
                  <ApperIcon name="Phone" className="h-3 w-3" />
                  <span>{employee.phone}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onContact?.("email", employee.email)}
              className="text-xs"
            >
              <ApperIcon name="Mail" className="h-3 w-3 mr-1" />
              Email
            </Button>
            {employee.phone && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onContact?.("phone", employee.phone)}
                className="text-xs"
              >
                <ApperIcon name="Phone" className="h-3 w-3 mr-1" />
                Call
              </Button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default EmployeeCard;