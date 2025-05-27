
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Video, CheckCircle, XCircle, AlertCircle, Lock, Play, Trash2 } from 'lucide-react';
import { MentoringSession } from '@/types/mentoring.types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SessionCardProps {
  session: MentoringSession;
  canSchedule: boolean;
  isScheduled: boolean;
  hasUnscheduledPrevious: boolean;
  onSchedule: (session: MentoringSession) => void;
  onComplete: (session: MentoringSession) => void;
  onDelete?: (session: MentoringSession) => void;
}

export const SessionCard: React.FC<SessionCardProps> = ({
  session,
  canSchedule,
  isScheduled,
  hasUnscheduledPrevious,
  onSchedule,
  onComplete,
  onDelete
}) => {
  const getStatusBadge = () => {
    if (isScheduled) {
      return (
        <Badge variant="outline" className="text-xs px-2 py-0 text-green-700 border-green-300 bg-green-100">
          Agendada
        </Badge>
      );
    }
    
    if (canSchedule) {
      return (
        <Badge variant="outline" className="text-xs px-2 py-0 text-amber-700 border-amber-300 bg-amber-50">
          Aguardando
        </Badge>
      );
    }
    
    return (
      <Badge variant="outline" className="text-xs px-2 py-0 text-gray-500 border-gray-300 bg-gray-50">
        Bloqueada
      </Badge>
    );
  };

  const getIcon = () => {
    if (isScheduled) {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    }
    
    if (canSchedule) {
      return <Video className="h-4 w-4 text-amber-600" />;
    }
    
    return <Lock className="h-4 w-4 text-gray-500" />;
  };

  const getCardClasses = () => {
    const baseClasses = "group bg-white border rounded-xl p-4 hover:shadow-md transition-all duration-200";
    
    if (isScheduled) {
      return `${baseClasses} border-green-200 hover:border-green-300 bg-green-50`;
    }
    
    if (canSchedule) {
      return `${baseClasses} border-amber-200 hover:border-amber-300`;
    }
    
    return `${baseClasses} border-gray-200 bg-gray-50`;
  };

  const getIconBgClasses = () => {
    if (isScheduled) {
      return 'bg-green-100 group-hover:bg-green-200';
    }
    
    if (canSchedule) {
      return 'bg-amber-100 group-hover:bg-amber-200';
    }
    
    return 'bg-gray-100';
  };

  return (
    <div className={getCardClasses()}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg transition-colors ${getIconBgClasses()}`}>
            {getIcon()}
          </div>
          <div>
            <h4 className={`font-medium text-sm ${
              isScheduled ? 'text-green-900' :
              canSchedule ? 'text-gray-900' : 'text-gray-500'
            }`}>
              {session.title}
            </h4>
            <div className="flex items-center gap-3 text-xs mt-1">
              <span className={`flex items-center gap-1 ${
                isScheduled ? 'text-green-600' :
                canSchedule ? 'text-gray-500' : 'text-gray-400'
              }`}>
                <Clock className="h-3 w-3" />
                {session.durationMinutes} min
              </span>
              
              {isScheduled && session.scheduledDate && (
                <span className="flex items-center gap-1 text-green-600 font-medium">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(session.scheduledDate), "dd/MM 'às' HH:mm", { locale: ptBR })}
                </span>
              )}
              
              {getStatusBadge()}
              
              {hasUnscheduledPrevious && !isScheduled && (
                <span className="text-xs text-red-600 font-medium">
                  Aguarde sessão anterior
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isScheduled && (
            <Button
              size="sm"
              onClick={() => onComplete(session)}
              className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-3 py-1.5 text-xs font-medium shadow-sm hover:shadow-md"
            >
              <Play className="h-3 w-3 mr-1" />
              Concluir
            </Button>
          )}
          
          {canSchedule && !isScheduled && (
            <Button
              size="sm"
              onClick={() => onSchedule(session)}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-3 py-1.5 text-xs font-medium shadow-sm hover:shadow-md transition-all"
            >
              <Calendar className="h-3 w-3 mr-1" />
              Agendar
            </Button>
          )}
          
          {!canSchedule && !isScheduled && (
            <Button
              size="sm"
              disabled
              className="bg-gray-300 text-gray-500 cursor-not-allowed rounded-lg px-3 py-1.5 text-xs font-medium"
            >
              <Lock className="h-3 w-3 mr-1" />
              Bloqueada
            </Button>
          )}
          
          {onDelete && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDelete(session)}
              className="border-red-200 text-red-600 hover:bg-red-50 rounded-lg px-2 py-1.5"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
