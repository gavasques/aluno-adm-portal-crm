
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { motion } from 'framer-motion';
import { CRMLead, CRMPipelineColumn } from '@/types/crm.types';
import { DesignCard } from '@/design-system';
import OptimizedKanbanLeadCard from './OptimizedKanbanLeadCard';
import { cn } from '@/lib/utils';

interface KanbanColumnProps {
  column: CRMPipelineColumn;
  leads: CRMLead[];
  onOpenDetail: (lead: CRMLead) => void;
  isDragOver?: boolean;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ 
  column, 
  leads, 
  onOpenDetail,
  isDragOver = false 
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <motion.div 
      ref={setNodeRef}
      className={cn(
        "w-80 h-full transition-all duration-300 ease-out",
        isDragOver && "scale-[1.02]"
      )}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <DesignCard
        variant="glass"
        size="sm"
        className={cn(
          "h-full flex flex-col border-white/30 backdrop-blur-xl transition-all duration-300",
          isOver 
            ? "bg-blue-50/80 dark:bg-blue-900/20 ring-2 ring-blue-400/50 shadow-2xl border-blue-300/50" 
            : "bg-white/60 dark:bg-black/10 hover:bg-white/70 dark:hover:bg-black/15 shadow-lg"
        )}
      >
        {/* Enhanced Column Header */}
        <motion.div 
          className="flex items-center justify-between mb-4 pb-3 border-b border-white/20"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-3">
            <motion.div 
              className="w-4 h-4 rounded-full shadow-lg" 
              style={{ 
                backgroundColor: column.color,
                boxShadow: isOver ? `0 0 20px ${column.color}60` : `0 2px 8px ${column.color}40`
              }}
              animate={{ 
                scale: isOver ? [1, 1.2, 1] : 1,
                boxShadow: isOver ? `0 0 20px ${column.color}60` : `0 2px 8px ${column.color}40`
              }}
              transition={{ duration: 0.3 }}
            />
            <h3 className="font-semibold text-slate-800 dark:text-slate-200">
              {column.name}
            </h3>
            <motion.span 
              className={cn(
                "text-sm px-2.5 py-1 rounded-full font-medium transition-all duration-200",
                isOver 
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 ring-1 ring-blue-300/50" 
                  : "bg-white/60 dark:bg-black/20 text-slate-600 dark:text-slate-300"
              )}
              animate={{ scale: isOver ? 1.05 : 1 }}
            >
              {leads.length}
            </motion.span>
          </div>
        </motion.div>
        
        {/* Enhanced Cards Container */}
        <SortableContext 
          items={leads.map(lead => lead.id)} 
          strategy={verticalListSortingStrategy}
        >
          <motion.div 
            className={cn(
              "flex-1 space-y-3 overflow-y-auto transition-all duration-300",
              isOver && "space-y-4"
            )}
            style={{ 
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(148, 163, 184, 0.3) transparent'
            }}
          >
            {leads.map((lead, index) => (
              <motion.div
                key={lead.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  delay: index * 0.05,
                  duration: 0.3,
                  ease: "easeOut"
                }}
                whileHover={{ scale: 1.02 }}
              >
                <OptimizedKanbanLeadCard
                  lead={lead}
                  onOpenDetail={onOpenDetail}
                />
              </motion.div>
            ))}
            
            {/* Enhanced Drop Zone for Empty Columns */}
            {isOver && leads.length === 0 && (
              <motion.div 
                className="border-2 border-dashed border-blue-400/60 rounded-xl p-8 text-center bg-blue-50/50 dark:bg-blue-900/20 backdrop-blur-sm"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.05, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <p className="text-blue-600 dark:text-blue-400 font-medium">
                    Solte o lead aqui
                  </p>
                  <p className="text-blue-500/70 dark:text-blue-300/70 text-sm mt-1">
                    Adicionar à {column.name}
                  </p>
                </motion.div>
              </motion.div>
            )}
            
            {/* Empty State for Non-Dragging */}
            {!isOver && leads.length === 0 && (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-slate-400 dark:text-slate-500">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-600"></div>
                  </div>
                  <p className="text-sm font-medium">Nenhum lead</p>
                  <p className="text-xs mt-1">Arraste leads para cá</p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </SortableContext>
      </DesignCard>
    </motion.div>
  );
};

export default KanbanColumn;
