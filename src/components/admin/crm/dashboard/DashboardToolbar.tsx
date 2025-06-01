
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Columns3, List, Plus, LayoutGrid } from 'lucide-react';
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
  const selectedPipeline = pipelines.find(p => p.id === selectedPipelineId);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
            <LayoutGrid className="h-3 w-3 text-white" />
          </div>
          <span className="text-sm font-medium text-blue-700">
            {selectedPipeline?.name || 'Pipeline de Vendas'}
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {/* New Lead Button */}
        <Button 
          onClick={onCreateLead}
          disabled={!selectedPipelineId}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 h-9 text-sm font-medium"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Lead
        </Button>

        {/* View Toggle */}
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewChange('kanban')}
            className={`h-8 px-3 rounded-none border-r border-gray-300 ${
              activeView === 'kanban' 
                ? 'bg-gray-900 text-white hover:bg-gray-800' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Columns3 className="h-4 w-4 mr-1" />
            Kanban
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewChange('list')}
            className={`h-8 px-3 rounded-none ${
              activeView === 'list' 
                ? 'bg-gray-900 text-white hover:bg-gray-800' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <List className="h-4 w-4 mr-1" />
            Lista
          </Button>
        </div>
      </div>
    </div>
  );
};
