
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCRMCustomFields } from '@/hooks/crm/useCRMCustomFields';
import { useCRMPipelines } from '@/hooks/crm/useCRMPipelines';
import { CRMCustomFieldGroup } from '@/types/crm-custom-fields.types';

const groupSchema = z.object({
  name: z.string().min(1, 'Nome do grupo é obrigatório'),
  description: z.string().optional(),
  pipeline_id: z.string().optional(),
  is_active: z.boolean().default(true)
});

type GroupFormData = z.infer<typeof groupSchema>;

interface FieldGroupFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group?: CRMCustomFieldGroup | null;
}

export const FieldGroupFormDialog: React.FC<FieldGroupFormDialogProps> = ({
  open,
  onOpenChange,
  group
}) => {
  const { fieldGroups, createFieldGroup, updateFieldGroup } = useCRMCustomFields();
  const { pipelines } = useCRMPipelines();
  const isEditing = !!group;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<GroupFormData>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: '',
      description: '',
      pipeline_id: '',
      is_active: true
    }
  });

  useEffect(() => {
    if (group) {
      reset({
        name: group.name,
        description: group.description || '',
        pipeline_id: group.pipeline_id || '',
        is_active: group.is_active
      });
    } else {
      reset({
        name: '',
        description: '',
        pipeline_id: '',
        is_active: true
      });
    }
  }, [group, reset]);

  const onSubmit = async (data: GroupFormData) => {
    try {
      const payload = {
        name: data.name,
        description: data.description || undefined,
        pipeline_id: data.pipeline_id || undefined,
        is_active: data.is_active,
        sort_order: isEditing ? undefined : fieldGroups.length + 1
      };

      if (isEditing) {
        await updateFieldGroup.mutateAsync({ id: group.id, input: payload });
      } else {
        await createFieldGroup.mutateAsync(payload);
      }
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao salvar grupo:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Grupo' : 'Novo Grupo de Campos'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Edite as configurações do grupo de campos'
              : 'Configure um novo grupo para organizar os campos'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Grupo *</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Ex: Dados Pessoais"
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Descrição opcional do grupo"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pipeline_id">Pipeline (Opcional)</Label>
            <Select
              value={watch('pipeline_id') || ''}
              onValueChange={(value) => setValue('pipeline_id', value || '')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um pipeline (ou deixe vazio para todos)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os pipelines</SelectItem>
                {pipelines.map((pipeline) => (
                  <SelectItem key={pipeline.id} value={pipeline.id}>
                    {pipeline.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              Se especificar um pipeline, este grupo aparecerá apenas nesse pipeline
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={watch('is_active')}
              onCheckedChange={(checked) => setValue('is_active', checked)}
            />
            <Label htmlFor="is_active">Grupo ativo</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar Grupo'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
