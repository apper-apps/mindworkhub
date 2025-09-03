import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import AnnouncementFeed from "@/components/organisms/AnnouncementFeed";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { useAnnouncements } from "@/hooks/useAnnouncements";

const Announcements = () => {
  const { announcements, loading, error, markAsRead, refetch } = useAnnouncements();

  const handleMarkAsRead = async (announcementId) => {
    try {
      await markAsRead(announcementId);
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  if (loading) {
    return <Loading type="list" />;
  }

  if (error) {
    return (
      <Error
        title="Failed to load announcements"
        message="We couldn't load the announcements. Please try again."
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
            Announcements
          </h1>
          <p className="text-gray-600">
            Stay updated with company news and important updates
          </p>
        </div>
        
        <Button variant="outline" className="self-start sm:self-auto">
          <ApperIcon name="RefreshCw" className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {announcements.length === 0 ? (
        <Empty
          title="No announcements"
          message="There are no announcements to display at this time."
          icon="Bell"
        />
      ) : (
        <AnnouncementFeed
          announcements={announcements}
          onMarkAsRead={handleMarkAsRead}
        />
      )}
    </motion.div>
  );
};

export default Announcements;