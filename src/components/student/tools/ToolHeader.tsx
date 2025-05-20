
import React from "react";
import { Input } from "@/components/ui/input";
import { Search, Tool } from "lucide-react";
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
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-portal-accent rounded-md p-2 text-white">
            <Tool size={24} />
          </div>
          <h1 className="text-3xl font-bold text-portal-dark">Ferramentas</h1>
        </div>
        <p className="text-muted-foreground mt-2 md:mt-0">
          Encontre as melhores ferramentas para seu e-commerce
        </p>
      </div>
      
      <Card className="bg-white/70 backdrop-blur-sm border border-gray-100 shadow-sm mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Buscar ferramentas..."
                className="pl-10 transition-all duration-300 border-gray-200 hover:border-portal-accent focus:border-portal-accent focus:ring-1 focus:ring-portal-accent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Select value={softwareTypeFilter} onValueChange={setSoftwareTypeFilter}>
                <SelectTrigger className="w-[180px] border-gray-200 hover:border-portal-accent transition-colors">
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
                <SelectTrigger className="w-[180px] border-gray-200 hover:border-portal-accent transition-colors">
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
        </CardContent>
      </Card>
    </div>
  );
}
