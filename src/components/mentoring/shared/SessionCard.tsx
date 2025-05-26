
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Play } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SessionCardProps {
  title: string;
  date: string;
  duration: number;
  status: 'cancelada' | 'agendada' | 'realizada' | 'reagendada' | 'ausente_aluno' | 'ausente_mentor';
  meetingLink?: string;
  onAccess?: () => void;
}

export const SessionCard: React.FC<SessionCardProps> = ({
  title,
  date,
  duration,
  status,
  meetingLink,
  onAccess
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'agendada': return 'bg-blue-100 text-blue-800';
      case 'realizada': return 'bg-green-100 text-green-800';
      case 'cancelada': return 'bg-red-100 text-red-800';
      case 'reagendada': return 'bg-yellow-100 text-yellow-800';
      case 'ausente_aluno': return 'bg-orange-100 text-orange-800';
      case 'ausente_mentor': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <h4 className="font-medium text-gray-900 line-clamp-2">{title}</h4>
          <Badge className={getStatusColor(status)}>
            {status}
          </Badge>
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(date), "dd/MM 'às' HH:mm", { locale: ptBR })}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{duration} minutos</span>
          </div>
        </div>

        {status === 'agendada' && meetingLink && (
          <Button 
            size="sm" 
            className="w-full"
            onClick={onAccess}
          >
            <Play className="h-4 w-4 mr-2" />
            Entrar na Sessão
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
