import { useState, useEffect } from "react";
import employeeService from "@/services/api/employeeService";
import { toast } from "react-toastify";

export const useEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await employeeService.getAll();
      setEmployees(data);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  const updateEmployee = async (id, updateData) => {
    try {
      const updated = await employeeService.update(id, updateData);
      setEmployees(prev => 
        prev.map(emp => emp.Id === id ? updated : emp)
      );
      toast.success("Employee updated successfully");
      return updated;
    } catch (err) {
      toast.error("Failed to update employee");
      throw err;
    }
  };

  const createEmployee = async (employeeData) => {
    try {
      const created = await employeeService.create(employeeData);
      setEmployees(prev => [...prev, created]);
      toast.success("Employee created successfully");
      return created;
    } catch (err) {
      toast.error("Failed to create employee");
      throw err;
    }
  };

  const deleteEmployee = async (id) => {
    try {
      await employeeService.delete(id);
      setEmployees(prev => prev.filter(emp => emp.Id !== id));
      toast.success("Employee deleted successfully");
    } catch (err) {
      toast.error("Failed to delete employee");
      throw err;
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  return {
    employees,
    loading,
    error,
    refetch: loadEmployees,
    updateEmployee,
    createEmployee,
    deleteEmployee
  };
};