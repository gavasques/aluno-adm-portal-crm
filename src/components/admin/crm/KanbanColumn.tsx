
import React from 'react';
import { CRMLead, CRMPipelineColumn } from '@/types/crm.types';
import { useColumnOperations } from '@/hooks/crm/useColumnOperations';
import { useDroppable } from '@dnd-kit/core';
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
  const { handleCreateLead } = useColumnOperations({
    column,
    onCreateLead
  });

  // Configurar zona de drop para toda a coluna
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  console.log(`📋 [KANBAN_COLUMN] ${column.name}:`, {
    leadsCount: leads.length,
    isOver: isOver || isDragOver,
    columnId: column.id
  });

  return (
    <div 
      ref={setNodeRef}
      className={cn(
        "w-80 h-full bg-white rounded-lg border border-gray-200 p-4 flex flex-col transition-all duration-300 ease-in-out",
        (isOver || isDragOver) && "bg-blue-50 ring-2 ring-blue-300 scale-[1.02]"
      )}
    >
      <ColumnHeader
        column={column}
        leadsCount={leads.length}
        isOver={isOver || isDragOver}
        onCreateLead={onCreateLead ? handleCreateLead : undefined}
      />
      
      <div className="flex-1 min-h-0 mt-4">
        <ColumnBody
          leads={leads}
          isOver={isOver || isDragOver}
          onOpenDetail={onOpenDetail}
          columnId={column.id}
        />
      </div>
    </div>
  );
};

export default KanbanColumn;
