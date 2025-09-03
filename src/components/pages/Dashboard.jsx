import React from "react";
import { motion } from "framer-motion";
import DashboardWidgets from "@/components/organisms/DashboardWidgets";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { useTasks } from "@/hooks/useTasks";
import { useSchedule } from "@/hooks/useSchedule";
import { useAnnouncements } from "@/hooks/useAnnouncements";
import { useEmployees } from "@/hooks/useEmployees";

const Dashboard = () => {
  const { tasks, loading: tasksLoading, error: tasksError, refetch: refetchTasks } = useTasks();
  const { events, loading: eventsLoading, error: eventsError, refetch: refetchEvents } = useSchedule();
  const { announcements, loading: announcementsLoading, error: announcementsError, refetch: refetchAnnouncements } = useAnnouncements();
  const { employees, loading: employeesLoading, error: employeesError, refetch: refetchEmployees } = useEmployees();

  const loading = tasksLoading || eventsLoading || announcementsLoading || employeesLoading;
  const error = tasksError || eventsError || announcementsError || employeesError;

  const handleRetry = () => {
    refetchTasks();
    refetchEvents();
    refetchAnnouncements();
    refetchEmployees();
  };

  if (loading) {
    return <Loading type="page" />;
  }

  if (error) {
    return (
      <Error
        title="Failed to load dashboard"
        message="We couldn't load your dashboard data. Please try again."
        onRetry={handleRetry}
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display text-gray-900 mb-2">
            Good morning, John! 👋
          </h1>
          <p className="text-gray-600">
            Here's what's happening in your workspace today
          </p>
        </div>
      </div>

      <DashboardWidgets
        tasks={tasks}
        events={events}
        announcements={announcements}
        employees={employees}
      />
    </motion.div>
  );
};

export default Dashboard;