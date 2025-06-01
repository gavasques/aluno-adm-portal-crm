
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCRMCustomFields } from '@/hooks/crm/useCRMCustomFields';
import { CRMCustomField, CRMCustomFieldGroup } from '@/types/crm-custom-fields.types';

interface CustomFieldsSectionProps {
  form: UseFormReturn<any>;
  pipelineId?: string;
}

const CustomFieldsSection: React.FC<CustomFieldsSectionProps> = ({ form, pipelineId }) => {
  const { customFields, fieldGroups, isLoading } = useCRMCustomFields(pipelineId);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (customFields.length === 0) {
    return null;
  }

  // Agrupar campos por grupo
  const groupedFields = fieldGroups.reduce((acc, group) => {
    acc[group.id] = {
      group,
      fields: customFields.filter(field => field.group_id === group.id)
    };
    return acc;
  }, {} as Record<string, { group: CRMCustomFieldGroup; fields: CRMCustomField[] }>);

  // Campos sem grupo
  const ungroupedFields = customFields.filter(field => !field.group_id);

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
    <div className="space-y-6">
      {/* Campos agrupados */}
      {Object.values(groupedFields).map(({ group, fields }) => (
        fields.length > 0 && (
          <Card key={group.id}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">{group.name}</CardTitle>
              {group.description && (
                <p className="text-xs text-gray-600">{group.description}</p>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {fields.map(renderField)}
            </CardContent>
          </Card>
        )
      ))}

      {/* Campos sem grupo */}
      {ungroupedFields.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Campos Adicionais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {ungroupedFields.map(renderField)}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CustomFieldsSection;
