
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { CRMPipelineColumn } from '@/types/crm.types';

interface ColumnFormData {
  name: string;
  color: string;
  is_active: boolean;
}

interface ColumnFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ColumnFormData) => void;
  title: string;
  initialData?: CRMPipelineColumn | null;
}

const predefinedColors = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
  '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
  '#ec4899', '#f43f5e', '#6b7280', '#374151', '#1f2937'
];

const ColumnFormDialog = ({ 
  open, 
  onOpenChange, 
  onSubmit, 
  title, 
  initialData 
}: ColumnFormDialogProps) => {
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<ColumnFormData>({
    defaultValues: {
      name: initialData?.name || '',
      color: initialData?.color || '#3b82f6',
      is_active: initialData?.is_active ?? true
    }
  });

  const selectedColor = watch('color');

  React.useEffect(() => {
    if (open) {
      reset({
        name: initialData?.name || '',
        color: initialData?.color || '#3b82f6',
        is_active: initialData?.is_active ?? true
      });
    }
  }, [open, initialData, reset]);

  const handleFormSubmit = (data: ColumnFormData) => {
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
            <Label htmlFor="name">Nome da Coluna *</Label>
            <Input
              id="name"
              {...register('name', { required: 'Nome é obrigatório' })}
              placeholder="Ex: Novo Lead, Qualificado, Convertido..."
            />
            {errors.name && (
              <span className="text-sm text-red-600">{errors.name.message}</span>
            )}
          </div>

          <div className="space-y-2">
            <Label>Cor da Coluna</Label>
            <div className="grid grid-cols-10 gap-2">
              {predefinedColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-6 h-6 rounded-full border-2 transition-all hover:scale-110 ${
                    selectedColor === color ? 'border-gray-800 scale-110' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setValue('color', color)}
                />
              ))}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Label htmlFor="custom-color" className="text-sm">Cor customizada:</Label>
              <input
                type="color"
                id="custom-color"
                value={selectedColor}
                onChange={(e) => setValue('color', e.target.value)}
                className="w-8 h-8 rounded border cursor-pointer"
              />
              <span className="text-sm text-gray-500">{selectedColor}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_active"
              {...register('is_active')}
              className="rounded border-gray-300"
            />
            <Label htmlFor="is_active">Coluna ativa</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {initialData ? 'Atualizar' : 'Criar'} Coluna
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ColumnFormDialog;
