import React from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import NotificationDot from "@/components/molecules/NotificationDot";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const AnnouncementCard = ({ announcement, onMarkAsRead }) => {
  const getCategoryColor = (category) => {
    const colors = {
      general: "default",
      important: "error",
      hr: "primary",
      finance: "secondary",
      tech: "accent",
      social: "success"
    };
    return colors[category?.toLowerCase()] || "default";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={cn(
        "hover:shadow-lg transition-all duration-200 relative",
        !announcement.isRead && "ring-2 ring-primary-100 bg-gradient-to-br from-white to-primary-50/30"
      )}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <NotificationDot show={!announcement.isRead}>
                <Badge variant={getCategoryColor(announcement.category)} size="sm">
                  {announcement.category}
                </Badge>
              </NotificationDot>
              <span className="text-xs text-gray-500">
                {format(new Date(announcement.date), "MMM d, yyyy")}
              </span>
              <span className="text-xs text-gray-400">
                by {announcement.author}
              </span>
            </div>
            <h3 className={cn(
              "font-semibold text-gray-900 mb-2",
              !announcement.isRead && "text-primary-900"
            )}>
              {announcement.title}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-3 mb-3">
              {announcement.content}
            </p>
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {/* Open full announcement */}}
                className="text-primary-600 hover:text-primary-700"
              >
                <ApperIcon name="ExternalLink" className="h-4 w-4 mr-1" />
                Read more
              </Button>
              {!announcement.isRead && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onMarkAsRead?.(announcement.Id)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <ApperIcon name="Check" className="h-4 w-4 mr-1" />
                  Mark as read
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default AnnouncementCard;