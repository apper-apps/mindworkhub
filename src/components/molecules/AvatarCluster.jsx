import React from "react";
import { cn } from "@/utils/cn";
import Avatar from "@/components/atoms/Avatar";

const AvatarCluster = ({ 
  users = [], 
  maxVisible = 3, 
  size = "default",
  className 
}) => {
  const visibleUsers = users.slice(0, maxVisible);
  const remainingCount = users.length - maxVisible;

  const sizeClasses = {
    sm: "h-6 w-6 text-xs",
    default: "h-8 w-8 text-sm",
    lg: "h-10 w-10 text-base"
  };

  return (
    <div className={cn("flex items-center", className)}>
      <div className="flex -space-x-2">
        {visibleUsers.map((user, index) => (
          <Avatar
            key={user.Id || index}
            src={user.avatar}
            alt={user.name}
            size={size}
            fallback={user.name?.charAt(0)}
            className="ring-2 ring-white hover:scale-110 transition-transform duration-200"
          />
        ))}
        {remainingCount > 0 && (
          <div
            className={cn(
              "flex items-center justify-center rounded-full bg-gray-100 text-gray-600 font-medium ring-2 ring-white",
              sizeClasses[size]
            )}
          >
            +{remainingCount}
          </div>
        )}
      </div>
    </div>
  );
};

export default AvatarCluster;