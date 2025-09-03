import React from "react";
import { cn } from "@/utils/cn";

const Card = React.forwardRef(({ 
  className, 
  variant = "default",
  children,
  ...props 
}, ref) => {
  const variants = {
    default: "bg-white border border-gray-200 shadow-md hover:shadow-lg transition-all duration-200",
    elevated: "bg-white shadow-lg hover:shadow-xl transition-all duration-200",
    glass: "bg-white/80 backdrop-blur-glass border border-white/20 shadow-lg hover:shadow-xl transition-all duration-200",
    gradient: "bg-gradient-to-br from-white to-surface-50 border border-gray-100 shadow-md hover:shadow-lg transition-all duration-200"
  };

  return (
    <div
      ref={ref}
      className={cn("rounded-lg p-6", variants[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;