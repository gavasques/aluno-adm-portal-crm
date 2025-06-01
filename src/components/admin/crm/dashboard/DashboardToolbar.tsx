
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Columns3, List, Plus } from 'lucide-react';
import { CRMPipeline } from '@/types/crm.types';

interface DashboardToolbarProps {
  activeView: 'kanban' | 'list';
  onViewChange: (view: 'kanban' | 'list') => void;
  pipelines: CRMPipeline[];
  selectedPipelineId: string;
  onCreateLead: () => void;
}

export const DashboardToolbar: React.FC<DashboardToolbarProps> = ({
  activeView,
  onViewChange,
  pipelines,
  selectedPipelineId,
  onCreateLead
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="text-xs">
          Pipeline: {pipelines.find(p => p.id === selectedPipelineId)?.name || 'Selecione'}
        </Badge>
      </div>
      
      <div className="flex items-center gap-2">
        {/* New Lead Button */}
        <Button 
          onClick={onCreateLead}
          disabled={!selectedPipelineId}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Lead
        </Button>

        <div className="flex rounded-lg border border-gray-200 p-1">
          <Button
            variant={activeView === 'kanban' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewChange('kanban')}
            className="h-8 px-3"
          >
            <Columns3 className="h-4 w-4 mr-1" />
            Kanban
          </Button>
          <Button
            variant={activeView === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewChange('list')}
            className="h-8 px-3"
          >
            <List className="h-4 w-4 mr-1" />
            Lista
          </Button>
        </div>
      </div>
    </div>
  );
};
