
import { Tool } from "@/components/tools/ToolsTable";

export const filterTools = (
  tools: Tool[],
  searchQuery: string,
  softwareTypeFilter: string,
  recommendationFilter: string,
  canalFilter: string
): Tool[] => {
  return tools.filter(tool => {
    // Filtro de pesquisa
    const matchesSearch = 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.provider.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filtro por tipo
    const matchesType = 
      softwareTypeFilter === "all" || 
      tool.category === softwareTypeFilter;
    
    // Filtro por recomendação
    const matchesRecommendation = 
      recommendationFilter === "all" || 
      (recommendationFilter === "recommended" && tool.recommended) ||
      (recommendationFilter === "not-recommended" && tool.notRecommended);
      
    // Filtro por canal
    const matchesCanal =
      canalFilter === "all" ||
      tool.canal === canalFilter;
    
    return matchesSearch && matchesType && matchesRecommendation && matchesCanal;
  });
};

export const sortTools = (
  tools: Tool[],
  sortField: string,
  sortDirection: string
): Tool[] => {
  return [...tools].sort((a, b) => {
    let valA: any, valB: any;
    
    switch (sortField) {
      case "name":
        valA = a.name;
        valB = b.name;
        break;
      case "category":
        valA = a.category;
        valB = b.category;
        break;
      case "provider":
        valA = a.provider;
        valB = b.provider;
        break;
      case "rating":
        valA = a.rating;
        valB = b.rating;
        break;
      default:
        valA = a.name;
        valB = b.name;
    }
    
    if (sortDirection === "asc") {
      return valA > valB ? 1 : -1;
    } else {
      return valA < valB ? 1 : -1;
    }
  });
};

export const getUniqueCanals = (tools: Tool[]): string[] => {
  return Array.from(new Set(tools.filter(tool => tool.canal).map(tool => tool.canal))) as string[];
};
