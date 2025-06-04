
import React from 'react';
import { CRMPipelineColumn } from '@/types/crm.types';
import { LeadWithContacts } from '@/types/crm.types';
import KanbanColumn from '../KanbanColumn';
import { cn } from '@/lib/utils';

interface KanbanGridProps {
  pipelineColumns: CRMPipelineColumn[];
  leadsByColumn: Record<string, LeadWithContacts[]>;
  activeColumnId: string | null;
  isDragging: boolean;
  isMoving: boolean;
  onOpenDetail: (lead: any) => void;
  onCreateLead?: (columnId?: string) => void;
}

export const KanbanGrid: React.FC<KanbanGridProps> = ({
  pipelineColumns,
  leadsByColumn,
  activeColumnId,
  isDragging,
  isMoving,
  onOpenDetail,
  onCreateLead
}) => {
  return (
    <div className="h-full w-full overflow-x-auto overflow-y-hidden">
      <div className={cn(
        "flex gap-4 min-w-max h-full transition-all duration-300",
        (isDragging || isMoving) && "pointer-events-none select-none"
      )}>
        {pipelineColumns.map(column => {
          const columnLeads = leadsByColumn[column.id] || [];
          const isDragOver = activeColumnId === column.id;
          
          console.log(`📋 Column ${column.name} has ${columnLeads.length} leads:`, columnLeads);
          
          return (
            <KanbanColumn
              key={column.id}
              column={column}
              leads={columnLeads}
              onOpenDetail={onOpenDetail}
              onCreateLead={onCreateLead}
              isDragOver={isDragOver}
            />
          );
        })}
      </div>
    </div>
  );
};
