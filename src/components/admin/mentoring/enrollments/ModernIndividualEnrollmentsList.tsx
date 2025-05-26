
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  Calendar, 
  Clock,
  User,
  GraduationCap,
  TrendingUp
} from 'lucide-react';
import { StudentMentoringEnrollment } from '@/types/mentoring.types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'ativa':
        return { 
          color: 'bg-green-100 text-green-800 border-green-200', 
          icon: <div className="w-2 h-2 bg-green-500 rounded-full"></div>,
          label: 'Ativa' 
        };
      case 'concluida':
        return { 
          color: 'bg-blue-100 text-blue-800 border-blue-200', 
          icon: <div className="w-2 h-2 bg-blue-500 rounded-full"></div>,
          label: 'Concluída' 
        };
      case 'pausada':
        return { 
          color: 'bg-orange-100 text-orange-800 border-orange-200', 
          icon: <div className="w-2 h-2 bg-orange-500 rounded-full"></div>,
          label: 'Pausada' 
        };
      case 'cancelada':
        return { 
          color: 'bg-red-100 text-red-800 border-red-200', 
          icon: <div className="w-2 h-2 bg-red-500 rounded-full"></div>,
          label: 'Cancelada' 
        };
      default:
        return { 
          color: 'bg-gray-100 text-gray-800 border-gray-200', 
          icon: <div className="w-2 h-2 bg-gray-500 rounded-full"></div>,
          label: status 
        };
    }
  };

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
          const statusConfig = getStatusConfig(enrollment.status);
          const completedSessions = enrollment.sessionsUsed || 0;
          const totalSessions = enrollment.totalSessions || 0;
          const progressPercentage = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;
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
                <Badge className={`${statusConfig.color} text-xs flex items-center gap-1`}>
                  {statusConfig.icon}
                  {statusConfig.label}
                </Badge>
              </div>

              {/* Progresso */}
              <div className="col-span-2 flex items-center gap-2">
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>{completedSessions}/{totalSessions}</span>
                    <span>{Math.round(progressPercentage)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        progressPercentage >= 75 ? 'bg-green-500' :
                        progressPercentage >= 50 ? 'bg-blue-500' :
                        progressPercentage >= 25 ? 'bg-yellow-500' :
                        'bg-gray-400'
                      }`}
                      style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                    />
                  </div>
                </div>
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
              <div className="col-span-1 flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-7 w-7 p-0 hover:bg-blue-100 hover:text-blue-700"
                  onClick={() => onView(enrollment)}
                >
                  <Eye className="h-3 w-3" />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-7 w-7 p-0 hover:bg-gray-100"
                  onClick={() => onEdit(enrollment)}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-7 w-7 p-0 hover:bg-green-100 hover:text-green-700"
                  onClick={() => onAddExtension(enrollment)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-7 w-7 p-0 hover:bg-red-100 hover:text-red-700"
                  onClick={() => onDelete(enrollment.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
