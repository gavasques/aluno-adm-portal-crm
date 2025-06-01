
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CRMPipelineColumn } from '@/types/crm.types';

interface ColumnHeaderProps {
  column: CRMPipelineColumn;
  leadsCount: number;
  isOver?: boolean;
  onCreateLead?: () => void;
}

export const ColumnHeader: React.FC<ColumnHeaderProps> = ({
  column,
  leadsCount,
  isOver = false,
  onCreateLead
}) => {
  return (
    <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
      <div className="flex items-center gap-2">
        <div 
          className="w-3 h-3 rounded-full" 
          style={{ backgroundColor: column.color }}
        />
        <h3 className="font-medium text-gray-900 text-sm">
          {column.name}
        </h3>
        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-medium">
          {leadsCount}
        </span>
      </div>
      
      {onCreateLead && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onCreateLead}
          className="h-6 w-6 p-0 hover:bg-gray-100 opacity-60 hover:opacity-100"
        >
          <Plus className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
};
