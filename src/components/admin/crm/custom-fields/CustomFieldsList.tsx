
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Edit, Trash2, GripVertical, Settings, Eye, EyeOff } from 'lucide-react';
import { useCRMCustomFields } from '@/hooks/crm/useCRMCustomFields';
import { useCRMPipelines } from '@/hooks/crm/useCRMPipelines';
import { CRMCustomField } from '@/types/crm-custom-fields.types';

interface CustomFieldsListProps {
  onEditField: (field: CRMCustomField) => void;
}

export const CustomFieldsList: React.FC<CustomFieldsListProps> = ({ onEditField }) => {
  const [showInactive, setShowInactive] = useState(false);
  const { allCustomFields, allFieldGroups, deleteCustomField } = useCRMCustomFields('', true);
  const { pipelines } = useCRMPipelines();

  // Filtrar campos baseado na opção de mostrar inativos
  const displayFields = showInactive 
    ? allCustomFields 
    : allCustomFields.filter(field => field.is_active);

  const getGroupName = (groupId?: string) => {
    if (!groupId) return 'Sem grupo';
    const group = allFieldGroups.find(g => g.id === groupId);
    return group?.name || 'Grupo não encontrado';
  };

  const getPipelineName = (groupId?: string) => {
    if (!groupId) return 'Todos os pipelines';
    const group = allFieldGroups.find(g => g.id === groupId);
    if (!group?.pipeline_id) return 'Todos os pipelines';
    const pipeline = pipelines.find(p => p.id === group.pipeline_id);
    return pipeline?.name || 'Pipeline não encontrado';
  };

  const getFieldTypeLabel = (type: string) => {
    const labels = {
      text: 'Texto',
      number: 'Número',
      phone: 'Telefone',
      boolean: 'Sim/Não',
      select: 'Seleção'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const handleDelete = async (fieldId: string) => {
    if (window.confirm('Tem certeza que deseja remover este campo? Esta ação não pode ser desfeita.')) {
      deleteCustomField.mutate(fieldId);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Switch
            id="show-inactive-fields"
            checked={showInactive}
            onCheckedChange={setShowInactive}
          />
          <label htmlFor="show-inactive-fields" className="text-sm font-medium">
            Mostrar campos inativos
          </label>
        </div>
        <div className="text-sm text-gray-600">
          {displayFields.length} de {allCustomFields.length} campos
        </div>
      </div>

      {displayFields.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">
            {showInactive ? 'Nenhum campo encontrado' : 'Nenhum campo ativo encontrado'}
          </p>
          <p className="text-sm">
            {showInactive 
              ? 'Clique em "Novo Campo" para adicionar o primeiro campo'
              : 'Ative a opção "Mostrar campos inativos" ou crie um novo campo'
            }
          </p>
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
              <TableHead>Pipeline</TableHead>
              <TableHead>Obrigatório</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayFields.map((field) => (
              <TableRow 
                key={field.id}
                className={!field.is_active ? 'opacity-60 bg-gray-50' : ''}
              >
                <TableCell>
                  <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Settings className={`h-4 w-4 ${field.is_active ? 'text-blue-600' : 'text-gray-400'}`} />
                    <div>
                      <p className="font-medium">{field.field_name}</p>
                      {field.help_text && (
                        <p className="text-xs text-gray-500">{field.help_text}</p>
                      )}
                    </div>
                    {!field.is_active && (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                    {field.field_key}
                  </code>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {getFieldTypeLabel(field.field_type)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <p className="text-sm text-gray-600">
                    {getGroupName(field.group_id)}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="text-sm text-gray-600">
                    {getPipelineName(field.group_id)}
                  </p>
                </TableCell>
                <TableCell>
                  {field.is_required ? (
                    <Badge variant="default" className="bg-red-100 text-red-800">
                      Sim
                    </Badge>
                  ) : (
                    <Badge variant="outline">Não</Badge>
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
