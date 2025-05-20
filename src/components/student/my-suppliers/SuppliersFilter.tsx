
import { Search, FileText, Tag, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface SuppliersFilterProps {
  nameFilter: string;
  setNameFilter: (value: string) => void;
  cnpjFilter: string;
  setCnpjFilter: (value: string) => void;
  brandFilter: string;
  setBrandFilter: (value: string) => void;
  contactFilter: string;
  setContactFilter: (value: string) => void;
  clearFilters: () => void;
  onAddSupplier: () => void;
}

export function SuppliersFilter({
  nameFilter,
  setNameFilter,
  cnpjFilter,
  setCnpjFilter,
  brandFilter,
  setBrandFilter,
  contactFilter,
  setContactFilter,
  clearFilters,
  onAddSupplier
}: SuppliersFilterProps) {
  return (
    <div className="flex flex-col gap-4 mb-6">
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
      >
        <motion.div className="relative" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" size={18} />
          <Input
            placeholder="Filtrar por Fornecedor..."
            className="pl-10 border-purple-200 focus:border-purple-500 transition-colors"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
          />
        </motion.div>
        
        <motion.div className="relative" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
          <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" size={18} />
          <Input
            placeholder="Filtrar por CNPJ..."
            className="pl-10 border-purple-200 focus:border-purple-500 transition-colors"
            value={cnpjFilter}
            onChange={(e) => setCnpjFilter(e.target.value)}
          />
        </motion.div>
        
        <motion.div className="relative" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
          <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" size={18} />
          <Input
            placeholder="Filtrar por Marca..."
            className="pl-10 border-purple-200 focus:border-purple-500 transition-colors"
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
          />
        </motion.div>
        
        <motion.div className="relative" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" size={18} />
          <Input
            placeholder="Filtrar por Contato..."
            className="pl-10 border-purple-200 focus:border-purple-500 transition-colors"
            value={contactFilter}
            onChange={(e) => setContactFilter(e.target.value)}
          />
        </motion.div>
      </motion.div>
      
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <motion.div 
          className="flex gap-2"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Button 
            variant="outline" 
            onClick={clearFilters} 
            size="sm"
            className="border-purple-200 hover:bg-purple-100 hover:text-purple-700 transition-colors"
          >
            Limpar Filtros
          </Button>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.02 }}
        >
          <Button 
            onClick={onAddSupplier}
            className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
              <path d="M5 12h14"></path>
              <path d="M12 5v14"></path>
            </svg> Adicionar Fornecedor
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
