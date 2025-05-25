
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronRight, Calendar, Users, Clock } from 'lucide-react';

interface MentoringCardProps {
  title: string;
  status: string;
  mentor?: string;
  progress?: {
    percentage: number;
    sessionsUsed: number;
    totalSessions: number;
    daysRemaining: number;
  };
  onClick?: () => void;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

export const MentoringCard: React.FC<MentoringCardProps> = ({
  title,
  status,
  mentor,
  progress,
  onClick,
  actions,
  children
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativa': return 'bg-green-100 text-green-800 border-green-200';
      case 'concluida': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pausada': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelada': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">{title}</h3>
              <Badge className={getStatusColor(status)}>{status}</Badge>
            </div>
            {onClick && <ChevronRight className="h-5 w-5 text-gray-400" />}
          </div>

          {mentor && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="h-4 w-4" />
              <span>{mentor}</span>
            </div>
          )}

          {progress && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progresso</span>
                <span>{Math.round(progress.percentage)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all" 
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{progress.sessionsUsed}/{progress.totalSessions} sessões</span>
                <span>{progress.daysRemaining} dias restantes</span>
              </div>
            </div>
          )}

          {children}

          {actions && (
            <div className="flex gap-2 pt-2">
              {actions}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
