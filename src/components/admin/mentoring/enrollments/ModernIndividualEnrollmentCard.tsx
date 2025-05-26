
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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

interface ModernIndividualEnrollmentCardProps {
  enrollment: StudentMentoringEnrollment;
  onView: (enrollment: StudentMentoringEnrollment) => void;
  onEdit: (enrollment: StudentMentoringEnrollment) => void;
  onDelete: (id: string) => void;
  onAddExtension: (enrollment: StudentMentoringEnrollment) => void;
  onToggleSelection: (id: string) => void;
  isSelected: boolean;
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

  const statusConfig = getStatusConfig(enrollment.status);
  
  // Calcular progresso usando as propriedades corretas
  const completedSessions = enrollment.sessionsUsed || 0;
  const totalSessions = enrollment.totalSessions || 0;
  const progressPercentage = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
    } catch {
      return 'Data inválida';
    }
  };

  return (
    <Card 
      className={`group hover:shadow-lg transition-all duration-300 border-l-4 ${
        enrollment.status === 'ativa' ? 'border-l-green-500' :
        enrollment.status === 'concluida' ? 'border-l-blue-500' :
        enrollment.status === 'pausada' ? 'border-l-orange-500' :
        'border-l-gray-400'
      } hover:border-l-blue-600 cursor-pointer ${
        isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
      }`}
      onClick={() => onView(enrollment)}
    >
      <CardContent className="p-4 space-y-3">
        {/* Header do Card */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="p-1.5 bg-blue-100 rounded-lg shrink-0">
              <User className="h-3.5 w-3.5 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold text-sm text-gray-900 truncate">
                {enrollment.studentId}
              </h4>
              <p className="text-xs text-gray-500 truncate">
                {enrollment.responsibleMentor}
              </p>
            </div>
          </div>
          
          <Badge className={`${statusConfig.color} text-xs shrink-0 ml-2 flex items-center gap-1`}>
            {statusConfig.icon}
            {statusConfig.label}
          </Badge>
        </div>

        {/* Mentoria */}
        <div className="flex items-center gap-2">
          <GraduationCap className="h-3.5 w-3.5 text-gray-400 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-gray-900 truncate">
              {enrollment.mentoring.name}
            </p>
            <Badge variant="outline" className="text-xs mt-1 border-blue-200 text-blue-700">
              {enrollment.mentoring.type}
            </Badge>
          </div>
        </div>

        {/* Progresso */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-3.5 w-3.5 text-gray-400" />
            <span className="text-xs font-medium text-gray-700">Progresso</span>
            <span className="text-xs text-gray-500 ml-auto">
              {completedSessions}/{totalSessions} sessões
            </span>
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
          <p className="text-xs text-gray-500 text-center">
            {Math.round(progressPercentage)}% concluído
          </p>
        </div>

        {/* Datas */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(enrollment.startDate)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{formatDate(enrollment.endDate)}</span>
          </div>
        </div>

        {/* Ações */}
        <div className="flex gap-1 pt-2 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button 
            variant="ghost" 
            size="sm"
            className="h-7 w-7 p-0 hover:bg-blue-100 hover:text-blue-700"
            onClick={(e) => {
              e.stopPropagation();
              onView(enrollment);
            }}
          >
            <Eye className="h-3 w-3" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            className="h-7 w-7 p-0 hover:bg-gray-100"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(enrollment);
            }}
          >
            <Edit className="h-3 w-3" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            className="h-7 w-7 p-0 hover:bg-green-100 hover:text-green-700"
            onClick={(e) => {
              e.stopPropagation();
              onAddExtension(enrollment);
            }}
          >
            <Plus className="h-3 w-3" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            className="h-7 w-7 p-0 hover:bg-red-100 hover:text-red-700 ml-auto"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(enrollment.id);
            }}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
