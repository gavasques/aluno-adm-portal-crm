
import React, { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCRMCustomFields } from '@/hooks/crm/useCRMCustomFields';
import { CRMCustomField, CRMCustomFieldGroup } from '@/types/crm-custom-fields.types';
import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CustomFieldsSectionProps {
  form: UseFormReturn<any>;
  pipelineId?: string;
}

const CustomFieldsSection: React.FC<CustomFieldsSectionProps> = ({ form, pipelineId }) => {
  // Buscar apenas campos ativos para o formulário
  const { customFields, fieldGroups, isLoading, invalidateAll } = useCRMCustomFields(pipelineId, false);

  // Função para forçar atualização dos dados
  const handleRefresh = () => {
    console.log('🔄 Atualizando campos customizados...');
    invalidateAll();
  };

  // Log para debug
  useEffect(() => {
    console.log('📋 CustomFieldsSection - campos disponíveis:', customFields.length);
    console.log('📋 CustomFieldsSection - grupos disponíveis:', fieldGroups.length);
    console.log('📋 CustomFieldsSection - pipelineId:', pipelineId);
  }, [customFields, fieldGroups, pipelineId]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm text-gray-600">Carregando campos customizados...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Agrupar campos por grupo (apenas ativos)
  const groupedFields = fieldGroups
    .filter(group => group.is_active)
    .reduce((acc, group) => {
      const groupFields = customFields.filter(field => 
        field.group_id === group.id && field.is_active
      );
      if (groupFields.length > 0) {
        acc[group.id] = {
          group,
          fields: groupFields
        };
      }
      return acc;
    }, {} as Record<string, { group: CRMCustomFieldGroup; fields: CRMCustomField[] }>);

  // Campos sem grupo (apenas ativos)
  const ungroupedFields = customFields.filter(field => 
    !field.group_id && field.is_active
  );

  const totalFields = Object.values(groupedFields).reduce((total, { fields }) => total + fields.length, 0) + ungroupedFields.length;

  console.log('📋 CustomFieldsSection - total de campos a exibir:', totalFields);

  if (totalFields === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Campos Personalizados</CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleRefresh}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="text-center py-6">
          <p className="text-sm text-gray-500">Nenhum campo personalizado ativo encontrado.</p>
          <p className="text-xs text-gray-400 mt-1">
            {pipelineId ? 'Para este pipeline' : 'No sistema'}
          </p>
        </CardContent>
      </Card>
    );
  }

  const renderField = (field: CRMCustomField) => {
    const fieldKey = `custom_field_${field.field_key}`;
    const value = form.watch(fieldKey);

    switch (field.field_type) {
      case 'text':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={fieldKey}>
              {field.field_name}
              {field.is_required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={fieldKey}
              placeholder={field.placeholder}
              {...form.register(fieldKey, { 
                required: field.is_required ? `${field.field_name} é obrigatório` : false 
              })}
            />
            {field.help_text && (
              <p className="text-xs text-gray-500">{field.help_text}</p>
            )}
          </div>
        );

      case 'number':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={fieldKey}>
              {field.field_name}
              {field.is_required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={fieldKey}
              type="number"
              placeholder={field.placeholder}
              {...form.register(fieldKey, { 
                required: field.is_required ? `${field.field_name} é obrigatório` : false,
                valueAsNumber: true
              })}
            />
            {field.help_text && (
              <p className="text-xs text-gray-500">{field.help_text}</p>
            )}
          </div>
        );

      case 'phone':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={fieldKey}>
              {field.field_name}
              {field.is_required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={fieldKey}
              type="tel"
              placeholder={field.placeholder || "(00) 00000-0000"}
              {...form.register(fieldKey, { 
                required: field.is_required ? `${field.field_name} é obrigatório` : false 
              })}
            />
            {field.help_text && (
              <p className="text-xs text-gray-500">{field.help_text}</p>
            )}
          </div>
        );

      case 'boolean':
        return (
          <div key={field.id} className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch
                id={fieldKey}
                checked={value || false}
                onCheckedChange={(checked) => form.setValue(fieldKey, checked)}
              />
              <Label htmlFor={fieldKey}>
                {field.field_name}
                {field.is_required && <span className="text-red-500 ml-1">*</span>}
              </Label>
            </div>
            {field.help_text && (
              <p className="text-xs text-gray-500">{field.help_text}</p>
            )}
          </div>
        );

      case 'select':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={fieldKey}>
              {field.field_name}
              {field.is_required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select
              value={value || ''}
              onValueChange={(selectedValue) => form.setValue(fieldKey, selectedValue)}
            >
              <SelectTrigger>
                <SelectValue placeholder={field.placeholder || 'Selecione uma opção'} />
              </SelectTrigger>
              <SelectContent>
                {field.options.map((option, index) => (
                  <SelectItem key={index} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {field.help_text && (
              <p className="text-xs text-gray-500">{field.help_text}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Campos agrupados (apenas grupos ativos com campos ativos) */}
      {Object.values(groupedFields).map(({ group, fields }) => (
        <Card key={group.id}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm">{group.name}</CardTitle>
                {group.description && (
                  <p className="text-xs text-gray-600 mt-1">{group.description}</p>
                )}
              </div>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                {fields.length} campo{fields.length !== 1 ? 's' : ''}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map(renderField)}
          </CardContent>
        </Card>
      ))}

      {/* Campos sem grupo (apenas ativos) */}
      {ungroupedFields.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Campos Adicionais</CardTitle>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                {ungroupedFields.length} campo{ungroupedFields.length !== 1 ? 's' : ''}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {ungroupedFields.map(renderField)}
          </CardContent>
        </Card>
      )}

      {/* Debug info (apenas em desenvolvimento) */}
      {process.env.NODE_ENV === 'development' && (
        <Card className="border-dashed border-gray-300">
          <CardContent className="p-4">
            <div className="text-xs text-gray-500 space-y-1">
              <p>🔧 Debug: {customFields.length} campos total, {totalFields} ativos</p>
              <p>📁 Grupos: {fieldGroups.length} total, {Object.keys(groupedFields).length} com campos</p>
              <p>🎯 Pipeline: {pipelineId || 'Todos'}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CustomFieldsSection;
