
import React from 'react';
import { CRMLead, CRMPipelineColumn } from '@/types/crm.types';
import { useColumnOperations } from '@/hooks/crm/useColumnOperations';
import { ColumnHeader } from './kanban/column/ColumnHeader';
import { ColumnBody } from './kanban/column/ColumnBody';
import { cn } from '@/lib/utils';

interface KanbanColumnProps {
  column: CRMPipelineColumn;
  leads: CRMLead[];
  onOpenDetail: (lead: CRMLead) => void;
  onCreateLead?: (columnId: string) => void;
  isDragOver?: boolean;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ 
  column, 
  leads, 
  onOpenDetail,
  onCreateLead,
  isDragOver = false 
}) => {
  const { setNodeRef, isOver, handleCreateLead } = useColumnOperations({
    column,
    onCreateLead
  });

  return (
    <div 
      ref={setNodeRef}
      className={cn(
        "w-80 h-full bg-white rounded-lg border border-gray-200 p-4 flex flex-col transition-all duration-300 ease-in-out",
        isOver && "bg-blue-50 ring-1 ring-blue-300",
        isDragOver && "scale-[1.02]"
      )}
    >
      <ColumnHeader
        column={column}
        leadsCount={leads.length}
        isOver={isOver}
        onCreateLead={onCreateLead ? handleCreateLead : undefined}
      />
      
      <div className="flex-1 min-h-0">
        <ColumnBody
          leads={leads}
          isOver={isOver}
          onOpenDetail={onOpenDetail}
        />
      </div>
    </div>
  );
};

export default KanbanColumn;
