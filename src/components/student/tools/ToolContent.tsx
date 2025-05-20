
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tool } from "@/components/tools/ToolsTable";
import ToolsTable from "@/components/tools/ToolsTable";
import ToolDetailDialog from "@/components/tools/ToolDetailDialog";

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
  const handleOpenTool = (tool: Tool) => {
    setSelectedTool(tool);
  };
  
  const handleCloseTool = () => {
    setSelectedTool(null);
  };
  
  return (
    <>
      <Card>
        <CardContent className="p-0">
          <ToolsTable 
            tools={tools}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={onSort}
            onOpenTool={handleOpenTool}
          />
        </CardContent>
      </Card>

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
