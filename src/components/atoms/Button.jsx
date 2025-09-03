import React from "react";
import { cn } from "@/utils/cn";

const Button = React.forwardRef(({ 
  className, 
  variant = "default", 
  size = "default", 
  children,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    default: "bg-gradient-primary text-white shadow-md hover:shadow-lg hover:scale-[1.02] focus-visible:ring-primary-500",
    secondary: "bg-gradient-secondary text-white shadow-md hover:shadow-lg hover:scale-[1.02] focus-visible:ring-secondary-500",
    accent: "bg-gradient-accent text-white shadow-md hover:shadow-lg hover:scale-[1.02] focus-visible:ring-accent-500",
    outline: "border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-400 focus-visible:ring-primary-500",
    ghost: "text-gray-700 hover:bg-gray-100 focus-visible:ring-primary-500",
    danger: "bg-red-500 text-white shadow-md hover:bg-red-600 hover:shadow-lg hover:scale-[1.02] focus-visible:ring-red-500"
  };
  
  const sizes = {
    sm: "h-8 px-3 text-xs",
    default: "h-10 px-4 py-2 text-sm",
    lg: "h-12 px-6 text-base",
    icon: "h-10 w-10"
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;