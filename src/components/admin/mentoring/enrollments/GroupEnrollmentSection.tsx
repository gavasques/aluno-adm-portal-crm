
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Users } from 'lucide-react';
import { GroupEnrollment } from '@/types/mentoring.types';
import { GroupEnrollmentCard } from './GroupEnrollmentCard';

interface GroupEnrollmentSectionProps {
  groups: GroupEnrollment[];
  selectedGroups: string[];
  onView: (group: GroupEnrollment) => void;
  onEdit: (group: GroupEnrollment) => void;
  onDelete: (id: string) => void;
  onAddStudent: (group: GroupEnrollment) => void;
  onRemoveStudent: (groupId: string, studentId: string) => void;
  onToggleSelection: (id: string) => void;
  onAddGroup: () => void;
}

export const GroupEnrollmentSection: React.FC<GroupEnrollmentSectionProps> = ({
  groups,
  selectedGroups,
  onView,
  onEdit,
  onDelete,
  onAddStudent,
  onRemoveStudent,
  onToggleSelection,
  onAddGroup
}) => {
  const totalParticipants = groups.reduce((sum, group) => sum + group.participants.length, 0);

  return (
    <div className="space-y-4">
      {/* Header da Seção */}
      <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Users className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-purple-900">Inscrições em Grupo</h2>
            <p className="text-sm text-purple-700">
              {groups.length} {groups.length === 1 ? 'grupo' : 'grupos'} • {totalParticipants} participantes
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-white text-purple-700 border-purple-300">
            {groups.filter(g => g.status === 'ativa').length} ativos
          </Badge>
          <Button
            size="sm"
            onClick={onAddGroup}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Grupo
          </Button>
        </div>
      </div>

      {/* Conteúdo */}
      {groups.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum grupo criado</h3>
          <p className="text-gray-600 mb-4">Comece criando o primeiro grupo de mentoria.</p>
          <Button onClick={onAddGroup}>
            <Plus className="h-4 w-4 mr-2" />
            Criar Grupo
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {groups.map((group) => (
            <GroupEnrollmentCard
              key={group.id}
              group={group}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddStudent={onAddStudent}
              onRemoveStudent={onRemoveStudent}
              onToggleSelection={onToggleSelection}
              isSelected={selectedGroups.includes(group.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
