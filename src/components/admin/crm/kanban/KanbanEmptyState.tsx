
import React from 'react';

interface KanbanEmptyStateProps {
  pipelineId: string;
  hasColumns: boolean;
}

export const KanbanEmptyState: React.FC<KanbanEmptyStateProps> = ({ pipelineId, hasColumns }) => {
  if (!pipelineId) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Selecione um pipeline para visualizar os leads.</p>
      </div>
    );
  }

  if (!hasColumns) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Nenhuma coluna encontrada para este pipeline.</p>
        <p className="text-sm text-gray-400 mt-2">Configure as colunas nas configurações do pipeline.</p>
      </div>
    );
  }

  return null;
};
