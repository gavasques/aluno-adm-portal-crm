
import React from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { MenuItem } from "./types";

interface SidebarMenuGroupProps {
  title: string;
  items: MenuItem[];
}

export const SidebarMenuGroup: React.FC<SidebarMenuGroupProps> = ({ title, items }) => {
  return (
    <motion.div 
      className="mb-8"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="px-6 mb-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          {title}
        </h3>
      </div>
      <div className="space-y-1 px-3">
        {items.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <NavLink
              to={item.href}
              className={({ isActive }) =>
                `group flex items-center space-x-3 px-3 py-3 mx-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-blue-50 text-blue-700 shadow-sm"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              {/* Icon with gradient background */}
              <div className={`p-2 rounded-lg ${item.gradient} shadow-sm group-hover:shadow-md transition-shadow`}>
                <item.icon className="h-5 w-5 text-white" />
              </div>
              
              <span className="truncate font-medium">{item.title}</span>
            </NavLink>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
