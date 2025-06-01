
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCRMCustomFields } from '@/hooks/crm/useCRMCustomFields';
import { CRMCustomField } from '@/types/crm-custom-fields.types';
import { Plus, Trash2 } from 'lucide-react';

const fieldSchema = z.object({
  field_key: z.string().min(1, 'Chave do campo é obrigatória').regex(/^[a-z0-9_]+$/, 'Use apenas letras minúsculas, números e underscore'),
  field_name: z.string().min(1, 'Nome do campo é obrigatório'),
  field_type: z.enum(['text', 'number', 'phone', 'boolean', 'select']),
  group_id: z.string().optional(),
  is_required: z.boolean().default(false),
  placeholder: z.string().optional(),
  help_text: z.string().optional(),
  options: z.array(z.string()).default([])
});

type FieldFormData = z.infer<typeof fieldSchema>;

interface CustomFieldFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  field?: CRMCustomField | null;
}

export const CustomFieldFormDialog: React.FC<CustomFieldFormDialogProps> = ({
  open,
  onOpenChange,
  field
}) => {
  const { fieldGroups, createCustomField, updateCustomField } = useCRMCustomFields();
  const isEditing = !!field;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<FieldFormData>({
    resolver: zodResolver(fieldSchema),
    defaultValues: {
      field_key: '',
      field_name: '',
      field_type: 'text',
      group_id: '',
      is_required: false,
      placeholder: '',
      help_text: '',
      options: []
    }
  });

  const fieldType = watch('field_type');
  const options = watch('options');

  useEffect(() => {
    if (field) {
      reset({
        field_key: field.field_key,
        field_name: field.field_name,
        field_type: field.field_type,
        group_id: field.group_id || '',
        is_required: field.is_required,
        placeholder: field.placeholder || '',
        help_text: field.help_text || '',
        options: field.options || []
      });
    } else {
      reset({
        field_key: '',
        field_name: '',
        field_type: 'text',
        group_id: '',
        is_required: false,
        placeholder: '',
        help_text: '',
        options: []
      });
    }
  }, [field, reset]);

  const onSubmit = async (data: FieldFormData) => {
    try {
      const payload = {
        field_key: data.field_key,
        field_name: data.field_name,
        field_type: data.field_type,
        group_id: data.group_id || undefined,
        is_required: data.is_required,
        placeholder: data.placeholder || undefined,
        help_text: data.help_text || undefined,
        options: data.field_type === 'select' ? data.options : []
      };

      if (isEditing) {
        await updateCustomField.mutateAsync({ id: field.id, input: payload });
      } else {
        await createCustomField.mutateAsync(payload);
      }
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao salvar campo:', error);
    }
  };

  const addOption = () => {
    setValue('options', [...options, '']);
  };

  const removeOption = (index: number) => {
    setValue('options', options.filter((_, i) => i !== index));
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setValue('options', newOptions);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Campo' : 'Novo Campo Customizável'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Edite as configurações do campo customizável'
              : 'Configure um novo campo para os formulários de leads'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="field_name">Nome do Campo *</Label>
              <Input
                id="field_name"
                {...register('field_name')}
                placeholder="Ex: Data de Nascimento"
              />
              {errors.field_name && (
                <p className="text-sm text-red-600">{errors.field_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="field_key">Chave do Campo *</Label>
              <Input
                id="field_key"
                {...register('field_key')}
                placeholder="Ex: data_nascimento"
                disabled={isEditing}
              />
              {errors.field_key && (
                <p className="text-sm text-red-600">{errors.field_key.message}</p>
              )}
              <p className="text-xs text-gray-500">
                Use apenas letras minúsculas, números e underscore. Não pode ser alterada após criação.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="field_type">Tipo do Campo *</Label>
              <Select value={fieldType} onValueChange={(value) => setValue('field_type', value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Texto Livre</SelectItem>
                  <SelectItem value="number">Número</SelectItem>
                  <SelectItem value="phone">Telefone</SelectItem>
                  <SelectItem value="boolean">Sim/Não</SelectItem>
                  <SelectItem value="select">Múltipla Escolha</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="group_id">Grupo</Label>
              <Select value={watch('group_id') || 'no_group'} onValueChange={(value) => setValue('group_id', value === 'no_group' ? '' : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um grupo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no_group">Sem grupo</SelectItem>
                  {fieldGroups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                Campos sem grupo aparecerão em todos os pipelines
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="placeholder">Placeholder</Label>
            <Input
              id="placeholder"
              {...register('placeholder')}
              placeholder="Texto de exemplo para o campo"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="help_text">Texto de Ajuda</Label>
            <Textarea
              id="help_text"
              {...register('help_text')}
              placeholder="Instrução ou descrição para ajudar o usuário"
              rows={2}
            />
          </div>

          {fieldType === 'select' && (
            <div className="space-y-2">
              <Label>Opções de Escolha *</Label>
              <div className="space-y-2">
                {options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={`Opção ${index + 1}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeOption(index)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addOption}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Opção
                </Button>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Switch
              id="is_required"
              checked={watch('is_required')}
              onCheckedChange={(checked) => setValue('is_required', checked)}
            />
            <Label htmlFor="is_required">Campo obrigatório</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar Campo'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
