
import React from "react";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Search } from "lucide-react";

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
    <div>
      <h1 className="text-3xl font-bold mb-8 text-portal-dark">Parceiros</h1>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Buscar parceiros..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <Select value={partnerTypeFilter} onValueChange={setPartnerTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tipo de Parceiro" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="Agência">Agência</SelectItem>
              <SelectItem value="Consultor">Consultor</SelectItem>
              <SelectItem value="Serviço">Serviço</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={recommendedFilter} onValueChange={setRecommendedFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Recomendação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="recommended">Recomendados</SelectItem>
              <SelectItem value="not-recommended">Não Recomendados</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
