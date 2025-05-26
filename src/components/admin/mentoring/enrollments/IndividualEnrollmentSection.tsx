
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, User } from 'lucide-react';
import { StudentMentoringEnrollment } from '@/types/mentoring.types';
import { EnrollmentCard } from './EnrollmentCard';
import { EnrollmentsList } from './EnrollmentsList';

interface IndividualEnrollmentSectionProps {
  enrollments: StudentMentoringEnrollment[];
  viewMode: 'cards' | 'list';
  selectedEnrollments: string[];
  onView: (enrollment: StudentMentoringEnrollment) => void;
  onEdit: (enrollment: StudentMentoringEnrollment) => void;
  onDelete: (id: string) => void;
  onAddExtension: (enrollment: StudentMentoringEnrollment) => void;
  onToggleSelection: (id: string) => void;
  onSelectAll: () => void;
  onAddEnrollment: () => void;
}

export const IndividualEnrollmentSection: React.FC<IndividualEnrollmentSectionProps> = ({
  enrollments,
  viewMode,
  selectedEnrollments,
  onView,
  onEdit,
  onDelete,
  onAddExtension,
  onToggleSelection,
  onSelectAll,
  onAddEnrollment
}) => {
  return (
    <div className="space-y-4">
      {/* Header da Seção */}
      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <User className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-blue-900">Inscrições Individuais</h2>
            <p className="text-sm text-blue-700">
              {enrollments.length} {enrollments.length === 1 ? 'inscrição' : 'inscrições'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-white text-blue-700 border-blue-300">
            {enrollments.filter(e => e.status === 'ativa').length} ativas
          </Badge>
          <Button
            size="sm"
            onClick={onAddEnrollment}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Individual
          </Button>
        </div>
      </div>

      {/* Conteúdo */}
      {enrollments.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma inscrição individual</h3>
          <p className="text-gray-600 mb-4">Comece criando a primeira inscrição individual.</p>
          <Button onClick={onAddEnrollment}>
            <Plus className="h-4 w-4 mr-2" />
            Criar Inscrição Individual
          </Button>
        </div>
      ) : (
        <>
          {viewMode === 'cards' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {enrollments.map((enrollment) => (
                <EnrollmentCard
                  key={enrollment.id}
                  enrollment={enrollment}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onAddExtension={onAddExtension}
                  onToggleSelection={onToggleSelection}
                  isSelected={selectedEnrollments.includes(enrollment.id)}
                />
              ))}
            </div>
          ) : (
            <EnrollmentsList
              enrollments={enrollments}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddExtension={onAddExtension}
              onToggleSelection={onToggleSelection}
              selectedEnrollments={selectedEnrollments}
              onSelectAll={onSelectAll}
            />
          )}
        </>
      )}
    </div>
  );
};
