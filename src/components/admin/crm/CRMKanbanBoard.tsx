
import React from 'react';
import { CRMFilters } from '@/types/crm.types';

interface CRMKanbanBoardProps {
  filters: CRMFilters;
  pipelineId: string;
}

const CRMKanbanBoard = ({ filters, pipelineId }: CRMKanbanBoardProps) => {
  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Kanban Board</h3>
      <p className="text-muted-foreground">
        Pipeline: {pipelineId}
      </p>
      <p className="text-sm text-muted-foreground mt-2">
        Kanban board em desenvolvimento...
      </p>
    </div>
  );
};

export default CRMKanbanBoard;
