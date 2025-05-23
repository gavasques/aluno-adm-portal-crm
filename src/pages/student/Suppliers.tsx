
import React from "react";
import { motion } from "framer-motion";
import SupplierHeader from "@/components/student/suppliers/SupplierHeader";
import SupplierContent from "@/components/student/suppliers/SupplierContent";
import StudentRouteGuard from "@/components/student/RouteGuard";

const Suppliers = () => {
  return (
    <StudentRouteGuard requiredMenuKey="suppliers">
      <div className="container mx-auto py-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SupplierHeader />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <SupplierContent />
        </motion.div>
      </div>
    </StudentRouteGuard>
  );
};

export default Suppliers;
