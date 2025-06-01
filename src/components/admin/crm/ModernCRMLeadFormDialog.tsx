
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useCRMLeadDetail } from '@/hooks/crm/useCRMLeadDetail';
import ModernCRMLeadForm from './ModernCRMLeadForm';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ModernCRMLeadFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leadId?: string;
  pipelineId?: string;
  initialColumnId?: string;
  mode: 'create' | 'edit';
  onSuccess?: () => void;
}

const ModernCRMLeadFormDialog = ({ 
  open, 
  onOpenChange, 
  leadId, 
  pipelineId,
  initialColumnId,
  mode, 
  onSuccess 
}: ModernCRMLeadFormDialogProps) => {
  console.log('✨ ModernCRMLeadFormDialog: Renderizando modal compacto!', { open, mode, pipelineId });
  
  const { lead, loading } = useCRMLeadDetail(leadId || '');

  const handleSuccess = () => {
    onSuccess?.();
    onOpenChange(false);
  };

  if (!open) {
    console.log('❌ Modal não está aberto');
    return null;
  }

  console.log('🎨 Renderizando modal minimalista compacto!');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-4xl w-[90vw] h-[90vh] max-h-[90vh] p-0 overflow-hidden bg-white border border-gray-200 shadow-lg"
        hideCloseButton={true}
      >
        <AnimatePresence mode="wait">
          {loading && mode === 'edit' ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center h-full bg-white"
            >
              <div className="flex items-center gap-3 text-slate-700">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="font-medium">Carregando dados do lead...</span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="h-full bg-white"
            >
              <ModernCRMLeadForm
                pipelineId={pipelineId || lead?.pipeline_id || ''}
                initialColumnId={initialColumnId || lead?.column_id}
                lead={mode === 'edit' ? lead : undefined}
                onSuccess={handleSuccess}
                onCancel={() => onOpenChange(false)}
                mode={mode}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default ModernCRMLeadFormDialog;
