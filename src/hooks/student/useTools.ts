
import { useState, useMemo } from "react";
import { Tool } from "@/components/tools/ToolsTable";
import { TOOLS } from "@/data/toolsData";
import { filterTools, sortTools, getUniqueCanals } from "@/utils/toolsUtils";

export const useTools = (isAdmin: boolean = false) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [softwareTypeFilter, setSoftwareTypeFilter] = useState("all");
  const [recommendationFilter, setRecommendationFilter] = useState("all");
  const [canalFilter, setCanalFilter] = useState("all");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [tools, setTools] = useState<Tool[]>(TOOLS);
  
  // Get unique canals
  const canals = useMemo(() => getUniqueCanals(tools), [tools]);
  
  // Handler para ordenação
  const handleSort = (field: string) => {
    const newDirection = sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(newDirection);
  };
  
  // Handler para atualizar ferramenta
  const handleUpdateTool = (updatedTool: Tool) => {
    setTools(tools.map(tool => 
      tool.id === updatedTool.id ? updatedTool : tool
    ));
    setSelectedTool(updatedTool);
  };
  
  // Filtrar e ordenar ferramentas com base na consulta de pesquisa e filtros
  const filteredTools = useMemo(() => {
    const filtered = filterTools(tools, searchQuery, softwareTypeFilter, recommendationFilter, canalFilter);
    return sortTools(filtered, sortField, sortDirection);
  }, [searchQuery, softwareTypeFilter, recommendationFilter, canalFilter, sortField, sortDirection, tools]);
  
  return {
    searchQuery,
    setSearchQuery,
    softwareTypeFilter,
    setSoftwareTypeFilter,
    recommendationFilter,
    setRecommendationFilter,
    canalFilter,
    setCanalFilter,
    canals,
    sortField,
    sortDirection,
    handleSort,
    selectedTool,
    setSelectedTool,
    tools,
    setTools,
    filteredTools,
    handleUpdateTool,
    isAdmin
  };
};
