
import React from "react";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";

export const SidebarLogo: React.FC = () => {
  return (
    <motion.div 
      className="p-6 border-b border-white/10 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <Shield className="h-4 w-4 text-white" />
        </div>
        <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Admin
        </span>
      </div>
    </motion.div>
  );
};
