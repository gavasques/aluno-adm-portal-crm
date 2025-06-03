
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
  console.log('🎯 DashboardContent: Pipeline selecionado:', selectedPipelineId);
  console.log('🎯 DashboardContent: Filtros aplicados:', effectiveFilters);
  
  return (
    <div className="h-full w-full bg-gray-50">
      {activeView === 'kanban' ? (
        <div className="h-full w-full">
          <OptimizedKanbanBoard
            filters={effectiveFilters}
            pipelineId={selectedPipelineId}
            onCreateLead={onCreateLead}
          />
        </div>
      ) : (
        <div className="px-6 py-4 h-full w-full">
          <div className="bg-white rounded-lg border border-gray-200 h-full w-full">
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
