
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2, Play } from 'lucide-react';
import { format, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SessionsListProps {
  sessions: any[];
  onView: (session: any) => void;
  onEdit: (session: any) => void;
  onDelete: (id: string) => void;
  isAdmin: boolean;
}

export const SessionsList: React.FC<SessionsListProps> = ({
  sessions,
  onView,
  onEdit,
  onDelete,
  isAdmin
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'agendada': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'realizada': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelada': return 'bg-red-100 text-red-800 border-red-200';
      case 'reagendada': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'no_show_aluno': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'no_show_mentor': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatSafeDate = (dateString: string | undefined, formatStr: string) => {
    if (!dateString) return 'Não agendada';
    
    try {
      const date = new Date(dateString);
      if (!isValid(date)) return 'Data inválida';
      return format(date, formatStr, { locale: ptBR });
    } catch (error) {
      return 'Data inválida';
    }
  };

  const handleRowClick = (session: any, e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    onView(session);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold">Aluno/Mentor</TableHead>
            <TableHead className="font-semibold">Mentoria</TableHead>
            <TableHead className="font-semibold">Data/Hora</TableHead>
            <TableHead className="font-semibold">Duração</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sessions.map((session) => (
            <TableRow 
              key={session.id} 
              className="hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={(e) => handleRowClick(session, e)}
            >
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium text-sm">
                    {session.studentName || session.groupName || 'Nome não encontrado'}
                  </div>
                  <div className="text-xs text-gray-500">{session.mentorName}</div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium text-sm">{session.mentoringName}</div>
                  <div className="text-xs text-gray-500">
                    Sessão {session.sessionNumber}/{session.totalSessions}
                  </div>
                  <Badge variant="outline" className="text-xs">{session.type}</Badge>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {formatSafeDate(session.scheduledDate, 'dd/MM/yyyy')}
                </div>
                <div className="text-xs text-gray-500">
                  {formatSafeDate(session.scheduledDate, 'HH:mm')}
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm">{session.durationMinutes} min</span>
              </TableCell>
              <TableCell>
                <Badge className={`${getStatusColor(session.status)} text-xs`}>
                  {session.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onView(session);
                    }}
                    className="h-8 w-8 p-0 hover:bg-blue-50"
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                  
                  {session.status === 'agendada' && session.meetingLink && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(session.meetingLink, '_blank');
                      }}
                      className="h-8 w-8 p-0 hover:bg-green-50"
                    >
                      <Play className="h-3 w-3" />
                    </Button>
                  )}
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(session);
                    }}
                    className="h-8 w-8 p-0 hover:bg-yellow-50"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  
                  {isAdmin && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(session.id);
                      }}
                      className="h-8 w-8 p-0 hover:bg-red-50 text-red-600"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
