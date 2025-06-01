
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
    <Card className="h-full border-gray-200 shadow-sm">
      <CardContent className="p-0 h-full">
        {activeView === 'kanban' ? (
          <div className="h-full overflow-hidden">
            <OptimizedKanbanBoard
              filters={effectiveFilters}
              pipelineId={selectedPipelineId}
              onCreateLead={onCreateLead}
            />
          </div>
        ) : (
          <div className="p-6 h-full overflow-auto">
            <CRMListView
              filters={effectiveFilters}
              onCreateLead={() => onCreateLead()}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
