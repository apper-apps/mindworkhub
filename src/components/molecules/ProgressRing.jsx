import React from "react";
import { cn } from "@/utils/cn";

const ProgressRing = ({ 
  progress = 0, 
  size = 60, 
  strokeWidth = 6,
  className,
  color = "primary",
  showPercentage = true,
  children
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const colors = {
    primary: "#2563EB",
    secondary: "#7C3AED",
    accent: "#10B981",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444"
  };

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors[color]}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children || (showPercentage && (
          <span className="text-sm font-semibold text-gray-700">
            {Math.round(progress)}%
          </span>
        ))}
      </div>
    </div>
  );
};

export default ProgressRing;