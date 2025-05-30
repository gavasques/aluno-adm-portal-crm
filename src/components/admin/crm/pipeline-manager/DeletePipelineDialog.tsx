
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { CRMPipeline } from '@/types/crm.types';
import { useCRMPipelines } from '@/hooks/crm/useCRMPipelines';
import { toast } from 'sonner';

interface DeletePipelineDialogProps {
  pipeline: CRMPipeline | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

const DeletePipelineDialog = ({ pipeline, open, onOpenChange, onConfirm }: DeletePipelineDialogProps) => {
  const [loading, setLoading] = React.useState(false);
  const { deletePipeline } = useCRMPipelines();

  const handleDelete = async () => {
    if (!pipeline) return;
    
    setLoading(true);
    try {
      await deletePipeline(pipeline.id);
      toast.success('Pipeline removido com sucesso!');
      onConfirm();
    } catch (error) {
      toast.error('Erro ao remover pipeline');
    } finally {
      setLoading(false);
    }
  };

  if (!pipeline) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Confirmar Exclusão
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-gray-600">
            Tem certeza que deseja excluir o pipeline <strong>"{pipeline.name}"</strong>?
          </p>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <p className="text-yellow-800 text-sm">
              ⚠️ Esta ação irá desativar o pipeline. Leads existentes não serão perdidos, mas o pipeline ficará inativo.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button 
            type="button" 
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? 'Removendo...' : 'Sim, Excluir'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeletePipelineDialog;
