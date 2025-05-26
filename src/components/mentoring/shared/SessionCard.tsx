
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Play } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SessionCardProps {
  title: string;
  date: string;
  duration: number;
  status: 'agendada' | 'realizada' | 'cancelada' | 'reagendada' | 'ausente_aluno' | 'ausente_mentor';
  accessLink?: string;
  onAccess?: () => void;
}

export const SessionCard: React.FC<SessionCardProps> = ({
  title,
  date,
  duration,
  status,
  accessLink,
  onAccess
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'agendada': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'realizada': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelada': return 'bg-red-100 text-red-800 border-red-200';
      case 'reagendada': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'ausente_aluno': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'ausente_mentor': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'agendada': return 'Agendada';
      case 'realizada': return 'Realizada';
      case 'cancelada': return 'Cancelada';
      case 'reagendada': return 'Reagendada';
      case 'ausente_aluno': return 'Ausente - Aluno';
      case 'ausente_mentor': return 'Ausente - Mentor';
      default: return status;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <h4 className="font-medium text-gray-900">{title}</h4>
            <Badge className={getStatusColor(status)}>
              {getStatusLabel(status)}
            </Badge>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{duration} min</span>
            </div>
          </div>

          {status === 'agendada' && accessLink && onAccess && (
            <Button size="sm" onClick={onAccess} className="w-full">
              <Play className="h-4 w-4 mr-2" />
              Entrar na Sessão
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
