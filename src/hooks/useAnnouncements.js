import { useState, useEffect } from "react";
import announcementService from "@/services/api/announcementService";
import { toast } from "react-toastify";

export const useAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await announcementService.getAll();
      setAnnouncements(data);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const updated = await announcementService.markAsRead(id);
      setAnnouncements(prev => 
        prev.map(announcement => announcement.Id === id ? updated : announcement)
      );
      toast.success("Marked as read");
      return updated;
    } catch (err) {
      toast.error("Failed to mark as read");
      throw err;
    }
  };

  const createAnnouncement = async (announcementData) => {
    try {
      const created = await announcementService.create(announcementData);
      setAnnouncements(prev => [created, ...prev]);
      toast.success("Announcement created successfully");
      return created;
    } catch (err) {
      toast.error("Failed to create announcement");
      throw err;
    }
  };

  const deleteAnnouncement = async (id) => {
    try {
      await announcementService.delete(id);
      setAnnouncements(prev => prev.filter(announcement => announcement.Id !== id));
      toast.success("Announcement deleted successfully");
    } catch (err) {
      toast.error("Failed to delete announcement");
      throw err;
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  return {
    announcements,
    loading,
    error,
    refetch: loadAnnouncements,
    markAsRead,
    createAnnouncement,
    deleteAnnouncement
  };
};