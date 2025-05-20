
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tool } from "@/components/tools/ToolsTable";
import ToolsTable from "@/components/tools/ToolsTable";
import ToolDetailDialog from "@/components/tools/ToolDetailDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

interface ToolContentProps {
  tools: Tool[];
  sortField: string;
  sortDirection: string;
  onSort: (field: string) => void;
  selectedTool: Tool | null;
  setSelectedTool: (tool: Tool | null) => void;
  isAdmin: boolean;
  onUpdateTool: (tool: Tool) => void;
}

export function ToolContent({
  tools,
  sortField,
  sortDirection,
  onSort,
  selectedTool,
  setSelectedTool,
  isAdmin,
  onUpdateTool
}: ToolContentProps) {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Simular tempo de carregamento para mostrar o skeleton
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    
    return () => clearTimeout(timer);
  }, []);

  const handleOpenTool = (tool: Tool) => {
    setSelectedTool(tool);
  };
  
  const handleCloseTool = () => {
    setSelectedTool(null);
  };
  
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="overflow-hidden border border-gray-100 shadow-sm">
          {isLoading ? (
            <div className="p-4">
              <Skeleton className="h-10 w-full mb-4" />
              <Skeleton className="h-12 w-full mb-2" />
              <Skeleton className="h-12 w-full mb-2" />
              <Skeleton className="h-12 w-full mb-2" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <CardContent className="p-0">
              <ToolsTable 
                tools={tools}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={onSort}
                onOpenTool={handleOpenTool}
              />
            </CardContent>
          )}
        </Card>
      </motion.div>

      {/* Dialog para detalhes da ferramenta */}
      <ToolDetailDialog
        tool={selectedTool}
        isAdmin={isAdmin}
        isOpen={!!selectedTool}
        onClose={handleCloseTool}
        onUpdateTool={onUpdateTool}
      />
    </>
  );
}
