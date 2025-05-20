
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-white to-teal-50">
          <CardHeader className="bg-gradient-to-r from-teal-600 to-emerald-500 text-white">
            <CardTitle className="flex items-center justify-between">
              <span>Lista de Ferramentas</span>
              <span className="text-sm bg-white/20 px-2 py-1 rounded-full">
                {tools.length} encontrada(s)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4">
                <Skeleton className="h-10 w-full mb-4" />
                <Skeleton className="h-12 w-full mb-2" />
                <Skeleton className="h-12 w-full mb-2" />
                <Skeleton className="h-12 w-full mb-2" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (
              <ToolsTable 
                tools={tools}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={onSort}
                onOpenTool={handleOpenTool}
              />
            )}
          </CardContent>
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
