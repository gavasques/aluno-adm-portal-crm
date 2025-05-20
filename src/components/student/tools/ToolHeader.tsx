
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
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
  setRecommendationFilter: (value: string) => void;
}

export function ToolHeader({
  searchQuery,
  setSearchQuery,
  softwareTypeFilter,
  setSoftwareTypeFilter,
  recommendationFilter,
  setRecommendationFilter
}: ToolHeaderProps) {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-portal-dark">Ferramentas</h1>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Buscar ferramentas..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={softwareTypeFilter} onValueChange={setSoftwareTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tipo de Ferramenta" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Tipos</SelectItem>
              <SelectItem value="Gestão Empresarial">Gestão Empresarial</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="Logística">Logística</SelectItem>
              <SelectItem value="Análise de Dados">Análise de Dados</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={recommendationFilter} onValueChange={setRecommendationFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Recomendação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="recommended">Ferramentas Recomendadas</SelectItem>
              <SelectItem value="not-recommended">Não Recomendadas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
