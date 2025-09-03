import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import AnnouncementCard from "@/components/molecules/AnnouncementCard";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const AnnouncementFeed = ({ announcements = [], onMarkAsRead }) => {
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  const categories = [...new Set(announcements.map(a => a.category))].filter(Boolean);

  const filterAnnouncements = (announcements) => {
    switch (filter) {
      case "unread":
        return announcements.filter(a => !a.isRead);
      case "read":
        return announcements.filter(a => a.isRead);
      default:
        if (filter === "all") return announcements;
        return announcements.filter(a => a.category === filter);
    }
  };

  const sortAnnouncements = (announcements) => {
    const sorted = [...announcements];
    switch (sortBy) {
      case "date":
        return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
      case "category":
        return sorted.sort((a, b) => a.category.localeCompare(b.category));
      case "title":
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return sorted;
    }
  };

  const filteredAndSortedAnnouncements = sortAnnouncements(filterAnnouncements(announcements));

  const announcementCounts = {
    all: announcements.length,
    unread: announcements.filter(a => !a.isRead).length,
    read: announcements.filter(a => a.isRead).length
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <ApperIcon name="Bell" className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{announcementCounts.all}</p>
              <p className="text-sm text-blue-700">Total Announcements</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-500 rounded-lg">
              <ApperIcon name="AlertCircle" className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">{announcementCounts.unread}</p>
              <p className="text-sm text-orange-700">Unread</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500 rounded-lg">
              <ApperIcon name="CheckCircle" className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{announcementCounts.read}</p>
              <p className="text-sm text-green-700">Read</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0 lg:space-x-4">
        <div className="flex flex-wrap gap-2">
          {[
            { key: "all", label: "All", count: announcementCounts.all },
            { key: "unread", label: "Unread", count: announcementCounts.unread },
            { key: "read", label: "Read", count: announcementCounts.read },
            ...categories.map(cat => ({
              key: cat,
              label: cat.charAt(0).toUpperCase() + cat.slice(1),
              count: announcements.filter(a => a.category === cat).length
            }))
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
            <option value="date">Sort by Date</option>
            <option value="category">Sort by Category</option>
            <option value="title">Sort by Title</option>
          </Select>
          
          {announcementCounts.unread > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                announcements
                  .filter(a => !a.isRead)
                  .forEach(a => onMarkAsRead?.(a.Id));
              }}
            >
              <ApperIcon name="CheckCheck" className="h-4 w-4 mr-1" />
              Mark all as read
            </Button>
          )}
        </div>
      </div>

      {/* Announcement Feed */}
      <AnimatePresence mode="wait">
        {filteredAndSortedAnnouncements.length > 0 ? (
          <motion.div
            key="announcement-feed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {filteredAndSortedAnnouncements.map((announcement) => (
              <AnnouncementCard
                key={announcement.Id}
                announcement={announcement}
                onMarkAsRead={onMarkAsRead}
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
            <ApperIcon name="Bell" className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No announcements found
            </h3>
            <p className="text-gray-500">
              {filter === "all" 
                ? "No announcements have been posted yet." 
                : `No ${filter} announcements to show.`}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnnouncementFeed;