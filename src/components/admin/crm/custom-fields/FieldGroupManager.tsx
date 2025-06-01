
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Edit, Trash2, GripVertical, Layers, Eye, EyeOff } from 'lucide-react';
import { useCRMCustomFields } from '@/hooks/crm/useCRMCustomFields';
import { useCRMPipelines } from '@/hooks/crm/useCRMPipelines';
import { CRMCustomFieldGroup } from '@/types/crm-custom-fields.types';

interface FieldGroupManagerProps {
  onEditGroup: (group: CRMCustomFieldGroup) => void;
}

export const FieldGroupManager: React.FC<FieldGroupManagerProps> = ({ onEditGroup }) => {
  const [showInactive, setShowInactive] = useState(false);
  const { allFieldGroups, allCustomFields, deleteFieldGroup } = useCRMCustomFields('', true);
  const { pipelines } = useCRMPipelines();

  // Filtrar grupos baseado na opção de mostrar inativos
  const displayGroups = showInactive 
    ? allFieldGroups 
    : allFieldGroups.filter(group => group.is_active);

  const getFieldCountInGroup = (groupId: string) => {
    return allCustomFields.filter(field => field.group_id === groupId).length;
  };

  const getPipelineName = (pipelineId?: string) => {
    if (!pipelineId) return 'Todos os pipelines';
    const pipeline = pipelines.find(p => p.id === pipelineId);
    return pipeline?.name || 'Pipeline não encontrado';
  };

  const handleDelete = async (groupId: string) => {
    const fieldCount = getFieldCountInGroup(groupId);
    
    if (fieldCount > 0) {
      alert(`Não é possível remover este grupo pois ele contém ${fieldCount} campo(s). Remova primeiro os campos ou mova-os para outro grupo.`);
      return;
    }

    if (window.confirm('Tem certeza que deseja remover este grupo? Esta ação não pode ser desfeita.')) {
      deleteFieldGroup.mutate(groupId);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Switch
            id="show-inactive"
            checked={showInactive}
            onCheckedChange={setShowInactive}
          />
          <label htmlFor="show-inactive" className="text-sm font-medium">
            Mostrar grupos inativos
          </label>
        </div>
        <div className="text-sm text-gray-600">
          {displayGroups.length} de {allFieldGroups.length} grupos
        </div>
      </div>

      {displayGroups.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Layers className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">
            {showInactive ? 'Nenhum grupo encontrado' : 'Nenhum grupo ativo encontrado'}
          </p>
          <p className="text-sm">
            {showInactive 
              ? 'Clique em "Novo Grupo" para adicionar o primeiro grupo'
              : 'Ative a opção "Mostrar grupos inativos" ou crie um novo grupo'
            }
          </p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Nome do Grupo</TableHead>
              <TableHead>Pipeline</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Campos</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayGroups.map((group) => (
              <TableRow 
                key={group.id}
                className={!group.is_active ? 'opacity-60 bg-gray-50' : ''}
              >
                <TableCell>
                  <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Layers className={`h-4 w-4 ${group.is_active ? 'text-blue-600' : 'text-gray-400'}`} />
                    <p className="font-medium">{group.name}</p>
                    {!group.is_active && (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-sm text-gray-600">
                    {getPipelineName(group.pipeline_id)}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="text-sm text-gray-600">
                    {group.description || 'Sem descrição'}
                  </p>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {getFieldCountInGroup(group.id)} campos
                  </Badge>
                </TableCell>
                <TableCell>
                  {group.is_active ? (
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
                      onClick={() => onEditGroup(group)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(group.id)}
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
