
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
    <Card className="flex-1 min-h-0">
      <CardContent className="p-0 h-full">
        {activeView === 'kanban' ? (
          <OptimizedKanbanBoard
            filters={effectiveFilters}
            pipelineId={selectedPipelineId}
            onCreateLead={onCreateLead}
          />
        ) : (
          <div className="p-4 h-full overflow-auto">
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
