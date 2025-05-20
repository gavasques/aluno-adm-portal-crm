
import React from "react";
import { Input } from "@/components/ui/input";
import { Search, Wrench } from "lucide-react";
import { motion } from "framer-motion";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

interface ToolHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  softwareTypeFilter: string;
  setSoftwareTypeFilter: (type: string) => void;
  recommendationFilter: string;
  setRecommendationFilter: (value: string) => void;
  canalFilter: string;
  setCanalFilter: (value: string) => void;
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
    <div className="animate-fade-in">
      <motion.div 
        className="flex flex-col md:flex-row md:items-center justify-between mb-6"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-teal-500 to-emerald-500 rounded-md p-3 text-white shadow-md">
            <Wrench size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-portal-dark">Ferramentas</h1>
        </div>
        <motion.p 
          className="text-muted-foreground mt-2 md:mt-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Encontre as melhores ferramentas para seu e-commerce
        </motion.p>
      </motion.div>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Card className="bg-white/80 backdrop-blur-sm border border-teal-100 shadow-md mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-teal-500 transition-colors duration-300" size={18} />
                <Input
                  placeholder="Buscar ferramentas..."
                  className="pl-10 transition-all duration-300 border-teal-200 hover:border-teal-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Select value={softwareTypeFilter} onValueChange={setSoftwareTypeFilter}>
                  <SelectTrigger className="w-[180px] bg-gradient-to-r from-teal-50 to-emerald-50 border-teal-200 hover:border-teal-300 transition-colors">
                    <SelectValue placeholder="Tipo de Ferramenta" />
                  </SelectTrigger>
                  <SelectContent className="border-teal-200">
                    <SelectItem value="all">Todos os Tipos</SelectItem>
                    <SelectItem value="Gestão Empresarial">Gestão Empresarial</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Logística">Logística</SelectItem>
                    <SelectItem value="Análise de Dados">Análise de Dados</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={recommendationFilter} onValueChange={setRecommendationFilter}>
                  <SelectTrigger className="w-[180px] bg-gradient-to-r from-green-50 to-teal-50 border-green-200 hover:border-green-300 transition-colors">
                    <SelectValue placeholder="Recomendação" />
                  </SelectTrigger>
                  <SelectContent className="border-green-200">
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="recommended">Ferramentas Recomendadas</SelectItem>
                    <SelectItem value="not-recommended">Não Recomendadas</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={canalFilter} onValueChange={setCanalFilter}>
                  <SelectTrigger className="w-[180px] bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 hover:border-blue-300 transition-colors">
                    <SelectValue placeholder="Canal" />
                  </SelectTrigger>
                  <SelectContent className="border-blue-200">
                    <SelectItem value="all">Todos os Canais</SelectItem>
                    <SelectItem value="Amazon">Amazon</SelectItem>
                    <SelectItem value="Meli">Meli</SelectItem>
                    <SelectItem value="Magalu">Magalu</SelectItem>
                    <SelectItem value="Shopee">Shopee</SelectItem>
                    <SelectItem value="Ecommerce">Ecommerce</SelectItem>
                    {canals.filter(canal => 
                      !["Amazon", "Meli", "Magalu", "Shopee", "Ecommerce"].includes(canal)
                    ).map(canal => (
                      <SelectItem key={canal} value={canal}>{canal}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
