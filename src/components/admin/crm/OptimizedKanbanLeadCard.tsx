
import React, { memo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreVertical, Eye } from 'lucide-react';
import { CRMLeadCardField, CRMLead } from '@/types/crm.types';
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

  // Safe parsing of preferences
  const parseFieldArray = (data: any): CRMLeadCardField[] => {
    if (Array.isArray(data)) {
      return data as CRMLeadCardField[];
    }
    return [];
  };

  const visibleFields = parseFieldArray(preferences.visible_fields);
  const fieldOrder = parseFieldArray(preferences.field_order);
  
  console.log('🃏 [KANBAN_LEAD_CARD] Renderizando card otimizado:', {
    leadId: lead.id,
    leadName: lead.name,
    visibleFields: visibleFields,
    isDragging
  });
  
  return (
    <Card 
      className={cn(
        "p-3 cursor-pointer transition-all duration-200 border border-gray-200 bg-white hover:shadow-md relative",
        isDragging && "opacity-70 rotate-2 shadow-lg scale-105"
      )}
      onClick={handleCardClick}
    >
      {/* Menu de ações posicionado absolutamente no canto superior direito */}
      <div className="absolute top-2 right-2 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild data-dropdown-trigger="true">
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-60 hover:opacity-100">
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

      {/* Conteúdo principal com padding à direita para não sobrepor o menu */}
      <div className="pr-8">
        <ConfigurableCardLayout
          lead={lead}
          visibleFields={visibleFields}
          fieldOrder={fieldOrder}
        />
      </div>
    </Card>
  );
});

OptimizedKanbanLeadCard.displayName = 'OptimizedKanbanLeadCard';

export default OptimizedKanbanLeadCard;
