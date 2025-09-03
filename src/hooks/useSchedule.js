import { useState, useEffect } from "react";
import scheduleService from "@/services/api/scheduleService";
import { toast } from "react-toastify";

export const useSchedule = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await scheduleService.getAll();
      setEvents(data);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load schedule events");
    } finally {
      setLoading(false);
    }
  };

  const updateEvent = async (id, updateData) => {
    try {
      const updated = await scheduleService.update(id, updateData);
      setEvents(prev => 
        prev.map(event => event.Id === id ? updated : event)
      );
      toast.success("Event updated successfully");
      return updated;
    } catch (err) {
      toast.error("Failed to update event");
      throw err;
    }
  };

  const createEvent = async (eventData) => {
    try {
      const created = await scheduleService.create(eventData);
      setEvents(prev => [...prev, created]);
      toast.success("Event created successfully");
      return created;
    } catch (err) {
      toast.error("Failed to create event");
      throw err;
    }
  };

  const deleteEvent = async (id) => {
    try {
      await scheduleService.delete(id);
      setEvents(prev => prev.filter(event => event.Id !== id));
      toast.success("Event deleted successfully");
    } catch (err) {
      toast.error("Failed to delete event");
      throw err;
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  return {
    events,
    loading,
    error,
    refetch: loadEvents,
    updateEvent,
    createEvent,
    deleteEvent
  };
};