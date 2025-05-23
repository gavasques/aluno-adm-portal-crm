
import React from "react";
import { motion } from "framer-motion";
import SupplierForm from "@/components/student/my-suppliers/SupplierForm";
import SuppliersList from "@/components/student/my-suppliers/SuppliersList";
import StudentRouteGuard from "@/components/student/RouteGuard";

const MySuppliers = () => {
  return (
    <StudentRouteGuard requiredMenuKey="my-suppliers">
      <div className="container mx-auto py-6 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Meus Fornecedores</h1>
              <p className="text-gray-600 mt-2">
                Gerencie seus fornecedores pessoais e mantenha seus dados organizados.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <SupplierForm />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <SuppliersList />
        </motion.div>
      </div>
    </StudentRouteGuard>
  );
};

export default MySuppliers;
