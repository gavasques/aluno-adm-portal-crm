
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import OptimizedKanbanBoard from '../OptimizedKanbanBoard';
import CRMListView from '../CRMListView';
import { CRMFilters } from '@/types/crm.types';

interface DashboardContentProps {
  activeView: 'kanban' | 'list';
  effectiveFilters: CRMFilters;
  selectedPipelineId: string;
  onCreateLead: (columnId?: string) => void;
}

export const DashboardContent: React.FC<DashboardContentProps> = ({
  activeView,
  effectiveFilters,
  selectedPipelineId,
  onCreateLead
}) => {
  return (
    <div className="h-full bg-gray-50">
      {activeView === 'kanban' ? (
        <div className="h-full overflow-hidden p-6">
          <OptimizedKanbanBoard
            filters={effectiveFilters}
            pipelineId={selectedPipelineId}
            onCreateLead={onCreateLead}
          />
        </div>
      ) : (
        <div className="p-6 h-full overflow-auto">
          <div className="bg-white rounded-lg border border-gray-200 h-full">
            <CRMListView
              filters={effectiveFilters}
              onCreateLead={() => onCreateLead()}
            />
          </div>
        </div>
      )}
    </div>
  );
};
