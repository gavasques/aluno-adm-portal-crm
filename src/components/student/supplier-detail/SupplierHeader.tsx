
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface SupplierHeaderProps {
  supplier: any;
  onBack: () => void;
}

const SupplierHeader: React.FC<SupplierHeaderProps> = ({ supplier, onBack }) => {
  return (
    <motion.div 
      className="flex items-center mb-6"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Button 
        variant="ghost" 
        onClick={onBack} 
        className="mr-4 group hover:bg-purple-100 relative overflow-hidden"
      >
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-purple-100 to-indigo-100 opacity-0 group-hover:opacity-100"
          initial={false}
          animate={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
        <ArrowLeft className="mr-2 h-4 w-4 group-hover:text-purple-700 relative z-10" /> 
        <span className="group-hover:text-purple-700 relative z-10">Voltar</span>
      </Button>
      
      <div className="relative flex flex-col">
        <motion.h2 
          className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          {supplier.name}
        </motion.h2>
        
        <motion.div className="flex items-center gap-2 text-sm text-gray-500">
          <Badge className="bg-gradient-to-r from-amber-200 to-yellow-200 text-amber-800 border-none hover:from-amber-300 hover:to-yellow-300">
            {supplier.category}
          </Badge>
          
          {supplier.type && (
            <Badge className="bg-gradient-to-r from-blue-200 to-indigo-200 text-blue-800 border-none">
              {supplier.type}
            </Badge>
          )}
        </motion.div>
        
        <motion.div 
          className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ delay: 0.5, duration: 0.8 }}
        />
      </div>
    </motion.div>
  );
};

export default SupplierHeader;
