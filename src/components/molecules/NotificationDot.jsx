import React from "react";
import { cn } from "@/utils/cn";

const NotificationDot = ({ 
  show = false, 
  count,
  className,
  children 
}) => {
  return (
    <div className={cn("relative inline-flex", className)}>
      {children}
      {show && (
        <div className="absolute -top-1 -right-1 flex items-center justify-center">
          {count !== undefined ? (
            <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full min-w-[20px] h-5 animate-pulse-ring">
              {count > 99 ? "99+" : count}
            </span>
          ) : (
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse-ring" />
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDot;