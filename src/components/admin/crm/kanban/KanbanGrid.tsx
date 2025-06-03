
import React from 'react';
import { CRMPipelineColumn } from '@/types/crm.types';
import { LeadWithContacts } from '@/types/crm.types';
import KanbanColumn from '../KanbanColumn';
import VirtualizedLeadsList from '../VirtualizedLeadsList';
import { cn } from '@/lib/utils';

interface KanbanGridProps {
  pipelineColumns: CRMPipelineColumn[];
  leadsByColumn: Record<string, LeadWithContacts[]>;
  activeColumnId: string | null;
  isDragging: boolean;
  isMoving: boolean;
  onOpenDetail: (lead: any) => void;
  onCreateLead?: (columnId?: string) => void;
  useVirtualization?: boolean;
}

export const KanbanGrid: React.FC<KanbanGridProps> = React.memo(({
  pipelineColumns,
  leadsByColumn,
  activeColumnId,
  isDragging,
  isMoving,
  onOpenDetail,
  onCreateLead,
  useVirtualization = false
}) => {
  console.log('🏗️ [KANBAN_GRID] Renderizando grid:', {
    columnsCount: pipelineColumns.length,
    useVirtualization,
    totalLeads: Object.values(leadsByColumn).flat().length,
    isDragging,
    isMoving
  });

  return (
    <div className="h-full w-full overflow-x-auto overflow-y-hidden">
      <div className={cn(
        "flex gap-4 min-w-max h-full transition-all duration-300",
        (isDragging || isMoving) && "pointer-events-none select-none"
      )}>
        {pipelineColumns.map(column => {
          const columnLeads = leadsByColumn[column.id] || [];
          const isDragOver = activeColumnId === column.id;
          
          console.log(`📋 [KANBAN_GRID] Column ${column.name}:`, {
            leadsCount: columnLeads.length,
            isDragOver,
            useVirtualization: useVirtualization && columnLeads.length > 20
          });
          
          return (
            <div key={column.id} className="w-80 h-full flex flex-col">
              {useVirtualization && columnLeads.length > 20 ? (
                <div className="w-80 h-full bg-white rounded-lg border border-gray-200 p-4 flex flex-col">
                  {/* Header da coluna */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: column.color }}
                      />
                      <h3 className="font-medium text-gray-900">{column.name}</h3>
                      <span className="text-sm text-gray-500">({columnLeads.length})</span>
                    </div>
                    {onCreateLead && (
                      <button
                        onClick={() => onCreateLead(column.id)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        + Novo
                      </button>
                    )}
                  </div>
                  
                  {/* Lista virtualizada */}
                  <div className="flex-1 min-h-0">
                    <VirtualizedLeadsList
                      leads={columnLeads}
                      column={column}
                      height={600} // Altura fixa para virtualização
                      onOpenDetail={onOpenDetail}
                      isOver={isDragOver}
                    />
                  </div>
                </div>
              ) : (
                <KanbanColumn
                  column={column}
                  leads={columnLeads}
                  onOpenDetail={onOpenDetail}
                  onCreateLead={onCreateLead}
                  isDragOver={isDragOver}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
});

KanbanGrid.displayName = 'KanbanGrid';
