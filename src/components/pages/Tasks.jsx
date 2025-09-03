import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import TaskList from "@/components/organisms/TaskList";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { useTasks } from "@/hooks/useTasks";

const Tasks = () => {
  const { tasks, loading, error, updateTask, deleteTask, refetch } = useTasks();

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTask(taskId, { status: newStatus });
    } catch (err) {
      console.error("Failed to update task status:", err);
    }
  };

  const handleTaskDelete = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(taskId);
      } catch (err) {
        console.error("Failed to delete task:", err);
      }
    }
  };

  if (loading) {
    return <Loading type="list" />;
  }

  if (error) {
    return (
      <Error
        title="Failed to load tasks"
        message="We couldn't load your tasks. Please try again."
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
            My Tasks
          </h1>
          <p className="text-gray-600">
            Manage and track your assigned tasks
          </p>
        </div>
        
        <Button className="self-start sm:self-auto">
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </div>

      {tasks.length === 0 ? (
        <Empty
          title="No tasks yet"
          message="You don't have any tasks assigned. Create your first task to get started."
          icon="CheckCircle2"
          actionLabel="Create Task"
          onAction={() => console.log("Create task clicked")}
        />
      ) : (
        <TaskList
          tasks={tasks}
          onTaskUpdate={handleStatusChange}
          onTaskDelete={handleTaskDelete}
        />
      )}
    </motion.div>
  );
};

export default Tasks;