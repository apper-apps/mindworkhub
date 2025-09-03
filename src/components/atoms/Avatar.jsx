import React from "react";
import { cn } from "@/utils/cn";

const Avatar = React.forwardRef(({ 
  className,
  src,
  alt,
  size = "default",
  fallback,
  ...props 
}, ref) => {
  const sizes = {
    sm: "h-8 w-8",
    default: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-16 w-16"
  };

  const textSizes = {
    sm: "text-xs",
    default: "text-sm",
    lg: "text-base",
    xl: "text-lg"
  };

  if (src) {
    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        className={cn("rounded-full object-cover ring-2 ring-white shadow-sm", sizes[size], className)}
        {...props}
      />
    );
  }

  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-center rounded-full bg-gradient-primary text-white font-medium ring-2 ring-white shadow-sm",
        sizes[size],
        textSizes[size],
        className
      )}
      {...props}
    >
      {fallback || "?"}
    </div>
  );
});

Avatar.displayName = "Avatar";

export default Avatar;