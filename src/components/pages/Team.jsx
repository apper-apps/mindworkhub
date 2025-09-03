import React from "react";
import { motion } from "framer-motion";
import TeamGrid from "@/components/organisms/TeamGrid";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { useEmployees } from "@/hooks/useEmployees";
import { toast } from "react-toastify";

const Team = () => {
  const { employees, loading, error, refetch } = useEmployees();

  const handleContact = (type, value) => {
    if (type === "email") {
      window.location.href = `mailto:${value}`;
    } else if (type === "phone") {
      window.location.href = `tel:${value}`;
    }
    toast.success(`Opening ${type} for contact`);
  };

  if (loading) {
    return <Loading type="page" />;
  }

  if (error) {
    return (
      <Error
        title="Failed to load team"
        message="We couldn't load the team directory. Please try again."
        onRetry={refetch}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold font-display text-gray-900 mb-2">
            Team Directory
          </h1>
          <p className="text-gray-600">
            Connect with your colleagues across departments
          </p>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>{employees.filter(emp => emp.status === "active").length} Active</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span>{employees.filter(emp => emp.status === "away").length} Away</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span>{employees.filter(emp => emp.status === "busy").length} Busy</span>
          </div>
        </div>
      </div>

      {employees.length === 0 ? (
        <Empty
          title="No team members found"
          message="The team directory is currently empty."
          icon="Users"
        />
      ) : (
        <TeamGrid employees={employees} onContact={handleContact} />
      )}
    </motion.div>
  );
};

export default Team;