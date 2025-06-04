
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, Clock, MoreVertical } from 'lucide-react';
import { CRMLead } from '@/types/crm.types';
import { cn } from '@/lib/utils';
import StatusBadge from './status/StatusBadge';
import StatusChangeDialog from './status/StatusChangeDialog';
import { useLeadStatusChange } from '@/hooks/crm/useLeadStatusChange';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

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
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const { changeStatus } = useLeadStatusChange();
  
  // Mock value - replace with real lead value
  const leadValue = "R$ 15.000";

  const handleStatusChange = async (status: any, reason?: string) => {
    await changeStatus({ leadId: lead.id, status, reason });
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent card click when clicking on dropdown
    if ((e.target as HTMLElement).closest('[data-dropdown-trigger]')) {
      return;
    }
    onClick();
  };

  const handleStatusClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setStatusDialogOpen(true);
  };
  
  return (
    <>
      <Card 
        className={cn(
          "p-4 cursor-pointer transition-all duration-200 border border-gray-200 bg-white hover:shadow-md",
          isDragging && "opacity-50 rotate-2 shadow-lg"
        )}
        onClick={handleCardClick}
      >
        {/* Header with company name and actions */}
        <div className="flex items-start justify-between mb-3">
          <h4 className="font-medium text-gray-900 text-sm leading-tight flex-1 mr-2">
            {lead.name}
          </h4>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-900">
              {leadValue}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild data-dropdown-trigger="true">
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleStatusClick}>
                  Alterar Status
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Status Badge */}
        <div className="mb-3">
          <StatusBadge 
            status={lead.status} 
            className="cursor-pointer" 
            onClick={handleStatusClick}
          />
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

      <StatusChangeDialog
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        leadName={lead.name}
        currentStatus={lead.status}
        onStatusChange={handleStatusChange}
      />
    </>
  );
};

export default OptimizedKanbanLeadCard;
