import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Users } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useActiveStudentsForMentoring } from '@/hooks/admin/useActiveStudentsForMentoring';

interface EnrollmentCardProps {
  enrollment: any;
}

const ModernIndividualEnrollmentCard: React.FC<EnrollmentCardProps> = ({ enrollment }) => {
  const { students, loading } = useActiveStudentsForMentoring();
  const student = students.find(s => s.id === enrollment.student_id);

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (!student) {
    return <p>Aluno não encontrado.</p>;
  }

  return (
    <Card className="bg-white shadow-md rounded-lg overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {enrollment.mentoring_title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${student.name}`} />
            <AvatarFallback>{student.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold">{student.name}</p>
            <p className="text-xs text-muted-foreground">{student.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4 mr-2" />
            Início: {format(new Date(enrollment.start_date), 'PPP', { locale: ptBR })}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="h-4 w-4 mr-2" />
            Vagas: {enrollment.available_slots}
          </div>
        </div>
        <div className="mt-4">
          <Badge variant="secondary">
            {enrollment.status}
          </Badge>
        </div>
        <div className="mt-4 flex justify-end">
          <Link to={`/admin/mentorias/inscricoes?mentoringId=${enrollment.mentoring_id}`}>
            <Button size="sm">
              Ver Inscrições
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModernIndividualEnrollmentCard;
