
import { useCallback } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { CRMPipelineColumn } from '@/types/crm.types';

interface UseColumnOperationsProps {
  column: CRMPipelineColumn;
  onCreateLead?: (columnId: string) => void;
}

export const useColumnOperations = ({ column, onCreateLead }: UseColumnOperationsProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  const handleCreateLead = useCallback(() => {
    if (onCreateLead) {
      onCreateLead(column.id);
    }
  }, [onCreateLead, column.id]);

  return {
    setNodeRef,
    isOver,
    handleCreateLead
  };
};
