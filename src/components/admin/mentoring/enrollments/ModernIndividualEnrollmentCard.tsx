
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDays, Users, MoreHorizontal, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { useActiveStudentsForMentoring } from '@/hooks/admin/useActiveStudentsForMentoring';
import { StudentMentoringEnrollment } from '@/types/mentoring.types';

interface ModernIndividualEnrollmentCardProps {
  enrollment: StudentMentoringEnrollment;
  selected?: boolean;
  onToggleSelection?: () => void;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onAddExtension?: () => void;
}

const ModernIndividualEnrollmentCard: React.FC<ModernIndividualEnrollmentCardProps> = ({ 
  enrollment,
  selected = false,
  onToggleSelection = () => {},
  onView = () => {},
  onEdit = () => {},
  onDelete = () => {},
  onAddExtension = () => {}
}) => {
  const { students, loading } = useActiveStudentsForMentoring();
  const student = students.find(s => s.id === enrollment.studentId);

  if (loading) {
    return (
      <Card className="bg-white shadow-md rounded-lg overflow-hidden animate-pulse">
        <CardContent className="p-4">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 bg-gray-200 rounded mb-4"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  if (!student) {
    return (
      <Card className="bg-white shadow-md rounded-lg overflow-hidden">
        <CardContent className="p-4">
          <p className="text-sm text-gray-500">Aluno não encontrado.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-white shadow-md rounded-lg overflow-hidden transition-all hover:shadow-lg ${selected ? 'ring-2 ring-blue-500' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={selected}
            onChange={onToggleSelection}
            className="rounded"
          />
          <CardTitle className="text-sm font-medium">
            {enrollment.mentoring.name}
          </CardTitle>
        </div>
        {selected && <CheckCircle className="h-4 w-4 text-blue-500" />}
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 mb-4">
          <Avatar>
            <AvatarImage src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${student.name}`} />
            <AvatarFallback>{student.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold">{student.name}</p>
            <p className="text-xs text-muted-foreground">{student.email}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-2 mb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4 mr-2" />
            Início: {format(new Date(enrollment.startDate), 'dd/MM/yyyy', { locale: ptBR })}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="h-4 w-4 mr-2" />
            Sessões: {enrollment.sessionsUsed}/{enrollment.totalSessions}
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <Badge variant={enrollment.status === 'ativa' ? 'default' : 'secondary'}>
            {enrollment.status}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {enrollment.responsibleMentor}
          </span>
        </div>
        
        <div className="flex justify-between space-x-2">
          <Button size="sm" variant="outline" onClick={onView}>
            Ver
          </Button>
          <Button size="sm" variant="outline" onClick={onEdit}>
            Editar
          </Button>
          <Button size="sm" variant="outline" onClick={onAddExtension}>
            Extensão
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModernIndividualEnrollmentCard;
