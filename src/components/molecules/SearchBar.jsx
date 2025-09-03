import React, { useState } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const SearchBar = React.forwardRef(({ 
  className,
  placeholder = "Search...",
  onSearch,
  debounceMs = 300,
  ...props 
}, ref) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debounceRef = React.useRef(null);

  const handleSearch = (value) => {
    setSearchTerm(value);
    
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      onSearch?.(value);
    }, debounceMs);
  };

  return (
    <div className={cn("relative", className)}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <ApperIcon name="Search" className="h-5 w-5 text-gray-400" />
      </div>
      <input
        ref={ref}
        type="text"
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-colors duration-200"
        placeholder={placeholder}
        {...props}
      />
    </div>
  );
});

SearchBar.displayName = "SearchBar";

export default SearchBar;