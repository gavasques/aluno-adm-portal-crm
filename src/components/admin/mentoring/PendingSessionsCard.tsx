import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { CalendarClock, User } from 'lucide-react';
import { useActiveStudentsForMentoring } from '@/hooks/admin/useActiveStudentsForMentoring';

interface PendingSessionsCardProps {
  mentoringSessions: any[];
}

const PendingSessionsCard: React.FC<PendingSessionsCardProps> = ({ mentoringSessions }) => {
  const { students, loading } = useActiveStudentsForMentoring();

  if (loading) {
    return <p>Carregando alunos...</p>;
  }

  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    return student ? student.name : 'Aluno não encontrado';
  };

  const pendingSessions = mentoringSessions.filter(session => session.status === 'pending');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarClock className="h-4 w-4" />
          Sessões Pendentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        {pendingSessions.length > 0 ? (
          <ul className="list-none space-y-2">
            {pendingSessions.map(session => (
              <li key={session.id} className="border rounded-md p-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="text-sm font-medium hover:underline cursor-pointer">
                        {getStudentName(session.student_id)}
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{session.student_email}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="text-xs text-muted-foreground">
                  {session.date} - {session.time}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            Nenhuma sessão pendente no momento.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default PendingSessionsCard;
