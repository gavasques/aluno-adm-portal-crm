
import React from 'react';
import { CRMFilters } from '@/types/crm.types';
import OptimizedKanbanBoard from './OptimizedKanbanBoard';

interface CRMKanbanBoardProps {
  filters: CRMFilters;
  pipelineId: string;
}

const CRMKanbanBoard = ({ filters, pipelineId }: CRMKanbanBoardProps) => {
  return <OptimizedKanbanBoard filters={filters} pipelineId={pipelineId} />;
};

export default CRMKanbanBoard;
