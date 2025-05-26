
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CalendarRange, 
  GraduationCap, 
  User, 
  Clock,
  Pencil, 
  Trash2, 
  Eye, 
  PlusCircle,
  Calendar
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { StudentMentoringEnrollment } from '@/types/mentoring.types';
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
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativa': return 'bg-green-100 text-green-800';
      case 'concluida': return 'bg-blue-100 text-blue-800';
      case 'pausada': return 'bg-yellow-100 text-yellow-800';
      case 'cancelada': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ativa': return 'Ativa';
      case 'concluida': return 'Concluída';
      case 'pausada': return 'Pausada';
      case 'cancelada': return 'Cancelada';
      default: return status;
    }
  };

  // Calcular dias restantes
  const daysRemaining = differenceInDays(new Date(enrollment.endDate), new Date());

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
              {enrollment.studentId}
            </h3>
          </div>
          
          <Badge className={getStatusColor(enrollment.status)}>
            {getStatusLabel(enrollment.status)}
          </Badge>
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
            <div className="text-xs">
              <span className="text-gray-600">
                {enrollment.sessionsUsed} de {enrollment.totalSessions} sessões realizadas 
                {enrollment.hasExtension && (
                  <span className="ml-1 text-blue-600 font-medium">(com extensão)</span>
                )}
              </span>
            </div>
          </div>

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

        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={() => onView(enrollment)}
            >
              <Eye className="h-4 w-4" />
              <span className="sr-only">Ver</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={() => onEdit(enrollment)}
            >
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Editar</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => onDelete(enrollment.id)}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Excluir</span>
            </Button>
          </div>
          
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs px-2 text-blue-600 border-blue-200 hover:border-blue-300 hover:text-blue-700"
              onClick={() => onAddExtension(enrollment)}
            >
              <PlusCircle className="h-3 w-3 mr-1" />
              Extensão
            </Button>
            <Button
              size="sm"
              className="h-8 text-xs px-2 bg-amber-600 hover:bg-amber-700"
              onClick={() => onView(enrollment)}
            >
              <Calendar className="h-3 w-3 mr-1" />
              Sessões
            </Button>
          </div>
        </div>
        
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
