
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PartnerHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  partnerTypeFilter: string;
  setPartnerTypeFilter: (type: string) => void;
  recommendedFilter: string;
  setRecommendedFilter: (filter: string) => void;
}

export function PartnerHeader({
  searchQuery,
  setSearchQuery,
  partnerTypeFilter,
  setPartnerTypeFilter,
  recommendedFilter,
  setRecommendedFilter
}: PartnerHeaderProps) {
  return (
    <div className="animate-fade-in mb-8">
      <motion.div 
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" size={18} />
          <Input
            placeholder="Buscar parceiros..."
            className="pl-10 transition-all duration-300 bg-white/90 border-blue-200 hover:border-blue-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <Select value={partnerTypeFilter} onValueChange={setPartnerTypeFilter}>
            <SelectTrigger className="w-[140px] bg-gradient-to-r from-blue-50 to-white border-blue-200 hover:border-blue-300">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos</SelectItem>
              <SelectItem value="Agência">Agência</SelectItem>
              <SelectItem value="Serviço">Serviço</SelectItem>
              <SelectItem value="Consultor">Consultor</SelectItem>
            </SelectContent>
          </Select>

          <Select value={recommendedFilter} onValueChange={setRecommendedFilter}>
            <SelectTrigger className="w-[140px] bg-gradient-to-r from-green-50 to-white border-green-200 hover:border-green-300">
              <SelectValue placeholder="Recomendação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos</SelectItem>
              <SelectItem value="recommended">Recomendado</SelectItem>
              <SelectItem value="not-recommended">Não Recomendado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>
    </div>
  );
}
