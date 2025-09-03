import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  
  const navigation = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { name: "My Tasks", href: "/tasks", icon: "CheckSquare" },
    { name: "Schedule", href: "/schedule", icon: "Calendar" },
    { name: "Team", href: "/team", icon: "Users" },
    { name: "Announcements", href: "/announcements", icon: "Bell" }
  ];

  const NavItem = ({ item }) => {
    const isActive = location.pathname === item.href || 
                    (item.href !== "/" && location.pathname.startsWith(item.href));
    
    return (
      <NavLink
        to={item.href}
        onClick={() => onClose?.()}
        className={({ isActive: linkActive }) => cn(
          "group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 hover:scale-[1.02]",
          (isActive || linkActive)
            ? "bg-gradient-primary text-white shadow-md"
            : "text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-gray-50 hover:to-surface-50"
        )}
      >
        <ApperIcon 
          name={item.icon} 
          className={cn(
            "mr-3 h-5 w-5 transition-colors duration-200",
            isActive ? "text-white" : "text-gray-400 group-hover:text-gray-600"
          )} 
        />
        {item.name}
      </NavLink>
    );
  };

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200 shadow-sm">
      <div className="flex flex-col flex-1 min-h-0">
        <div className="flex items-center h-16 px-6 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-secondary-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <ApperIcon name="Building2" className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gradient-primary">WorkHub</h1>
              <p className="text-sm text-gray-600">Employee Portal</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 bg-surface-50">
<div className="flex items-center space-x-3 p-3 rounded-lg bg-white shadow-sm">
            <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
              <ApperIcon name="User" className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">User Profile</p>
              <p className="text-xs text-gray-500 truncate">WorkHub Employee</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Mobile Sidebar
  const MobileSidebar = () => (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 lg:hidden"
            onClick={onClose}
          >
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
          </motion.div>

          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-xl lg:hidden"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-secondary-50">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-primary rounded-lg">
                    <ApperIcon name="Building2" className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gradient-primary">WorkHub</h1>
                    <p className="text-sm text-gray-600">Employee Portal</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                >
                  <ApperIcon name="X" className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex-1 px-4 py-6 space-y-2">
                {navigation.map((item) => (
                  <NavItem key={item.name} item={item} />
                ))}
              </nav>

              <div className="p-4 border-t border-gray-200 bg-surface-50">
<div className="flex items-center space-x-3 p-3 rounded-lg bg-white shadow-sm">
                  <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                    <ApperIcon name="User" className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">User Profile</p>
                    <p className="text-xs text-gray-500 truncate">WorkHub Employee</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

export default Sidebar;