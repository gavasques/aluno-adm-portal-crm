
import React from "react";
import { motion } from "framer-motion";
import { ToolHeader } from "@/components/student/tools/ToolHeader";
import { ToolContent } from "@/components/student/tools/ToolContent";
import StudentRouteGuard from "@/components/student/RouteGuard";
import { useTools } from "@/hooks/student/useTools";

const Tools = () => {
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
    filteredTools,
    sortField,
    sortDirection,
    handleSort,
    selectedTool,
    setSelectedTool,
    handleUpdateTool
  } = useTools(false); // Pass false for student mode

  return (
    <StudentRouteGuard requiredMenuKey="tools">
      <div className="w-full space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <ToolContent
            tools={filteredTools}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            selectedTool={selectedTool}
            setSelectedTool={setSelectedTool}
            isAdmin={false}
            onUpdateTool={handleUpdateTool}
          />
        </motion.div>
      </div>
    </StudentRouteGuard>
  );
};

export default Tools;
