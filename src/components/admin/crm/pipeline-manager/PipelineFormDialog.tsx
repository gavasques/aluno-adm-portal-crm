
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { CRMPipeline } from '@/types/crm.types';

interface PipelineFormData {
  name: string;
  description?: string;
  sort_order: number;
  is_active: boolean;
}

interface PipelineFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: PipelineFormData) => void;
  title: string;
  initialData?: CRMPipeline | null;
}

const PipelineFormDialog = ({ 
  open, 
  onOpenChange, 
  onSubmit, 
  title, 
  initialData 
}: PipelineFormDialogProps) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<PipelineFormData>({
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      sort_order: initialData?.sort_order || 0,
      is_active: initialData?.is_active ?? true
    }
  });

  React.useEffect(() => {
    if (open) {
      reset({
        name: initialData?.name || '',
        description: initialData?.description || '',
        sort_order: initialData?.sort_order || 0,
        is_active: initialData?.is_active ?? true
      });
    }
  }, [open, initialData, reset]);

  const handleFormSubmit = (data: PipelineFormData) => {
    onSubmit(data);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Pipeline *</Label>
            <Input
              id="name"
              {...register('name', { required: 'Nome é obrigatório' })}
              placeholder="Ex: Vendas, Suporte, Onboarding..."
            />
            {errors.name && (
              <span className="text-sm text-red-600">{errors.name.message}</span>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Descreva o propósito deste pipeline..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sort_order">Ordem de Exibição</Label>
            <Input
              id="sort_order"
              type="number"
              min="0"
              {...register('sort_order', { valueAsNumber: true })}
              placeholder="0"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_active"
              {...register('is_active')}
              className="rounded border-gray-300"
            />
            <Label htmlFor="is_active">Pipeline ativo</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {initialData ? 'Atualizar' : 'Criar'} Pipeline
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PipelineFormDialog;
