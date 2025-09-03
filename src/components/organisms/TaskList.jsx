import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import TaskCard from "@/components/molecules/TaskCard";
import ApperIcon from "@/components/ApperIcon";

const TaskList = ({ tasks = [], onTaskUpdate, onTaskDelete }) => {
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("dueDate");

  const filterTasks = (tasks) => {
    switch (filter) {
      case "completed":
        return tasks.filter(task => task.status === "completed");
      case "pending":
        return tasks.filter(task => task.status !== "completed");
      case "high":
        return tasks.filter(task => task.priority === "high");
      case "overdue":
        return tasks.filter(task => {
          if (!task.dueDate || task.status === "completed") return false;
          return new Date(task.dueDate) < new Date();
        });
      default:
        return tasks;
    }
  };

  const sortTasks = (tasks) => {
    const sorted = [...tasks];
    switch (sortBy) {
      case "dueDate":
        return sorted.sort((a, b) => {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        });
      case "priority":
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return sorted.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
      case "status":
        return sorted.sort((a, b) => a.status.localeCompare(b.status));
      case "title":
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return sorted;
    }
  };

  const filteredAndSortedTasks = sortTasks(filterTasks(tasks));

  const taskCounts = {
    all: tasks.length,
    pending: tasks.filter(t => t.status !== "completed").length,
    completed: tasks.filter(t => t.status === "completed").length,
    high: tasks.filter(t => t.priority === "high").length,
    overdue: tasks.filter(t => {
      if (!t.dueDate || t.status === "completed") return false;
      return new Date(t.dueDate) < new Date();
    }).length
  };

  return (
    <div className="space-y-6">
      {/* Filters and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex flex-wrap gap-2">
          {[
            { key: "all", label: "All Tasks", count: taskCounts.all },
            { key: "pending", label: "Pending", count: taskCounts.pending },
            { key: "completed", label: "Completed", count: taskCounts.completed },
            { key: "high", label: "High Priority", count: taskCounts.high },
            { key: "overdue", label: "Overdue", count: taskCounts.overdue }
          ].map((item) => (
            <Button
              key={item.key}
              variant={filter === item.key ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(item.key)}
              className="text-sm"
            >
              {item.label}
              {item.count > 0 && (
                <span className={cn(
                  "ml-2 px-2 py-0.5 text-xs rounded-full",
                  filter === item.key 
                    ? "bg-white/20 text-white" 
                    : "bg-gray-100 text-gray-600"
                )}>
                  {item.count}
                </span>
              )}
            </Button>
          ))}
        </div>

        <div className="flex items-center space-x-3">
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-40"
          >
            <option value="dueDate">Sort by Due Date</option>
            <option value="priority">Sort by Priority</option>
            <option value="status">Sort by Status</option>
            <option value="title">Sort by Title</option>
          </Select>
        </div>
      </div>

      {/* Task List */}
      <AnimatePresence mode="wait">
        {filteredAndSortedTasks.length > 0 ? (
          <motion.div
            key="task-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {filteredAndSortedTasks.map((task) => (
              <TaskCard
                key={task.Id}
                task={task}
                onStatusChange={onTaskUpdate}
                onDelete={onTaskDelete}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty-state"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center py-12"
          >
            <ApperIcon name="CheckCircle2" className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === "all" ? "No tasks yet" : `No ${filter} tasks`}
            </h3>
            <p className="text-gray-500 mb-6">
              {filter === "completed" 
                ? "Complete some tasks to see them here." 
                : "Create your first task to get started."}
            </p>
            {filter !== "completed" && (
              <Button>
                <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
                Create Task
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TaskList;