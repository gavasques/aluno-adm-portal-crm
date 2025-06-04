
import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Clock } from 'lucide-react';
import { LeadWithContacts } from '@/types/crm.types';
import { cn } from '@/lib/utils';

interface FastLeadCardProps {
  lead: LeadWithContacts;
  onClick: () => void;
  disabled?: boolean;
}

export const FastLeadCard: React.FC<FastLeadCardProps> = React.memo(({ 
  lead, 
  onClick, 
  disabled = false 
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: lead.id,
    disabled,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!disabled && !isDragging) {
      onClick();
    }
  };

  return (
    <Card 
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "p-3 cursor-pointer border border-gray-200 bg-white hover:shadow-sm transition-shadow",
        isDragging && "opacity-50",
        disabled && "cursor-not-allowed opacity-60"
      )}
      onClick={handleClick}
    >
      {/* Nome do lead */}
      <h4 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2">
        {lead.name}
      </h4>

      {/* Email */}
      <p className="text-xs text-gray-600 mb-2 truncate">
        {lead.email}
      </p>

      {/* Status */}
      <div className="mb-3">
        <span className={cn(
          "inline-block px-2 py-1 text-xs font-medium rounded-full",
          lead.status === 'aberto' && "bg-green-100 text-green-800",
          lead.status === 'ganho' && "bg-blue-100 text-blue-800",
          lead.status === 'perdido' && "bg-red-100 text-red-800"
        )}>
          {lead.status}
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Avatar className="h-4 w-4">
            <AvatarFallback className="text-xs bg-gray-100">
              {lead.responsible?.name?.charAt(0) || lead.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="truncate max-w-16">
            {lead.responsible?.name || 'Sem responsável'}
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>Hoje</span>
        </div>
      </div>
    </Card>
  );
});

FastLeadCard.displayName = 'FastLeadCard';
