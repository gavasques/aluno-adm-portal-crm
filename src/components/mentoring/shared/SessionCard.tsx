
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Play, ExternalLink } from 'lucide-react';

interface SessionCardProps {
  title: string;
  date: string;
  duration: number;
  status: 'agendada' | 'realizada' | 'cancelada' | 'reagendada';
  accessLink?: string;
  recordingLink?: string;
  onAccess?: () => void;
  actions?: React.ReactNode;
}

export const SessionCard: React.FC<SessionCardProps> = ({
  title,
  date,
  duration,
  status,
  accessLink,
  recordingLink,
  onAccess,
  actions
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'agendada': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'realizada': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelada': return 'bg-red-100 text-red-800 border-red-200';
      case 'reagendada': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <h4 className="font-medium">{title}</h4>
            <Badge className={getStatusColor(status)}>{status}</Badge>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(date).toLocaleDateString('pt-BR')}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{duration} min</span>
            </div>
          </div>

          <div className="flex gap-2">
            {status === 'agendada' && accessLink && (
              <Button size="sm" onClick={onAccess} className="flex-1">
                <Play className="h-4 w-4 mr-2" />
                Entrar
              </Button>
            )}
            
            {status === 'realizada' && recordingLink && (
              <Button variant="outline" size="sm" onClick={() => window.open(recordingLink, '_blank')}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Gravação
              </Button>
            )}

            {actions}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
