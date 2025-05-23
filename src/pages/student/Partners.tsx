
import React from "react";
import { motion } from "framer-motion";
import PartnerHeader from "@/components/student/partners/PartnerHeader";
import PartnerContent from "@/components/student/partners/PartnerContent";
import StudentRouteGuard from "@/components/student/RouteGuard";

const Partners = () => {
  return (
    <StudentRouteGuard requiredMenuKey="partners">
      <div className="container mx-auto py-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <PartnerHeader />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <PartnerContent />
        </motion.div>
      </div>
    </StudentRouteGuard>
  );
};

export default Partners;
