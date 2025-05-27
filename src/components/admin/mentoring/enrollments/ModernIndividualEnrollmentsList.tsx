
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  Clock,
  User,
  GraduationCap,
  Calendar
} from 'lucide-react';
import { StudentMentoringEnrollment } from '@/types/mentoring.types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { EnrollmentStatus } from './EnrollmentStatus';
import { EnrollmentProgress } from './EnrollmentProgress';
import { EnrollmentActions } from './EnrollmentActions';

interface ModernIndividualEnrollmentsListProps {
  enrollments: StudentMentoringEnrollment[];
  onView: (enrollment: StudentMentoringEnrollment) => void;
  onEdit: (enrollment: StudentMentoringEnrollment) => void;
  onDelete: (id: string) => void;
  onAddExtension: (enrollment: StudentMentoringEnrollment) => void;
  onToggleSelection: (id: string) => void;
  selectedEnrollments: string[];
}

export const ModernIndividualEnrollmentsList: React.FC<ModernIndividualEnrollmentsListProps> = ({
  enrollments,
  onView,
  onEdit,
  onDelete,
  onAddExtension,
  onToggleSelection,
  selectedEnrollments
}) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
    } catch {
      return 'Data inválida';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header da Tabela */}
      <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
        <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-700 uppercase tracking-wider">
          <div className="col-span-1">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              onChange={(e) => {
                // Selecionar/deselecionar todos
                if (e.target.checked) {
                  enrollments.forEach(enrollment => {
                    if (!selectedEnrollments.includes(enrollment.id)) {
                      onToggleSelection(enrollment.id);
                    }
                  });
                } else {
                  enrollments.forEach(enrollment => {
                    if (selectedEnrollments.includes(enrollment.id)) {
                      onToggleSelection(enrollment.id);
                    }
                  });
                }
              }}
            />
          </div>
          <div className="col-span-2">Aluno</div>
          <div className="col-span-3">Mentoria</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-2">Progresso</div>
          <div className="col-span-2">Período</div>
          <div className="col-span-1">Ações</div>
        </div>
      </div>

      {/* Linhas da Tabela */}
      <div className="divide-y divide-gray-200">
        {enrollments.map((enrollment) => {
          const isSelected = selectedEnrollments.includes(enrollment.id);

          return (
            <div 
              key={enrollment.id}
              className={`grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors ${
                isSelected ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
              }`}
            >
              {/* Checkbox */}
              <div className="col-span-1 flex items-center">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggleSelection(enrollment.id)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>

              {/* Aluno */}
              <div className="col-span-2 flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <User className="h-3 w-3 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {enrollment.studentId}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {enrollment.responsibleMentor}
                  </p>
                </div>
              </div>

              {/* Mentoria */}
              <div className="col-span-3 flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-gray-400" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {enrollment.mentoring.name}
                  </p>
                  <Badge variant="outline" className="text-xs border-blue-200 text-blue-700">
                    {enrollment.mentoring.type}
                  </Badge>
                </div>
              </div>

              {/* Status */}
              <div className="col-span-1 flex items-center">
                <EnrollmentStatus status={enrollment.status} className="text-xs" />
              </div>

              {/* Progresso */}
              <div className="col-span-2 flex items-center">
                <EnrollmentProgress 
                  sessionsUsed={enrollment.sessionsUsed || 0}
                  totalSessions={enrollment.totalSessions || 0}
                  className="flex-1"
                />
              </div>

              {/* Período */}
              <div className="col-span-2 flex items-center text-xs text-gray-500">
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(enrollment.startDate)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{formatDate(enrollment.endDate)}</span>
                  </div>
                </div>
              </div>

              {/* Ações */}
              <div className="col-span-1 flex items-center">
                <EnrollmentActions
                  enrollment={enrollment}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onAddExtension={onAddExtension}
                  compact={true}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
