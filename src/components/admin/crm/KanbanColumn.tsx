
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
        "w-80 bg-gray-50 rounded-lg p-4 transition-all duration-300 ease-in-out",
        isOver && "bg-blue-50 ring-2 ring-blue-300 ring-opacity-50 shadow-lg",
        isDragOver && "scale-[1.02]"
      )}
    >
      <ColumnHeader
        column={column}
        leadsCount={leads.length}
        isOver={isOver}
        onCreateLead={onCreateLead ? handleCreateLead : undefined}
      />
      
      <ColumnBody
        leads={leads}
        isOver={isOver}
        onOpenDetail={onOpenDetail}
      />
    </div>
  );
};

export default KanbanColumn;
