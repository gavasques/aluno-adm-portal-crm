
import React from "react";
import { motion } from "framer-motion";
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
    canalFilter,
    setCanalFilter,
    canals,
    sortField,
    sortDirection,
    handleSort,
    selectedTool,
    setSelectedTool,
    filteredTools,
    handleUpdateTool
  } = useTools(isAdmin);
  
  return (
    <motion.div 
      className="container mx-auto py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {!selectedTool && (
        <ToolHeader 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          softwareTypeFilter={softwareTypeFilter}
          setSoftwareTypeFilter={setSoftwareTypeFilter}
          recommendationFilter={recommendationFilter}
          setRecommendationFilter={setRecommendationFilter}
          canalFilter={canalFilter}
          setCanalFilter={setCanalFilter}
          canals={canals}
        />
      )}
      
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
      
      <Toaster />
    </motion.div>
  );
};

export default Tools;
