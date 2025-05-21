
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { Supplier } from "@/types/supplier.types";
import { motion } from "framer-motion";

interface DetailsTabProps {
  supplier: Supplier;
  onEdit: (supplier: Supplier) => void;
  isAdmin?: boolean;
}

const DetailsTab = ({ supplier, onEdit, isAdmin = true }: DetailsTabProps) => {
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <Card className="border-2 border-blue-100 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-blue-50/40 to-sky-50/40">
      <CardContent className="pt-6">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={item} className="group">
            <h3 className="text-sm font-medium text-gray-500 group-hover:text-blue-600 transition-colors duration-300">Nome</h3>
            <p className="mt-1 text-base font-medium text-gray-800">{supplier.name}</p>
          </motion.div>
          <motion.div variants={item} className="group">
            <h3 className="text-sm font-medium text-gray-500 group-hover:text-blue-600 transition-colors duration-300">Categoria</h3>
            <p className="mt-1 text-base">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {supplier.category}
              </span>
            </p>
          </motion.div>
          <motion.div variants={item} className="group">
            <h3 className="text-sm font-medium text-gray-500 group-hover:text-blue-600 transition-colors duration-300">Tipo</h3>
            <p className="mt-1 text-base">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                {supplier.type}
              </span>
            </p>
          </motion.div>
          <motion.div variants={item} className="group">
            <h3 className="text-sm font-medium text-gray-500 group-hover:text-blue-600 transition-colors duration-300">CNPJ</h3>
            <p className="mt-1 text-base font-mono">{supplier.cnpj}</p>
          </motion.div>
          <motion.div variants={item} className="group">
            <h3 className="text-sm font-medium text-gray-500 group-hover:text-blue-600 transition-colors duration-300">Email</h3>
            <p className="mt-1 text-base text-blue-600">{supplier.email}</p>
          </motion.div>
          <motion.div variants={item} className="group">
            <h3 className="text-sm font-medium text-gray-500 group-hover:text-blue-600 transition-colors duration-300">Telefone</h3>
            <p className="mt-1 text-base">{supplier.phone}</p>
          </motion.div>
          <motion.div variants={item} className="group">
            <h3 className="text-sm font-medium text-gray-500 group-hover:text-blue-600 transition-colors duration-300">Website</h3>
            <p className="mt-1 text-base">
              <a href={`https://${supplier.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline hover:text-blue-800 transition-colors duration-300 flex items-center">
                {supplier.website}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1.5">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </a>
            </p>
          </motion.div>
          <motion.div variants={item} className="group">
            <h3 className="text-sm font-medium text-gray-500 group-hover:text-blue-600 transition-colors duration-300">Status</h3>
            <p className="mt-1 text-base">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                supplier.status === "Ativo" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}>
                {supplier.status || "Ativo"}
              </span>
            </p>
          </motion.div>
          <motion.div variants={item} className="col-span-3 group">
            <h3 className="text-sm font-medium text-gray-500 group-hover:text-blue-600 transition-colors duration-300">Endereço</h3>
            <p className="mt-1 text-base">{supplier.address}</p>
          </motion.div>
        </motion.div>
        {isAdmin && (
          <motion.div 
            className="mt-6 flex justify-end space-x-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            <Button 
              variant="outline"
              onClick={() => onEdit(supplier)}
              className="group bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 hover:border-blue-300 hover:bg-gradient-to-r hover:from-blue-100 hover:to-indigo-100 shadow-sm hover:shadow transition-all duration-300"
            >
              <Edit className="h-4 w-4 mr-2 text-blue-600 group-hover:text-blue-700" /> 
              <span className="text-blue-600 group-hover:text-blue-700">Editar Fornecedor</span>
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default DetailsTab;
