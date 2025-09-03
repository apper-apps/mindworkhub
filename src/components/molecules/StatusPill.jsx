import React from "react";
import { cn } from "@/utils/cn";
import Badge from "@/components/atoms/Badge";

const StatusPill = ({ status, className, ...props }) => {
  const getStatusVariant = (status) => {
    const statusMap = {
      "todo": "default",
      "in-progress": "info",
      "in_progress": "info",
      "completed": "success",
      "done": "success",
      "cancelled": "error",
      "canceled": "error",
      "high": "error",
      "medium": "warning",
      "low": "success",
      "urgent": "error",
      "normal": "default",
      "active": "success",
      "inactive": "default",
      "online": "success",
      "offline": "default",
      "available": "success",
      "busy": "warning",
      "away": "warning"
    };
    
    return statusMap[status?.toLowerCase()] || "default";
  };

  const formatStatus = (status) => {
    return status?.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()) || "";
  };

  return (
    <Badge 
      variant={getStatusVariant(status)} 
      size="sm" 
      className={cn("capitalize", className)}
      {...props}
    >
      {formatStatus(status)}
    </Badge>
  );
};

export default StatusPill;