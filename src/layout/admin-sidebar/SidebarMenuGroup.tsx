
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { MenuItem } from "./types";

interface SidebarMenuGroupProps {
  title: string;
  items: MenuItem[];
}

export const SidebarMenuGroup: React.FC<SidebarMenuGroupProps> = ({ title, items }) => {
  return (
    <motion.div 
      className="mb-6"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2 px-4 mb-3">
        <Sparkles className="h-3 w-3 text-blue-500" />
        <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {title}
        </h3>
      </div>
      <div className="space-y-1 px-2">
        {items.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <NavLink
              to={item.href}
              className={({ isActive }) =>
                `group flex items-center space-x-3 px-4 py-3 mx-1 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden ${
                  isActive
                    ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-700 dark:text-blue-300 shadow-modern-1"
                    : "text-slate-700 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-100"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Active indicator */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        exit={{ scaleY: 0 }}
                        className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500 rounded-r-full"
                      />
                    )}
                  </AnimatePresence>
                  
                  {/* Icon with gradient background */}
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${item.gradient} shadow-modern-1 group-hover:shadow-modern-2 transition-shadow`}>
                    <item.icon className="h-4 w-4 text-white" />
                  </div>
                  
                  <span className="truncate font-medium">{item.title}</span>
                  
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                </>
              )}
            </NavLink>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
