import React, { useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import CalendarEvent from "@/components/molecules/CalendarEvent";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/lib/utils";
import { addWeeks, eachDayOfInterval, endOfWeek, format, isSameDay, isToday, startOfWeek, subWeeks } from "date-fns";
const CalendarView = ({ events = [], employees = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("week"); // week, day

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const getEventsForDay = (day) => {
    return events.filter(event => 
      isSameDay(new Date(event.startTime), day)
    );
  };

  const navigateWeek = (direction) => {
    if (direction === "prev") {
      setCurrentDate(subWeeks(currentDate, 1));
    } else {
      setCurrentDate(addWeeks(currentDate, 1));
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const renderWeekView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
      {weekDays.map((day) => {
        const dayEvents = getEventsForDay(day);
        const isCurrentDay = isToday(day);
        
        return (
          <motion.div
            key={day.toISOString()}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <div className={cn(
              "p-3 text-center rounded-lg border-2 transition-colors duration-200",
              isCurrentDay 
                ? "bg-gradient-primary text-white border-primary-600" 
                : "bg-white border-gray-200 hover:border-gray-300"
            )}>
              <p className="text-xs font-medium opacity-75">
                {format(day, "EEE")}
              </p>
              <p className={cn(
                "text-lg font-bold",
                isCurrentDay ? "text-white" : "text-gray-900"
              )}>
                {format(day, "d")}
              </p>
            </div>
            
            <div className="space-y-2 min-h-[200px]">
              {dayEvents.length > 0 ? (
                dayEvents.map((event) => (
                  <CalendarEvent
                    key={event.Id}
                    event={event}
                    employees={employees}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <ApperIcon name="Calendar" className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">No events</p>
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );

  const renderDayView = () => {
    const dayEvents = getEventsForDay(currentDate);
    
    return (
      <div className="space-y-4">
        <Card variant="gradient">
          <div className="text-center py-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {format(currentDate, "EEEE, MMMM d")}
            </h2>
            <p className="text-gray-600">
              {dayEvents.length} {dayEvents.length === 1 ? "event" : "events"} scheduled
            </p>
          </div>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dayEvents.length > 0 ? (
            dayEvents.map((event) => (
              <CalendarEvent
                key={event.Id}
                event={event}
                employees={employees}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <ApperIcon name="CalendarX" className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No events today</h3>
              <p className="text-gray-500">Enjoy your free day!</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900">
            {view === "week" 
              ? `Week of ${format(weekStart, "MMM d")}` 
              : format(currentDate, "MMMM d, yyyy")
            }
          </h1>
          <Button variant="ghost" size="sm" onClick={goToToday}>
            Today
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <Button
              variant={view === "day" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("day")}
              className="text-sm"
            >
              <ApperIcon name="Square" className="h-4 w-4 mr-1" />
              Day
            </Button>
            <Button
              variant={view === "week" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("week")}
              className="text-sm"
            >
              <ApperIcon name="Calendar" className="h-4 w-4 mr-1" />
              Week
            </Button>
          </div>
          
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateWeek("prev")}
            >
              <ApperIcon name="ChevronLeft" className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateWeek("next")}
            >
              <ApperIcon name="ChevronRight" className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar Content */}
      {view === "week" ? renderWeekView() : renderDayView()}
    </div>
  );
};

export default CalendarView;