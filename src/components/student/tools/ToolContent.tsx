
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ToolsTable, { Tool } from "@/components/tools/ToolsTable";
import ToolDetail from "@/components/student/tools/ToolDetail";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular tempo de carregamento para mostrar o skeleton
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {!selectedTool ? (
        <motion.div
          key="tool-list"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-white to-green-50">
            <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white py-[9px] px-[12px] mx-0 my-0">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold">Lista de Ferramentas</span>
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.3 }}
                    className="bg-white/20 px-3 py-1.5 rounded-full text-sm font-medium"
                  >
                    {tools.length} encontrada(s)
                  </motion.div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <motion.div
                  className="p-6 space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Skeleton className="h-10 w-full mb-4" />
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1, duration: 0.3 }}
                    >
                      <Skeleton className="h-16 w-full mb-2 rounded-md" />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  <ToolsTable
                    tools={tools}
                    onOpenTool={setSelectedTool}
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onSort={onSort}
                  />
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          key="tool-detail"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-lg shadow-xl border border-green-100 overflow-hidden"
        >
          <ToolDetail
            tool={selectedTool}
            onClose={() => setSelectedTool(null)}
            onUpdateTool={onUpdateTool}
            isAdmin={isAdmin}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
