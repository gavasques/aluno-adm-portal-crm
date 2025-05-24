
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ToolHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  softwareTypeFilter: string;
  setSoftwareTypeFilter: (type: string) => void;
  recommendationFilter: string;
  setRecommendationFilter: (filter: string) => void;
  canalFilter: string;
  setCanalFilter: (canal: string) => void;
  canals: string[];
}

export function ToolHeader({
  searchQuery,
  setSearchQuery,
  softwareTypeFilter,
  setSoftwareTypeFilter,
  recommendationFilter,
  setRecommendationFilter,
  canalFilter,
  setCanalFilter,
  canals
}: ToolHeaderProps) {
  return (
    <div className="animate-fade-in mb-8">
      <motion.div 
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-green-500 transition-colors duration-300" size={18} />
          <Input
            placeholder="Buscar ferramentas..."
            className="pl-10 transition-all duration-300 bg-white/90 border-green-200 hover:border-green-400 focus:border-green-500 focus:ring-1 focus:ring-green-500 shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <Select value={softwareTypeFilter} onValueChange={setSoftwareTypeFilter}>
            <SelectTrigger className="w-[160px] bg-gradient-to-r from-green-50 to-white border-green-200 hover:border-green-300">
              <SelectValue placeholder="Tipo Software" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="SaaS">SaaS</SelectItem>
              <SelectItem value="Desktop">Desktop</SelectItem>
              <SelectItem value="Mobile">Mobile</SelectItem>
              <SelectItem value="Web">Web</SelectItem>
            </SelectContent>
          </Select>

          <Select value={recommendationFilter} onValueChange={setRecommendationFilter}>
            <SelectTrigger className="w-[140px] bg-gradient-to-r from-blue-50 to-white border-blue-200 hover:border-blue-300">
              <SelectValue placeholder="Recomendação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="recommended">Recomendado</SelectItem>
              <SelectItem value="not-recommended">Não Recomendado</SelectItem>
            </SelectContent>
          </Select>

          <Select value={canalFilter} onValueChange={setCanalFilter}>
            <SelectTrigger className="w-[120px] bg-gradient-to-r from-purple-50 to-white border-purple-200 hover:border-purple-300">
              <SelectValue placeholder="Canal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {canals.map((canal) => (
                <SelectItem key={canal} value={canal}>
                  {canal}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </motion.div>
    </div>
  );
}
