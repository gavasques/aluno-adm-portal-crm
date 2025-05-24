
import React from "react";
import { motion } from "framer-motion";
import { MySupplier } from "@/types/my-suppliers.types";
import SupplierDetail from "@/components/student/SupplierDetail";

interface MySupplierDetailViewProps {
  supplier: MySupplier;
  onBack: () => void;
  onUpdate: (updatedSupplier: MySupplier) => void;
}

export const MySupplierDetailView: React.FC<MySupplierDetailViewProps> = ({
  supplier,
  onBack,
  onUpdate
}) => {
  return (
    <motion.div
      key="supplier-detail"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
    >
      <SupplierDetail
        supplier={supplier}
        onBack={onBack}
        onUpdate={onUpdate}
      />
    </motion.div>
  );
};
