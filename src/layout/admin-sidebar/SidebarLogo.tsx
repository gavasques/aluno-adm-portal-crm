
import React from "react";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";

export const SidebarLogo: React.FC = () => {
  return (
    <motion.div 
      className="p-6 border-b border-gray-800 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
          <Shield className="h-6 w-6 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold text-white">
            Admin
          </span>
          <span className="text-xs text-gray-400 font-medium">
            Dashboard
          </span>
        </div>
      </div>
    </motion.div>
  );
};
