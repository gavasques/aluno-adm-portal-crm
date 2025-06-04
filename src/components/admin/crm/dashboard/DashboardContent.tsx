
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import FastKanbanBoard from '../FastKanbanBoard';
import CRMListView from '../CRMListView';
import { CRMFilters } from '@/types/crm.types';
import { AlertCircle } from 'lucide-react';

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
  if (!selectedPipelineId) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <AlertCircle className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-blue-800">
                  Selecione um Pipeline
                </h3>
              </div>
              <p className="text-blue-700">
                Para começar a usar o CRM, selecione um pipeline no filtro acima.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-full w-full bg-gray-50">
      {activeView === 'kanban' ? (
        <div className="h-full w-full">
          <React.Suspense fallback={
            <div className="h-full w-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          }>
            <FastKanbanBoard
              filters={effectiveFilters}
              pipelineId={selectedPipelineId}
              onCreateLead={onCreateLead}
            />
          </React.Suspense>
        </div>
      ) : (
        <div className="h-full w-full p-6">
          <div className="bg-white rounded-lg border border-gray-200 h-full w-full">
            <React.Suspense fallback={
              <div className="h-full w-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            }>
              <CRMListView
                filters={effectiveFilters}
                onCreateLead={() => onCreateLead()}
              />
            </React.Suspense>
          </div>
        </div>
      )}
    </div>
  );
};
