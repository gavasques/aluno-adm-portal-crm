
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, GripVertical, Type, Hash, Phone, ToggleLeft, List } from 'lucide-react';
import { useCRMCustomFields } from '@/hooks/crm/useCRMCustomFields';
import { CRMCustomField } from '@/types/crm-custom-fields.types';

interface CustomFieldsListProps {
  onEditField: (field: CRMCustomField) => void;
}

const getFieldTypeIcon = (type: string) => {
  switch (type) {
    case 'text': return <Type className="h-4 w-4" />;
    case 'number': return <Hash className="h-4 w-4" />;
    case 'phone': return <Phone className="h-4 w-4" />;
    case 'boolean': return <ToggleLeft className="h-4 w-4" />;
    case 'select': return <List className="h-4 w-4" />;
    default: return <Type className="h-4 w-4" />;
  }
};

const getFieldTypeLabel = (type: string) => {
  switch (type) {
    case 'text': return 'Texto Livre';
    case 'number': return 'Número';
    case 'phone': return 'Telefone';
    case 'boolean': return 'Sim/Não';
    case 'select': return 'Múltipla Escolha';
    default: return type;
  }
};

export const CustomFieldsList: React.FC<CustomFieldsListProps> = ({ onEditField }) => {
  const { customFields, deleteCustomField } = useCRMCustomFields();

  const handleDelete = async (fieldId: string) => {
    if (window.confirm('Tem certeza que deseja remover este campo? Esta ação não pode ser desfeita.')) {
      deleteCustomField.mutate(fieldId);
    }
  };

  return (
    <div className="space-y-4">
      {customFields.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Type className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">Nenhum campo customizável criado</p>
          <p className="text-sm">Clique em "Novo Campo" para adicionar o primeiro campo</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Nome do Campo</TableHead>
              <TableHead>Chave</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Grupo</TableHead>
              <TableHead>Obrigatório</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customFields.map((field) => (
              <TableRow key={field.id}>
                <TableCell>
                  <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getFieldTypeIcon(field.field_type)}
                    <div>
                      <p className="font-medium">{field.field_name}</p>
                      {field.help_text && (
                        <p className="text-xs text-gray-500">{field.help_text}</p>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                    {field.field_key}
                  </code>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {getFieldTypeLabel(field.field_type)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {field.group ? (
                    <Badge variant="outline">{field.group.name}</Badge>
                  ) : (
                    <span className="text-gray-400">Sem grupo</span>
                  )}
                </TableCell>
                <TableCell>
                  {field.is_required ? (
                    <Badge variant="destructive">Obrigatório</Badge>
                  ) : (
                    <Badge variant="secondary">Opcional</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {field.is_active ? (
                    <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                  ) : (
                    <Badge variant="secondary">Inativo</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center gap-2 justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditField(field)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(field.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};
