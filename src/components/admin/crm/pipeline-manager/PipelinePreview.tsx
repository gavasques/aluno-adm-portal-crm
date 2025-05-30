
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { CRMPipeline, CRMPipelineColumn } from '@/types/crm.types';

interface PipelinePreviewProps {
  pipeline: CRMPipeline;
  columns: CRMPipelineColumn[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const PipelinePreview = ({ pipeline, columns, open, onOpenChange }: PipelinePreviewProps) => {
  const sortedColumns = columns
    .filter(col => col.is_active)
    .sort((a, b) => a.sort_order - b.sort_order);

  const PreviewContent = () => (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold">{pipeline.name}</h3>
        {pipeline.description && (
          <p className="text-sm text-gray-500 mt-1">{pipeline.description}</p>
        )}
      </div>

      {sortedColumns.length > 0 ? (
        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-700 mb-2">
            Fluxo do Pipeline ({sortedColumns.length} etapas):
          </div>
          
          <div className="flex flex-wrap gap-2">
            {sortedColumns.map((column, index) => (
              <div key={column.id} className="flex items-center">
                <div className="flex items-center gap-2 bg-white border rounded-lg px-3 py-2 shadow-sm">
                  <div 
                    className="w-3 h-3 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: column.color }}
                  />
                  <span className="text-sm font-medium">{column.name}</span>
                </div>
                {index < sortedColumns.length - 1 && (
                  <div className="mx-2 text-gray-400">→</div>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {sortedColumns.map((column) => (
              <div key={column.id} className="border rounded-lg p-3 bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: column.color }}
                  />
                  <span className="font-medium text-sm">{column.name}</span>
                  <Badge variant="outline" className="ml-auto text-xs">
                    {column.sort_order + 1}º
                  </Badge>
                </div>
                <div className="text-xs text-gray-500">
                  Etapa {column.sort_order + 1} do pipeline
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>Nenhuma coluna ativa encontrada.</p>
          <p className="text-sm mt-1">Adicione colunas para visualizar o fluxo.</p>
        </div>
      )}
    </div>
  );

  if (open !== undefined && onOpenChange) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Preview do Pipeline</DialogTitle>
          </DialogHeader>
          <PreviewContent />
        </DialogContent>
      </Dialog>
    );
  }

  return <PreviewContent />;
};

export default PipelinePreview;
