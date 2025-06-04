
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CRMLead } from '@/types/crm.types';
import OptimizedKanbanLeadCard from '../OptimizedKanbanLeadCard';

interface DynamicLeadCardProps {
  lead: CRMLead;
  onClick: () => void;
  isDragging?: boolean;
}

export const DynamicLeadCard: React.FC<DynamicLeadCardProps> = ({ 
  lead, 
  onClick, 
  isDragging = false 
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: lead.id,
    data: lead, // Passa os dados do lead diretamente
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  console.log('🃏 [DYNAMIC_LEAD_CARD] Renderizando card:', {
    leadId: lead.id,
    leadName: lead.name,
    columnId: lead.column_id,
    isDragging: isDragging || isSortableDragging,
    hasTransform: !!transform
  });

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab active:cursor-grabbing"
    >
      <OptimizedKanbanLeadCard
        lead={lead}
        onClick={onClick}
        isDragging={isDragging || isSortableDragging}
      />
    </div>
  );
};
