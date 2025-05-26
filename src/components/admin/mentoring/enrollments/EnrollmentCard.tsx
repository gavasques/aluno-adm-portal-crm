
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Eye, 
  Edit, 
  Trash2, 
  Timer, 
  GraduationCap,
  User
} from 'lucide-react';
import { StudentMentoringEnrollment } from '@/types/mentoring.types';

interface EnrollmentCardProps {
  enrollment: StudentMentoringEnrollment;
  onView: (enrollment: StudentMentoringEnrollment) => void;
  onEdit: (enrollment: StudentMentoringEnrollment) => void;
  onDelete: (id: string) => void;
  onAddExtension: (enrollment: StudentMentoringEnrollment) => void;
  onToggleSelection: (id: string) => void;
  isSelected: boolean;
}

export const EnrollmentCard: React.FC<EnrollmentCardProps> = ({
  enrollment,
  onView,
  onEdit,
  onDelete,
  onAddExtension,
  onToggleSelection,
  isSelected
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativa': return 'bg-green-100 text-green-800 border-green-200';
      case 'concluida': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pausada': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelada': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const progressPercentage = (enrollment.sessionsUsed / enrollment.totalSessions) * 100;

  const handleCardClick = (e: React.MouseEvent) => {
    // Não abrir se clicou no checkbox ou nos botões de ação
    if (
      (e.target as HTMLElement).closest('input[type="checkbox"]') ||
      (e.target as HTMLElement).closest('button')
    ) {
      return;
    }
    onView(enrollment);
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Card 
      className={`hover:shadow-lg transition-all duration-300 cursor-pointer group ${
        isSelected ? 'ring-2 ring-blue-500 shadow-md' : ''
      }`}
      onClick={handleCardClick}
    >
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Header com Checkbox e Status */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div onClick={handleCheckboxClick}>
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggleSelection(enrollment.id)}
                  className="rounded border-gray-300"
                />
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" />
                <div className="flex flex-col">
                  <span className="font-medium text-sm">Bianca Mentora</span>
                  <span className="text-xs text-gray-500">{enrollment.responsibleMentor}</span>
                </div>
              </div>
            </div>
            <Badge className={`${getStatusColor(enrollment.status)} text-xs`}>
              {enrollment.status}
            </Badge>
          </div>

          {/* Mentoria Info */}
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <GraduationCap className="h-4 w-4 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <div className="font-medium text-sm">{enrollment.mentoring.name}</div>
                <Badge variant="outline" className="text-xs mt-1">{enrollment.mentoring.type}</Badge>
                {enrollment.hasExtension && (
                  <Badge className="bg-orange-100 text-orange-800 border-orange-200 text-xs mt-1 ml-2">
                    <Timer className="h-3 w-3 mr-1" />
                    Extensão
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Progresso */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Progresso</span>
              <span className="font-medium">{enrollment.sessionsUsed}/{enrollment.totalSessions} sessões</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 text-center">
              {Math.round(progressPercentage)}% concluído
            </div>
          </div>

          {/* Ações */}
          <div className="flex justify-between items-center pt-2 border-t border-gray-100">
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={(e) => {
                  e.stopPropagation();
                  onView(enrollment);
                }}
                className="h-8 w-8 p-0 hover:bg-blue-50"
              >
                <Eye className="h-3 w-3" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(enrollment);
                }}
                className="h-8 w-8 p-0 hover:bg-green-50"
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddExtension(enrollment);
                }}
                className="h-8 w-8 p-0 hover:bg-orange-50"
                title="Adicionar Extensão"
              >
                <Timer className="h-3 w-3" />
              </Button>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(enrollment.id);
              }}
              className="h-8 w-8 p-0 hover:bg-red-50 text-red-600"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
