
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { CRMPipeline, CRMPipelineColumn } from '@/types/crm.types';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Circle } from 'lucide-react';

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
      {/* Pipeline Header Compacto */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4"
      >
        <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {pipeline.name}
        </h3>
        {pipeline.description && (
          <p className="text-gray-600 mt-1 text-sm">{pipeline.description}</p>
        )}
        <Badge className="mt-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 text-xs">
          {sortedColumns.length} {sortedColumns.length === 1 ? 'Etapa' : 'Etapas'}
        </Badge>
      </motion.div>

      {sortedColumns.length > 0 ? (
        <div className="space-y-4">
          {/* Flow Visualization Compacto */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Fluxo do Pipeline
            </h4>
            
            <div className="flex flex-wrap items-center gap-2 p-3 bg-white/80 rounded-xl border border-gray-200">
              {sortedColumns.map((column, index) => (
                <React.Fragment key={column.id}>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 shadow-sm border-l-2 hover:shadow-md transition-shadow"
                    style={{ borderLeftColor: column.color }}
                  >
                    <div 
                      className="w-3 h-3 rounded-full shadow-sm" 
                      style={{ backgroundColor: column.color }}
                    />
                    <span className="font-medium text-gray-800 text-sm">{column.name}</span>
                    <Badge variant="outline" className="text-xs h-4 px-1">
                      {index + 1}
                    </Badge>
                  </motion.div>
                  {index < sortedColumns.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </motion.div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </motion.div>

          {/* Detailed Columns Compacto */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h4 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Circle className="h-4 w-4 text-blue-500" />
              Detalhes das Etapas
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {sortedColumns.map((column, index) => (
                <motion.div
                  key={column.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="relative overflow-hidden rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Color Bar */}
                  <div 
                    className="h-1 w-full" 
                    style={{ backgroundColor: column.color }}
                  />
                  
                  <div className="p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <h5 className="font-semibold text-gray-900 text-sm">{column.name}</h5>
                      <Badge 
                        variant="outline" 
                        className="text-xs font-medium h-4 px-1"
                        style={{ borderColor: column.color, color: column.color }}
                      >
                        #{index + 1}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <div 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: column.color }}
                      />
                      <span>Etapa {index + 1} do processo</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Ordem: {column.sort_order}</span>
                      <Badge variant={column.is_active ? 'default' : 'secondary'} className="text-xs h-4 px-1">
                        {column.is_active ? 'Ativa' : 'Inativa'}
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 bg-gray-50 rounded-xl"
        >
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
            <Circle className="h-8 w-8 text-gray-400" />
          </div>
          <h4 className="text-base font-semibold text-gray-700 mb-2">
            Nenhuma coluna ativa encontrada
          </h4>
          <p className="text-gray-500 text-sm">
            Adicione colunas para visualizar o fluxo do pipeline.
          </p>
        </motion.div>
      )}
    </div>
  );

  if (open !== undefined && onOpenChange) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Preview do Pipeline
            </DialogTitle>
          </DialogHeader>
          <PreviewContent />
        </DialogContent>
      </Dialog>
    );
  }

  return <PreviewContent />;
};

export default PipelinePreview;
