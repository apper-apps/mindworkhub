import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import NotificationDot from "@/components/molecules/NotificationDot";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ onMenuToggle, title = "Dashboard" }) => {
  const [searchTerm, setSearchTerm] = React.useState("");

  const handleSearch = (term) => {
    setSearchTerm(term);
    // Implement search functionality
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuToggle}
            className="lg:hidden"
          >
            <ApperIcon name="Menu" className="h-5 w-5" />
          </Button>
          
          <div className="hidden lg:block">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold font-display text-gray-900"
            >
              {title}
            </motion.h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:block w-80">
            <SearchBar
              placeholder="Search tasks, people, or announcements..."
              onSearch={handleSearch}
            />
          </div>

          <div className="flex items-center space-x-2">
            <NotificationDot show count={3}>
              <Button variant="ghost" size="icon" className="relative">
                <ApperIcon name="Bell" className="h-5 w-5" />
              </Button>
            </NotificationDot>

            <Button variant="ghost" size="icon">
              <ApperIcon name="Settings" className="h-5 w-5" />
            </Button>

            <div className="hidden sm:flex items-center space-x-3 ml-4 pl-4 border-l border-gray-200">
              <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                <ApperIcon name="User" className="h-4 w-4 text-white" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">John Doe</p>
                <p className="text-xs text-gray-500">Software Developer</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile search */}
      <div className="md:hidden px-4 pb-4">
        <SearchBar
          placeholder="Search..."
          onSearch={handleSearch}
        />
      </div>
    </header>
  );
};

export default Header;