import React from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import StatusPill from "@/components/molecules/StatusPill";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
const TaskCard = ({ task, onStatusChange, onEdit, onDelete }) => {
  const handleStatusToggle = () => {
    const newStatus = task.status === "completed" ? "todo" : "completed";
    onStatusChange?.(task.Id, newStatus);
  };

  const getPriorityIcon = (priority) => {
    const icons = {
      high: "AlertTriangle",
      medium: "Clock",
      low: "CheckCircle"
    };
    return icons[priority] || "Circle";
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: "text-red-500",
      medium: "text-yellow-500",
      low: "text-green-500"
    };
    return colors[priority] || "text-gray-500";
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="hover:shadow-lg transition-all duration-200">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <button
              onClick={handleStatusToggle}
              className={cn(
                "mt-1 p-1 rounded-full transition-all duration-200 hover:scale-110",
                task.status === "completed" 
                  ? "text-green-500 hover:text-green-600" 
                  : "text-gray-300 hover:text-gray-400"
              )}
            >
              <ApperIcon 
                name={task.status === "completed" ? "CheckCircle2" : "Circle"} 
                className="h-5 w-5" 
              />
            </button>
            <div className="flex-1 min-w-0">
              <h3 className={cn(
                "font-medium text-gray-900 text-sm mb-1",
                task.status === "completed" && "line-through text-gray-500"
              )}>
                {task.title}
              </h3>
              {task.description && (
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {task.description}
                </p>
              )}
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <ApperIcon 
                  name={getPriorityIcon(task.priority)} 
                  className={cn("h-3 w-3", getPriorityColor(task.priority))} 
                />
                <span>{task.priority} priority</span>
                {task.dueDate && (
                  <>
                    <span>•</span>
                    <span>Due {format(new Date(task.dueDate), "MMM d")}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <StatusPill status={task.status} />
            <div className="flex items-center space-x-1 ml-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => onEdit?.(task)}
                className="h-8 w-8 text-gray-400 hover:text-gray-600"
              >
                <ApperIcon name="Edit2" className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => onDelete?.(task.Id)}
                className="h-8 w-8 text-gray-400 hover:text-red-600"
              >
                <ApperIcon name="Trash2" className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default TaskCard;