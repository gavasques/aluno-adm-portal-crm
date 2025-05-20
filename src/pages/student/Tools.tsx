
import React from "react";
import { useLocation } from "react-router-dom";
import { useTools } from "@/hooks/student/useTools";
import { ToolHeader } from "@/components/student/tools/ToolHeader";
import { ToolContent } from "@/components/student/tools/ToolContent";
import { Toaster } from "@/components/ui/sonner";

const Tools = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  
  const {
    searchQuery,
    setSearchQuery,
    softwareTypeFilter,
    setSoftwareTypeFilter,
    recommendationFilter,
    setRecommendationFilter,
    sortField,
    sortDirection,
    handleSort,
    selectedTool,
    setSelectedTool,
    filteredTools,
    handleUpdateTool
  } = useTools(isAdmin);
  
  return (
    <>
      <div className="container mx-auto py-6">
        <ToolHeader 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          softwareTypeFilter={softwareTypeFilter}
          setSoftwareTypeFilter={setSoftwareTypeFilter}
          recommendationFilter={recommendationFilter}
          setRecommendationFilter={setRecommendationFilter}
        />
        
        <ToolContent 
          tools={filteredTools}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
          selectedTool={selectedTool}
          setSelectedTool={setSelectedTool}
          isAdmin={isAdmin}
          onUpdateTool={handleUpdateTool}
        />
      </div>
      <Toaster />
    </>
  );
};

export default Tools;
