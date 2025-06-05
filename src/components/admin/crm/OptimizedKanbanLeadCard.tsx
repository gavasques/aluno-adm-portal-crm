
import React, { memo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreVertical, Eye } from 'lucide-react';
import { CRMLeadCardField, CRMLead } from '@/types/crm.types';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ConfigurableCardLayout } from './card-fields/ConfigurableCardLayout';

interface OptimizedKanbanLeadCardProps {
  lead: CRMLead;
  onClick: () => void;
  isDragging?: boolean;
}

// Configuração padrão para campos visíveis
const DEFAULT_VISIBLE_FIELDS: CRMLeadCardField[] = [
  'name', 'status', 'responsible', 'phone', 'email', 'pipeline', 'column', 'tags'
];

const DEFAULT_FIELD_ORDER: CRMLeadCardField[] = [
  'name', 'status', 'responsible', 'phone', 'email', 'pipeline', 'column', 'tags'
];

const OptimizedKanbanLeadCard: React.FC<OptimizedKanbanLeadCardProps> = memo(({ 
  lead, 
  onClick, 
  isDragging = false 
}) => {
  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent card click when clicking on dropdown
    if ((e.target as HTMLElement).closest('[data-dropdown-trigger]')) {
      return;
    }
    console.log('🃏 [KANBAN_LEAD_CARD] Card clicado:', lead.id);
    onClick();
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('🃏 [KANBAN_LEAD_CARD] Menu clicado:', lead.id);
    onClick();
  };

  console.log('🃏 [KANBAN_LEAD_CARD] Renderizando card otimizado:', {
    leadId: lead.id,
    leadName: lead.name,
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
            <DropdownMenuItem onClick={handleMenuClick}>
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
          visibleFields={DEFAULT_VISIBLE_FIELDS}
          fieldOrder={DEFAULT_FIELD_ORDER}
        />
      </div>
    </Card>
  );
});

OptimizedKanbanLeadCard.displayName = 'OptimizedKanbanLeadCard';

export default OptimizedKanbanLeadCard;
