
import React from "react";
import { motion } from "framer-motion";
import ToolHeader from "@/components/student/tools/ToolHeader";
import ToolContent from "@/components/student/tools/ToolContent";
import StudentRouteGuard from "@/components/student/RouteGuard";

const Tools = () => {
  return (
    <StudentRouteGuard requiredMenuKey="tools">
      <div className="container mx-auto py-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ToolHeader />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <ToolContent />
        </motion.div>
      </div>
    </StudentRouteGuard>
  );
};

export default Tools;
