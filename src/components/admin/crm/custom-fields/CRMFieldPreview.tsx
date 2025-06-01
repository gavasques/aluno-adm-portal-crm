
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useCRMCustomFields } from '@/hooks/crm/useCRMCustomFields';
import { CRMCustomField } from '@/types/crm-custom-fields.types';

const renderField = (field: CRMCustomField) => {
  const baseProps = {
    id: field.field_key,
    placeholder: field.placeholder,
    disabled: true
  };

  switch (field.field_type) {
    case 'text':
      return <Input {...baseProps} />;
    
    case 'number':
      return <Input {...baseProps} type="number" />;
    
    case 'phone':
      return <Input {...baseProps} type="tel" />;
    
    case 'boolean':
      return (
        <div className="flex items-center space-x-2">
          <Switch disabled />
          <Label htmlFor={field.field_key}>Sim/Não</Label>
        </div>
      );
    
    case 'select':
      return (
        <Select disabled>
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma opção" />
          </SelectTrigger>
          <SelectContent>
            {field.options.map((option, index) => (
              <SelectItem key={index} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    
    default:
      return <Input {...baseProps} />;
  }
};

export const CRMFieldPreview = () => {
  const { customFields, fieldGroups } = useCRMCustomFields();

  // Agrupar campos por grupo
  const fieldsByGroup = customFields.reduce((acc, field) => {
    const groupId = field.group_id || 'no-group';
    if (!acc[groupId]) {
      acc[groupId] = [];
    }
    acc[groupId].push(field);
    return acc;
  }, {} as Record<string, CRMCustomField[]>);

  // Obter grupos ordenados
  const sortedGroups = fieldGroups.sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-blue-800 font-medium">Preview do Formulário</p>
        <p className="text-blue-600 text-sm">
          Esta é uma visualização de como os campos aparecerão no formulário de lead
        </p>
      </div>

      {/* Campos agrupados */}
      {sortedGroups.map((group) => {
        const groupFields = fieldsByGroup[group.id] || [];
        
        if (groupFields.length === 0) return null;

        return (
          <Card key={group.id}>
            <CardHeader>
              <CardTitle className="text-lg">{group.name}</CardTitle>
              {group.description && (
                <p className="text-sm text-gray-600">{group.description}</p>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {groupFields
                  .sort((a, b) => a.sort_order - b.sort_order)
                  .map((field) => (
                    <div key={field.id} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor={field.field_key}>
                          {field.field_name}
                        </Label>
                        {field.is_required && (
                          <Badge variant="destructive" className="text-xs">
                            Obrigatório
                          </Badge>
                        )}
                      </div>
                      
                      {renderField(field)}
                      
                      {field.help_text && (
                        <p className="text-xs text-gray-500">{field.help_text}</p>
                      )}
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Campos sem grupo */}
      {fieldsByGroup['no-group'] && fieldsByGroup['no-group'].length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Outros Campos</CardTitle>
            <p className="text-sm text-gray-600">Campos sem grupo definido</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fieldsByGroup['no-group']
                .sort((a, b) => a.sort_order - b.sort_order)
                .map((field) => (
                  <div key={field.id} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={field.field_key}>
                        {field.field_name}
                      </Label>
                      {field.is_required && (
                        <Badge variant="destructive" className="text-xs">
                          Obrigatório
                        </Badge>
                      )}
                    </div>
                    
                    {renderField(field)}
                    
                    {field.help_text && (
                      <p className="text-xs text-gray-500">{field.help_text}</p>
                    )}
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {customFields.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg font-medium">Nenhum campo para visualizar</p>
          <p className="text-sm">Crie campos customizáveis para vê-los aqui</p>
        </div>
      )}
    </div>
  );
};
