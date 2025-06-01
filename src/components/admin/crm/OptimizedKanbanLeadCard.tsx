
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, Clock } from 'lucide-react';
import { CRMLead } from '@/types/crm.types';
import { cn } from '@/lib/utils';

interface OptimizedKanbanLeadCardProps {
  lead: CRMLead;
  onClick: () => void;
  isDragging?: boolean;
}

const OptimizedKanbanLeadCard: React.FC<OptimizedKanbanLeadCardProps> = ({ 
  lead, 
  onClick, 
  isDragging = false 
}) => {
  // Mock value - replace with real lead value
  const leadValue = "R$ 15.000";
  
  return (
    <Card 
      className={cn(
        "p-4 cursor-pointer transition-all duration-200 border border-gray-200 bg-white hover:shadow-md",
        isDragging && "opacity-50 rotate-2 shadow-lg"
      )}
      onClick={onClick}
    >
      {/* Header with company name and value */}
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-medium text-gray-900 text-sm leading-tight">
          {lead.name}
        </h4>
        <span className="text-sm font-semibold text-gray-900 ml-2">
          {leadValue}
        </span>
      </div>

      {/* Description */}
      <p className="text-xs text-gray-600 mb-3 line-clamp-2">
        {lead.notes || 'Implementação de software de gestão'}
      </p>

      {/* Footer with avatar and next contact */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs bg-gray-100 text-gray-600">
              {lead.responsible?.name?.charAt(0) || lead.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-gray-600">
            {lead.responsible?.name || 'Sem responsável'}
          </span>
        </div>
        
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Clock className="h-3 w-3" />
          <span>Hoje</span>
        </div>
      </div>
    </Card>
  );
};

export default OptimizedKanbanLeadCard;
