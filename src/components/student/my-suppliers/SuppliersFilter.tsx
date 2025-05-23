
import { Search, FileText, Tag, User, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { memo } from "react";

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
  hasActiveFilters: boolean;
}

export const SuppliersFilter = memo(({
  nameFilter,
  setNameFilter,
  cnpjFilter,
  setCnpjFilter,
  brandFilter,
  setBrandFilter,
  contactFilter,
  setContactFilter,
  clearFilters,
  hasActiveFilters
}: SuppliersFilterProps) => {
  const activeFiltersCount = [nameFilter, cnpjFilter, brandFilter, contactFilter].filter(Boolean).length;

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 flex-1"
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
            {nameFilter && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => setNameFilter("")}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </motion.div>
          
          <motion.div className="relative" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
            <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" size={18} />
            <Input
              placeholder="Filtrar por CNPJ..."
              className="pl-10 border-purple-200 focus:border-purple-500 transition-colors"
              value={cnpjFilter}
              onChange={(e) => setCnpjFilter(e.target.value)}
            />
            {cnpjFilter && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => setCnpjFilter("")}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </motion.div>
          
          <motion.div className="relative" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" size={18} />
            <Input
              placeholder="Filtrar por Marca..."
              className="pl-10 border-purple-200 focus:border-purple-500 transition-colors"
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
            />
            {brandFilter && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => setBrandFilter("")}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </motion.div>
          
          <motion.div className="relative" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" size={18} />
            <Input
              placeholder="Filtrar por Contato..."
              className="pl-10 border-purple-200 focus:border-purple-500 transition-colors"
              value={contactFilter}
              onChange={(e) => setContactFilter(e.target.value)}
            />
            {contactFilter && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => setContactFilter("")}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="flex items-center gap-2 lg:flex-shrink-0"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          {hasActiveFilters && (
            <Badge variant="secondary" className="text-purple-700 bg-purple-100">
              {activeFiltersCount} filtro{activeFiltersCount > 1 ? 's' : ''} ativo{activeFiltersCount > 1 ? 's' : ''}
            </Badge>
          )}
          <Button 
            variant="outline" 
            onClick={clearFilters} 
            size="sm"
            className="border-purple-200 hover:bg-purple-100 hover:text-purple-700 transition-colors"
            disabled={!hasActiveFilters}
          >
            Limpar Filtros
          </Button>
        </motion.div>
      </div>
    </div>
  );
});

SuppliersFilter.displayName = "SuppliersFilter";
