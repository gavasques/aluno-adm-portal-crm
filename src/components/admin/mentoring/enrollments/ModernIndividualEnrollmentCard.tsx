
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  CalendarRange, 
  GraduationCap, 
  User, 
  Clock,
  Calendar
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { StudentMentoringEnrollment } from '@/types/mentoring.types';
import { EnrollmentStatus } from './EnrollmentStatus';
import { EnrollmentProgress } from './EnrollmentProgress';
import { EnrollmentActions } from './EnrollmentActions';
import { cn } from '@/lib/utils';

interface ModernIndividualEnrollmentCardProps {
  enrollment: StudentMentoringEnrollment;
  onView: (enrollment: StudentMentoringEnrollment) => void;
  onEdit: (enrollment: StudentMentoringEnrollment) => void;
  onDelete: (id: string) => void;
  onAddExtension: (enrollment: StudentMentoringEnrollment) => void;
  onToggleSelection?: (id: string) => void;
  isSelected?: boolean;
}

export const ModernIndividualEnrollmentCard: React.FC<ModernIndividualEnrollmentCardProps> = ({
  enrollment,
  onView,
  onEdit,
  onDelete,
  onAddExtension,
  onToggleSelection,
  isSelected
}) => {
  // Calcular dias restantes
  const daysRemaining = differenceInDays(new Date(enrollment.endDate), new Date());

  // Função para obter o nome do aluno - temporariamente usando um nome fixo
  // TODO: Implementar busca real do nome do aluno via API
  const getStudentName = (studentId: string) => {
    // Por enquanto, vamos usar um nome genérico baseado no ID
    return `Aluno ${studentId.slice(-8)}`;
  };

  return (
    <Card 
      className={cn(
        "transition-all hover:shadow-md border border-gray-200 hover:border-gray-300",
        isSelected && "border-blue-500 ring-1 ring-blue-500"
      )}
      data-selected={isSelected}
    >
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-full">
              <User className="h-4 w-4 text-blue-600" />
            </div>
            <h3 className="font-medium line-clamp-1">
              {getStudentName(enrollment.studentId)}
            </h3>
          </div>
          
          <EnrollmentStatus status={enrollment.status} />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-700 line-clamp-1">{enrollment.mentoring.name}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-700 line-clamp-1">{enrollment.responsibleMentor}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <CalendarRange className="h-4 w-4 text-gray-400" />
            <div className="text-xs text-gray-600">
              <span>{format(new Date(enrollment.startDate), 'dd/MM/yyyy', { locale: ptBR })}</span>
              <span className="mx-1">a</span>
              <span>{format(new Date(enrollment.endDate), 'dd/MM/yyyy', { locale: ptBR })}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <div className="text-xs flex-1">
              <span className="text-gray-600">
                {enrollment.sessionsUsed} de {enrollment.totalSessions} sessões realizadas 
                {enrollment.hasExtension && (
                  <span className="ml-1 text-blue-600 font-medium">(com extensão)</span>
                )}
              </span>
            </div>
          </div>

          <EnrollmentProgress 
            sessionsUsed={enrollment.sessionsUsed}
            totalSessions={enrollment.totalSessions}
          />

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <div className="text-xs">
              <span className={cn(
                "font-medium",
                daysRemaining < 0 ? "text-red-600" : 
                daysRemaining < 30 ? "text-amber-600" : "text-green-600"
              )}>
                {daysRemaining < 0 
                  ? `Expirou há ${Math.abs(daysRemaining)} dias`
                  : `${daysRemaining} dias restantes`
                }
              </span>
            </div>
          </div>
        </div>

        <EnrollmentActions
          enrollment={enrollment}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          onAddExtension={onAddExtension}
        />
        
        {onToggleSelection && (
          <div className="absolute top-2 left-2">
            <input 
              type="checkbox" 
              checked={isSelected} 
              onChange={() => onToggleSelection(enrollment.id)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
