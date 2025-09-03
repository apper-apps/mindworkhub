import React from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ProgressRing from "@/components/molecules/ProgressRing";
import StatusPill from "@/components/molecules/StatusPill";
import CalendarEvent from "@/components/molecules/CalendarEvent";
import ApperIcon from "@/components/ApperIcon";
import { format, isToday, isTomorrow } from "date-fns";

const DashboardWidgets = ({ tasks = [], events = [], announcements = [], employees = [] }) => {
  const todayTasks = tasks.filter(task => {
    if (!task.dueDate) return false;
    return isToday(new Date(task.dueDate));
  });

  const completedToday = todayTasks.filter(task => task.status === "completed").length;
  const completionRate = todayTasks.length > 0 ? (completedToday / todayTasks.length) * 100 : 0;

  const upcomingEvents = events
    .filter(event => {
      const eventDate = new Date(event.startTime);
      return isToday(eventDate) || isTomorrow(eventDate);
    })
    .slice(0, 3);

  const recentAnnouncements = announcements
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

  const overdueTasks = tasks.filter(task => {
    if (!task.dueDate || task.status === "completed") return false;
    return new Date(task.dueDate) < new Date();
  }).length;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Today's Progress */}
      <motion.div variants={itemVariants}>
        <Card variant="gradient" className="h-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Today's Progress</h3>
            <div className="p-2 bg-gradient-primary rounded-lg">
              <ApperIcon name="Target" className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="flex items-center justify-center mb-4">
            <ProgressRing 
              progress={completionRate} 
              size={80} 
              color="accent"
              showPercentage
            />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Tasks completed</span>
              <span className="font-semibold text-gray-900">{completedToday}/{todayTasks.length}</span>
            </div>
            {overdueTasks > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-red-600">Overdue tasks</span>
                <Badge variant="error" size="sm">{overdueTasks}</Badge>
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Quick Stats */}
      <motion.div variants={itemVariants}>
        <Card variant="elevated" className="h-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Quick Stats</h3>
            <div className="p-2 bg-gradient-secondary rounded-lg">
              <ApperIcon name="BarChart3" className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
              <div className="flex items-center space-x-3">
                <ApperIcon name="CheckSquare" className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Total Tasks</span>
              </div>
              <span className="text-lg font-bold text-blue-600">{tasks.length}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
              <div className="flex items-center space-x-3">
                <ApperIcon name="Calendar" className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-900">Events Today</span>
              </div>
              <span className="text-lg font-bold text-green-600">
                {events.filter(event => isToday(new Date(event.startTime))).length}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
              <div className="flex items-center space-x-3">
                <ApperIcon name="Bell" className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-900">New Announcements</span>
              </div>
              <span className="text-lg font-bold text-purple-600">
                {announcements.filter(a => !a.isRead).length}
              </span>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Today's Schedule */}
      <motion.div variants={itemVariants} className="lg:row-span-2">
        <Card className="h-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Today's Schedule</h3>
            <div className="p-2 bg-gradient-accent rounded-lg">
              <ApperIcon name="Calendar" className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="space-y-3">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <CalendarEvent 
                  key={event.Id} 
                  event={event} 
                  employees={employees}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <ApperIcon name="CalendarX" className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No events scheduled for today</p>
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Recent Announcements */}
      <motion.div variants={itemVariants} className="lg:col-span-2">
        <Card className="h-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Announcements</h3>
            <div className="p-2 bg-gradient-to-br from-orange-400 to-pink-400 rounded-lg">
              <ApperIcon name="Megaphone" className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="space-y-3">
            {recentAnnouncements.length > 0 ? (
              recentAnnouncements.map((announcement) => (
                <div key={announcement.Id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        {!announcement.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                        )}
                        <h4 className="font-medium text-gray-900 text-sm line-clamp-1">
                          {announcement.title}
                        </h4>
                        <StatusPill status={announcement.category} />
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2 mb-1">
                        {announcement.content}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>{announcement.author}</span>
                        <span>•</span>
                        <span>{format(new Date(announcement.date), "MMM d")}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <ApperIcon name="BellOff" className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No recent announcements</p>
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default DashboardWidgets;