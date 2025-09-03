import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import Card from "@/components/atoms/Card";
import AvatarCluster from "@/components/molecules/AvatarCluster";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";
const CalendarEvent = ({ event, employees = [] }) => {
  const getEventTypeIcon = (type) => {
    const icons = {
      meeting: "Users",
      call: "Phone",
      presentation: "Monitor",
      training: "BookOpen",
      deadline: "Clock",
      appointment: "Calendar"
    };
    return icons[type?.toLowerCase()] || "Calendar";
  };

  const getEventTypeColor = (type) => {
    const colors = {
      meeting: "text-blue-500 bg-blue-50",
      call: "text-green-500 bg-green-50",
      presentation: "text-purple-500 bg-purple-50",
      training: "text-orange-500 bg-orange-50",
      deadline: "text-red-500 bg-red-50",
      appointment: "text-gray-500 bg-gray-50"
    };
    return colors[type?.toLowerCase()] || "text-gray-500 bg-gray-50";
  };

  const attendeeUsers = employees.filter(emp => 
    event.attendees?.includes(emp.Id)
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card variant="gradient" className="hover:shadow-lg transition-all duration-200">
        <div className="flex items-start space-x-3">
          <div className={cn(
            "p-2 rounded-lg flex-shrink-0",
            getEventTypeColor(event.type)
          )}>
            <ApperIcon 
              name={getEventTypeIcon(event.type)} 
              className="h-4 w-4" 
            />
          </div>
          <div className="flex-1 min-w-0">
<h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">
              {event.title}
            </h3>
            <div className="flex items-center space-x-2 text-xs text-gray-600 mb-2">
              <ApperIcon name="Clock" className="h-3 w-3" />
              <span>
                {format(new Date(event.startTime), "HH:mm")} - {format(new Date(event.endTime), "HH:mm")}
              </span>
{event.location && (
                <>
                  <span>•</span>
                  <ApperIcon name="MapPin" className="h-3 w-3" />
                  <span className="truncate">{event.location}</span>
                </>
              )}
            </div>
            {attendeeUsers.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">Attendees:</span>
                <AvatarCluster users={attendeeUsers} size="sm" maxVisible={3} />
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default CalendarEvent;