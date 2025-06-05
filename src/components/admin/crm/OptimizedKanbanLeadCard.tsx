
import React, { memo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreVertical, Eye } from 'lucide-react';
import { CRMLead } from '@/types/crm.types';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useCRMCardPreferences } from '@/hooks/crm/useCRMCardPreferences';
import { ConfigurableCardLayout } from './card-fields/ConfigurableCardLayout';

interface OptimizedKanbanLeadCardProps {
  lead: CRMLead;
  onClick: () => void;
  isDragging?: boolean;
}

const OptimizedKanbanLeadCard: React.FC<OptimizedKanbanLeadCardProps> = memo(({ 
  lead, 
  onClick, 
  isDragging = false 
}) => {
  const { preferences, isLoading } = useCRMCardPreferences();

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent card click when clicking on dropdown
    if ((e.target as HTMLElement).closest('[data-dropdown-trigger]')) {
      return;
    }
    onClick();
  };

  // Loading state
  if (isLoading) {
    return (
      <Card className="p-4 animate-pulse">
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
      </Card>
    );
  }

  // Determine card height based on field count
  const fieldCount = preferences.visible_fields.length;
  const cardHeight = fieldCount <= 4 ? 'min-h-[120px]' : 
                    fieldCount <= 7 ? 'min-h-[160px]' : 'min-h-[200px]';
  
  console.log('🃏 [KANBAN_LEAD_CARD] Renderizando card configurável:', {
    leadId: lead.id,
    leadName: lead.name,
    visibleFields: preferences.visible_fields,
    fieldCount,
    isDragging
  });
  
  return (
    <Card 
      className={cn(
        "p-3 cursor-pointer transition-all duration-200 border border-gray-200 bg-white hover:shadow-md",
        cardHeight,
        isDragging && "opacity-70 rotate-2 shadow-lg scale-105"
      )}
      onClick={handleCardClick}
    >
      <div className="flex flex-col h-full">
        {/* Header com ações - posicionado no canto superior direito */}
        <div className="flex justify-end mb-2 flex-shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild data-dropdown-trigger="true">
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onClick}>
                <Eye className="h-4 w-4 mr-2" />
                Abrir Lead
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Conteúdo configurável */}
        <div className="flex-1 overflow-hidden">
          <ConfigurableCardLayout
            lead={lead}
            visibleFields={preferences.visible_fields}
            fieldOrder={preferences.field_order}
          />
        </div>
      </div>
    </Card>
  );
});

OptimizedKanbanLeadCard.displayName = 'OptimizedKanbanLeadCard';

export default OptimizedKanbanLeadCard;
