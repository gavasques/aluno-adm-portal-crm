
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  Users, 
  Video, 
  Edit, 
  Trash2, 
  Play,
  Eye,
  GraduationCap
} from 'lucide-react';
import { format, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SessionsListProps {
  sessions: any[];
  onView: (session: any) => void;
  onEdit: (session: any) => void;
  onDelete: (id: string) => void;
  onSchedule?: (session: any) => void;
  isAdmin?: boolean;
}

export const SessionsList = ({ 
  sessions, 
  onView, 
  onEdit, 
  onDelete, 
  onSchedule,
  isAdmin = false 
}: SessionsListProps) => {
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aguardando_agendamento': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'agendada': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'concluida': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelada': return 'bg-red-100 text-red-800 border-red-200';
      case 'reagendada': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'no_show_aluno': return 'bg-red-100 text-red-800 border-red-200';
      case 'no_show_mentor': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'aguardando_agendamento': return 'Aguardando Agendamento';
      case 'agendada': return 'Agendada';
      case 'concluida': return 'Concluída';
      case 'cancelada': return 'Cancelada';
      case 'reagendada': return 'Reagendada';
      case 'no_show_aluno': return 'No-show Aluno';
      case 'no_show_mentor': return 'No-show Mentor';
      default: return status;
    }
  };

  const formatSafeDate = (dateString: string | undefined, formatStr: string) => {
    if (!dateString) return 'Data não definida';
    
    try {
      const date = new Date(dateString);
      if (!isValid(date)) return 'Data inválida';
      return format(date, formatStr, { locale: ptBR });
    } catch (error) {
      return 'Data inválida';
    }
  };

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sessão
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aluno/Mentoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data/Hora
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sessions.map((session) => (
                <tr key={session.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg mr-3">
                        <Video className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {session.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          Sessão {session.sessionNumber}/{session.totalSessions}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {session.studentName}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <GraduationCap className="h-3 w-3 mr-1" />
                        {session.mentoringName}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        {session.mentorName}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    {session.scheduledDate ? (
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatSafeDate(session.scheduledDate, 'dd/MM/yyyy')}
                        </div>
                        <div className="flex items-center text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatSafeDate(session.scheduledDate, 'HH:mm')} ({session.durationMinutes}min)
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">
                        Não agendada
                      </div>
                    )}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={getStatusColor(session.status)}>
                      {getStatusLabel(session.status)}
                    </Badge>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center gap-1">
                      {session.status === 'agendada' && session.meetingLink && (
                        <Button 
                          size="sm" 
                          className="h-8"
                          onClick={() => window.open(session.meetingLink, '_blank')}
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Entrar
                        </Button>
                      )}
                      
                      {session.status === 'aguardando_agendamento' && onSchedule && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="h-8"
                          onClick={() => onSchedule(session)}
                        >
                          <Calendar className="h-3 w-3 mr-1" />
                          Agendar
                        </Button>
                      )}
                      
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => onView(session)}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => onEdit(session)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      
                      {isAdmin && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => onDelete(session.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
