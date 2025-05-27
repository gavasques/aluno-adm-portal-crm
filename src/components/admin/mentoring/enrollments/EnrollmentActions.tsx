
import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  Calendar
} from 'lucide-react';
import { StudentMentoringEnrollment } from '@/types/mentoring.types';

interface EnrollmentActionsProps {
  enrollment: StudentMentoringEnrollment;
  onView: (enrollment: StudentMentoringEnrollment) => void;
  onEdit: (enrollment: StudentMentoringEnrollment) => void;
  onDelete: (id: string) => void;
  onAddExtension: (enrollment: StudentMentoringEnrollment) => void;
  compact?: boolean;
}

export const EnrollmentActions = memo<EnrollmentActionsProps>(({
  enrollment,
  onView,
  onEdit,
  onDelete,
  onAddExtension,
  compact = false
}) => {
  if (compact) {
    return (
      <div className="flex gap-1">
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
    );
  }

  return (
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
          <Edit className="h-4 w-4" />
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
          <Plus className="h-3 w-3 mr-1" />
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
  );
});

EnrollmentActions.displayName = 'EnrollmentActions';
