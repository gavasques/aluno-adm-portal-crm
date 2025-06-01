
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CRMPipelineColumn } from '@/types/crm.types';
import { cn } from '@/lib/utils';

interface ColumnHeaderProps {
  column: CRMPipelineColumn;
  leadsCount: number;
  isOver: boolean;
  onCreateLead?: () => void;
}

export const ColumnHeader: React.FC<ColumnHeaderProps> = ({
  column,
  leadsCount,
  isOver,
  onCreateLead
}) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <div 
          className="w-3 h-3 rounded-full transition-all duration-200" 
          style={{ 
            backgroundColor: column.color,
            boxShadow: isOver ? `0 0 10px ${column.color}40` : 'none'
          }}
        />
        <h3 className="font-medium text-gray-900">{column.name}</h3>
        <span className={cn(
          "text-sm transition-colors duration-200",
          isOver ? "text-blue-600 font-medium" : "text-gray-500"
        )}>
          ({leadsCount})
        </span>
      </div>
      
      {onCreateLead && (
        <Button
          size="sm"
          variant="ghost"
          onClick={onCreateLead}
          className="h-8 w-8 p-0 hover:bg-white hover:shadow-sm"
          title={`Adicionar lead em ${column.name}`}
        >
          <Plus className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
