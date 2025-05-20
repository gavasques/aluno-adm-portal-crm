
import React from "react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Search, Handshake } from "lucide-react";

interface PartnerHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  partnerTypeFilter: string;
  setPartnerTypeFilter: (type: string) => void;
  recommendedFilter: string;
  setRecommendedFilter: (value: string) => void;
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
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <motion.div 
          className="flex items-center gap-3"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-md p-3 text-white shadow-md">
            <Handshake size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-portal-dark">Parceiros</h1>
        </motion.div>
        <motion.p 
          className="text-muted-foreground mt-2 md:mt-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Encontre os melhores parceiros para seu negócio
        </motion.p>
      </div>
      
      <motion.div 
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-purple-500 transition-colors duration-300" size={18} />
          <Input
            placeholder="Buscar parceiros..."
            className="pl-10 transition-all duration-300 bg-white/90 border-purple-200 hover:border-purple-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <Select value={partnerTypeFilter} onValueChange={setPartnerTypeFilter}>
            <SelectTrigger className="w-[180px] bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 hover:border-blue-300 transition-colors">
              <SelectValue placeholder="Tipo de Parceiro" />
            </SelectTrigger>
            <SelectContent className="border-blue-200">
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="Agência">Agência</SelectItem>
              <SelectItem value="Consultor">Consultor</SelectItem>
              <SelectItem value="Serviço">Serviço</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={recommendedFilter} onValueChange={setRecommendedFilter}>
            <SelectTrigger className="w-[180px] bg-gradient-to-r from-green-50 to-blue-50 border-green-200 hover:border-green-300 transition-colors">
              <SelectValue placeholder="Recomendação" />
            </SelectTrigger>
            <SelectContent className="border-green-200">
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="recommended">Recomendados</SelectItem>
              <SelectItem value="not-recommended">Não Recomendados</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>
    </div>
  );
}
