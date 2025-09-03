import { useState, useEffect } from "react";
import taskService from "@/services/api/taskService";
import { toast } from "react-toastify";

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await taskService.getAll();
      setTasks(data);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (id, updateData) => {
    try {
      const updated = await taskService.update(id, updateData);
      setTasks(prev => 
        prev.map(task => task.Id === id ? updated : task)
      );
      toast.success("Task updated successfully");
      return updated;
    } catch (err) {
      toast.error("Failed to update task");
      throw err;
    }
  };

  const createTask = async (taskData) => {
    try {
      const created = await taskService.create(taskData);
      setTasks(prev => [...prev, created]);
      toast.success("Task created successfully");
      return created;
    } catch (err) {
      toast.error("Failed to create task");
      throw err;
    }
  };

  const deleteTask = async (id) => {
    try {
      await taskService.delete(id);
      setTasks(prev => prev.filter(task => task.Id !== id));
      toast.success("Task deleted successfully");
    } catch (err) {
      toast.error("Failed to delete task");
      throw err;
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return {
    tasks,
    loading,
    error,
    refetch: loadTasks,
    updateTask,
    createTask,
    deleteTask
  };
};