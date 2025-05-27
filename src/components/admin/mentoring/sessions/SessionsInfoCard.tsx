
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';

interface SessionsInfoCardProps {
  totalSessions: number;
  totalSessionsCreated: number;
  canCreateMoreSessions: boolean;
  nextSessionNumber: number;
  onCreateSession: () => void;
}

export const SessionsInfoCard: React.FC<SessionsInfoCardProps> = ({
  totalSessions,
  totalSessionsCreated,
  canCreateMoreSessions,
  nextSessionNumber,
  onCreateSession
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between text-sm">
        <span className="text-blue-800 font-medium">
          Sessões criadas: {totalSessionsCreated} de {totalSessions}
        </span>
        {!canCreateMoreSessions ? (
          <Badge variant="outline" className="text-blue-700 border-blue-300 bg-blue-50">
            Limite atingido
          </Badge>
        ) : (
          <Button
            size="sm"
            onClick={onCreateSession}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-3 py-1 text-xs font-medium shadow-sm hover:shadow-md transition-all"
          >
            <Plus className="h-3 w-3 mr-1" />
            Nova Sessão
          </Button>
        )}
      </div>
      {canCreateMoreSessions && (
        <p className="text-xs text-blue-600 mt-2 font-medium">
          Próxima sessão será: Sessão {nextSessionNumber}
        </p>
      )}
    </div>
  );
};
