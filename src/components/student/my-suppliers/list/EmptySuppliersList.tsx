
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { motion } from "framer-motion";
import { memo, useCallback } from "react";

interface EmptySupplierListProps {
  onAddSupplier: () => void;
}

export const EmptySuppliersList = memo(({ onAddSupplier }: EmptySupplierListProps) => {
  const handleAddSupplier = useCallback(() => {
    onAddSupplier();
  }, [onAddSupplier]);

  return (
    <TableRow>
      <TableCell colSpan={5} className="text-center py-16">
        <motion.div 
          className="flex flex-col items-center justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center mb-3 shadow-inner"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <line x1="19" y1="8" x2="19" y2="14"></line>
              <line x1="22" y1="11" x2="16" y2="11"></line>
            </svg>
          </motion.div>
          <motion.h3 
            className="text-xl font-medium text-gray-700 mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Nenhum fornecedor encontrado
          </motion.h3>
          <motion.p 
            className="text-gray-500 mb-6 text-center max-w-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Adicione seu primeiro fornecedor para começar a organizar sua rede de suprimentos.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button 
              onClick={handleAddSupplier}
              className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
                <path d="M5 12h14"></path>
                <path d="M12 5v14"></path>
              </svg> Adicionar Fornecedor
            </Button>
          </motion.div>
        </motion.div>
      </TableCell>
    </TableRow>
  );
});

EmptySuppliersList.displayName = "EmptySuppliersList";
