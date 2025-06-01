
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
  console.log('✨ ModernCRMLeadFormDialog: Novo design sendo renderizado!', { open, mode, pipelineId });
  
  const { lead, loading } = useCRMLeadDetail(leadId || '');

  const handleSuccess = () => {
    onSuccess?.();
    onOpenChange(false);
  };

  if (!open) {
    console.log('❌ Modal não está aberto');
    return null;
  }

  console.log('🎨 Renderizando modal moderno com glassmorphism!');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-[95vw] h-[95vh] max-h-[95vh] p-0 overflow-hidden border-0 bg-transparent shadow-none">
        <AnimatePresence mode="wait">
          {loading && mode === 'edit' ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center h-full bg-white/10 dark:bg-black/10 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-white/10"
            >
              <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="font-medium">Carregando dados do lead...</span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="h-full bg-white/10 dark:bg-black/10 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-white/10 shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)'
              }}
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
