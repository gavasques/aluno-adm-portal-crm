
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { CRMPipelineColumn } from '@/types/crm.types';
import { motion } from 'framer-motion';
import { Palette, Save, Columns } from 'lucide-react';

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
  { color: '#ef4444', name: 'Vermelho' },
  { color: '#f97316', name: 'Laranja' },
  { color: '#f59e0b', name: 'Âmbar' },
  { color: '#eab308', name: 'Amarelo' },
  { color: '#84cc16', name: 'Lima' },
  { color: '#22c55e', name: 'Verde' },
  { color: '#10b981', name: 'Esmeralda' },
  { color: '#14b8a6', name: 'Teal' },
  { color: '#06b6d4', name: 'Ciano' },
  { color: '#0ea5e9', name: 'Azul Claro' },
  { color: '#3b82f6', name: 'Azul' },
  { color: '#6366f1', name: 'Índigo' },
  { color: '#8b5cf6', name: 'Violeta' },
  { color: '#a855f7', name: 'Roxo' },
  { color: '#d946ef', name: 'Fúcsia' },
  { color: '#ec4899', name: 'Rosa' },
  { color: '#f43f5e', name: 'Rosa Escuro' },
  { color: '#6b7280', name: 'Cinza' },
  { color: '#374151', name: 'Cinza Escuro' },
  { color: '#1f2937', name: 'Cinza Muito Escuro' }
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
  const isActive = watch('is_active');

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
      <DialogContent className="sm:max-w-lg bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 border-0 shadow-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Columns className="h-4 w-4 text-white" />
              </div>
              {title}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 mt-6">
            {/* Nome da Coluna */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                Nome da Coluna *
              </Label>
              <Input
                id="name"
                {...register('name', { required: 'Nome é obrigatório' })}
                placeholder="Ex: Novo Lead, Qualificado, Convertido..."
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

            {/* Seleção de Cor */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Cor da Coluna
              </Label>
              
              {/* Cores Predefinidas */}
              <div className="grid grid-cols-10 gap-2 p-4 bg-white/60 rounded-xl border border-white/40">
                {predefinedColors.map(({ color, name }) => (
                  <motion.button
                    key={color}
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      w-8 h-8 rounded-full border-2 transition-all relative group
                      ${selectedColor === color 
                        ? 'border-gray-800 scale-110 shadow-lg' 
                        : 'border-gray-300 hover:border-gray-500'
                      }
                    `}
                    style={{ backgroundColor: color }}
                    onClick={() => setValue('color', color)}
                    title={name}
                  >
                    {selectedColor === color && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <div className="w-2 h-2 bg-white rounded-full shadow-sm" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
              
              {/* Cor Personalizada */}
              <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg border border-white/40">
                <Label htmlFor="custom-color" className="text-sm font-medium">
                  Cor personalizada:
                </Label>
                <input
                  type="color"
                  id="custom-color"
                  value={selectedColor}
                  onChange={(e) => setValue('color', e.target.value)}
                  className="w-10 h-10 rounded-lg border-2 border-gray-300 cursor-pointer hover:border-gray-400 transition-colors"
                />
                <span className="text-sm text-gray-600 font-mono bg-gray-100 px-2 py-1 rounded">
                  {selectedColor}
                </span>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">Status</Label>
              <div className="flex items-center space-x-3 p-3 bg-white/60 rounded-lg border border-white/40">
                <Switch
                  id="is_active"
                  checked={isActive}
                  onCheckedChange={(checked) => setValue('is_active', checked)}
                  className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-purple-500"
                />
                <Label htmlFor="is_active" className="text-sm font-medium cursor-pointer">
                  {isActive ? 'Coluna ativa' : 'Coluna inativa'}
                </Label>
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
                {initialData ? 'Atualizar' : 'Criar'} Coluna
              </Button>
            </DialogFooter>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default ColumnFormDialog;
