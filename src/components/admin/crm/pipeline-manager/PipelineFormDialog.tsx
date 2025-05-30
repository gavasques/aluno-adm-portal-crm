
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { CRMPipeline } from '@/types/crm.types';
import { motion } from 'framer-motion';
import { Workflow, Save } from 'lucide-react';

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
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<PipelineFormData>({
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      sort_order: initialData?.sort_order || 0,
      is_active: initialData?.is_active ?? true
    }
  });

  const isActive = watch('is_active');

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
      <DialogContent className="sm:max-w-lg bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 border-0 shadow-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Workflow className="h-4 w-4 text-white" />
              </div>
              {title}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 mt-6">
            {/* Nome do Pipeline */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                Nome do Pipeline *
              </Label>
              <Input
                id="name"
                {...register('name', { required: 'Nome é obrigatório' })}
                placeholder="Ex: Vendas, Suporte, Onboarding..."
                className="bg-white/80 border-white/40 focus:border-blue-300 focus:ring-blue-200"
              />
              {errors.name && (
                <motion.span 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-600 font-medium"
                >
                  {errors.name.message}
                </motion.span>
              )}
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-semibold text-gray-700">
                Descrição
              </Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Descreva o propósito deste pipeline..."
                rows={3}
                className="bg-white/80 border-white/40 focus:border-blue-300 focus:ring-blue-200 resize-none"
              />
            </div>

            {/* Configurações */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sort_order" className="text-sm font-semibold text-gray-700">
                  Ordem de Exibição
                </Label>
                <Input
                  id="sort_order"
                  type="number"
                  min="0"
                  {...register('sort_order', { valueAsNumber: true })}
                  placeholder="0"
                  className="bg-white/80 border-white/40 focus:border-blue-300 focus:ring-blue-200"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">Status</Label>
                <div className="flex items-center space-x-3 h-10">
                  <Switch
                    id="is_active"
                    checked={isActive}
                    onCheckedChange={(checked) => setValue('is_active', checked)}
                    className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-purple-500"
                  />
                  <Label htmlFor="is_active" className="text-sm font-medium cursor-pointer">
                    {isActive ? 'Pipeline ativo' : 'Pipeline inativo'}
                  </Label>
                </div>
              </div>
            </div>

            <DialogFooter className="pt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="bg-white/80 hover:bg-gray-50"
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
              >
                <Save className="h-4 w-4 mr-2" />
                {initialData ? 'Atualizar' : 'Criar'} Pipeline
              </Button>
            </DialogFooter>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default PipelineFormDialog;
