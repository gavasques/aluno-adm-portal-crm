
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { CRMPipelineColumn } from '@/types/crm.types';
import { useCRMPipelines } from '@/hooks/crm/useCRMPipelines';
import { toast } from 'sonner';

interface DeleteColumnDialogProps {
  column: CRMPipelineColumn | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

const DeleteColumnDialog = ({ column, open, onOpenChange, onConfirm }: DeleteColumnDialogProps) => {
  const [loading, setLoading] = React.useState(false);
  const { deleteColumn } = useCRMPipelines();

  const handleDelete = async () => {
    if (!column) return;
    
    setLoading(true);
    try {
      await deleteColumn(column.id);
      toast.success('Coluna removida com sucesso!');
      onConfirm();
    } catch (error) {
      toast.error('Erro ao remover coluna');
    } finally {
      setLoading(false);
    }
  };

  if (!column) return null;

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
            Tem certeza que deseja excluir a coluna <strong>"{column.name}"</strong>?
          </p>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <p className="text-yellow-800 text-sm">
              ⚠️ Esta ação irá desativar a coluna. Leads existentes nesta coluna serão movidos para uma coluna padrão.
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

export default DeleteColumnDialog;
