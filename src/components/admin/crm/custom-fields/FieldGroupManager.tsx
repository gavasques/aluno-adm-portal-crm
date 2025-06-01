
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, GripVertical, Layers } from 'lucide-react';
import { useCRMCustomFields } from '@/hooks/crm/useCRMCustomFields';
import { CRMCustomFieldGroup } from '@/types/crm-custom-fields.types';

interface FieldGroupManagerProps {
  onEditGroup: (group: CRMCustomFieldGroup) => void;
}

export const FieldGroupManager: React.FC<FieldGroupManagerProps> = ({ onEditGroup }) => {
  const { fieldGroups, customFields, deleteFieldGroup } = useCRMCustomFields();

  const getFieldCountInGroup = (groupId: string) => {
    return customFields.filter(field => field.group_id === groupId).length;
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
      {fieldGroups.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Layers className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">Nenhum grupo criado</p>
          <p className="text-sm">Clique em "Novo Grupo" para adicionar o primeiro grupo</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Nome do Grupo</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Campos</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fieldGroups.map((group) => (
              <TableRow key={group.id}>
                <TableCell>
                  <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-blue-600" />
                    <p className="font-medium">{group.name}</p>
                  </div>
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
