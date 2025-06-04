
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import OptimizedKanbanBoard from '../OptimizedKanbanBoard';
import CRMListView from '../CRMListView';
import { CRMFilters } from '@/types/crm.types';
import { motion } from 'framer-motion';
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
  console.log('🎯 DashboardContent: Pipeline selecionado:', selectedPipelineId);
  console.log('🎯 DashboardContent: Filtros aplicados:', effectiveFilters);
  
  // Verificar se temos um pipeline selecionado
  if (!selectedPipelineId) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
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
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="h-full w-full bg-gray-50">
      {activeView === 'kanban' ? (
        <motion.div 
          key="kanban"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
          className="h-full w-full"
        >
          <React.Suspense fallback={
            <div className="h-full w-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          }>
            <OptimizedKanbanBoard
              filters={effectiveFilters}
              pipelineId={selectedPipelineId}
              onCreateLead={onCreateLead}
            />
          </React.Suspense>
        </motion.div>
      ) : (
        <motion.div 
          key="list"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="h-full w-full p-6"
        >
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
        </motion.div>
      )}
    </div>
  );
};
