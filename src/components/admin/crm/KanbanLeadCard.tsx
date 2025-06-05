
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye } from 'lucide-react';
import { CRMLeadCardField, CRMLead } from '@/types/crm.types';
import { ConfigurableCardLayout } from './card-fields/ConfigurableCardLayout';

interface KanbanLeadCardProps {
  lead: CRMLead;
  onOpenDetail?: (lead: CRMLead) => void;
}

// Configuração padrão para campos visíveis
const DEFAULT_VISIBLE_FIELDS: CRMLeadCardField[] = [
  'name', 'status', 'responsible', 'phone', 'email', 'pipeline', 'column', 'tags'
];

const DEFAULT_FIELD_ORDER: CRMLeadCardField[] = [
  'name', 'status', 'responsible', 'phone', 'email', 'pipeline', 'column', 'tags'
];

const KanbanLeadCard = ({ lead, onOpenDetail }: KanbanLeadCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lead.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenDetail?.(lead);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenDetail?.(lead);
  };

  // Determine card height based on field count
  const fieldCount = DEFAULT_VISIBLE_FIELDS.length;
  const dynamicHeight = fieldCount <= 4 ? 'min-h-[120px]' : 
                       fieldCount <= 7 ? 'min-h-[160px]' : 'min-h-[200px]';

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab active:cursor-grabbing"
      onClick={handleCardClick}
    >
      <Card className={`hover:shadow-md transition-all duration-200 border border-gray-200 bg-white hover:bg-gray-50 ${dynamicHeight}`}>
        <CardContent className="p-3 h-full flex flex-col">
          {/* Header com ações */}
          <div className="flex justify-end items-start mb-2 flex-shrink-0">
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-5 w-5 p-0 text-gray-400 hover:text-blue-600" 
                onClick={handleViewDetails}
              >
                <Eye className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm" className="h-5 w-5 p-0 text-gray-400 hover:text-gray-600">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Conteúdo configurável */}
          <div className="flex-1 overflow-hidden">
            <ConfigurableCardLayout
              lead={lead}
              visibleFields={DEFAULT_VISIBLE_FIELDS}
              fieldOrder={DEFAULT_FIELD_ORDER}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KanbanLeadCard;
