import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import CalendarView from "@/components/organisms/CalendarView";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { useSchedule } from "@/hooks/useSchedule";
import { useEmployees } from "@/hooks/useEmployees";

const Schedule = () => {
  const { events, loading: eventsLoading, error: eventsError, refetch: refetchEvents } = useSchedule();
  const { employees, loading: employeesLoading, error: employeesError, refetch: refetchEmployees } = useEmployees();

  const loading = eventsLoading || employeesLoading;
  const error = eventsError || employeesError;

  const handleRetry = () => {
    refetchEvents();
    refetchEmployees();
  };

  if (loading) {
    return <Loading type="page" />;
  }

  if (error) {
    return (
      <Error
        title="Failed to load schedule"
        message="We couldn't load your schedule data. Please try again."
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold font-display text-gray-900 mb-2">
            Schedule
          </h1>
          <p className="text-gray-600">
            View and manage your calendar events
          </p>
        </div>
        
        <Button className="self-start sm:self-auto">
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          New Event
        </Button>
      </div>

      {events.length === 0 ? (
        <Empty
          title="No events scheduled"
          message="You don't have any events in your calendar. Create your first event to get started."
          icon="Calendar"
          actionLabel="Create Event"
          onAction={() => console.log("Create event clicked")}
        />
      ) : (
        <CalendarView events={events} employees={employees} />
      )}
    </motion.div>
  );
};

export default Schedule;