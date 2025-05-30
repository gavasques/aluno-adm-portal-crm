
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Calendar, 
  Edit, 
  Move, 
  MessageSquare, 
  Clock,
  UserPlus,
  FileText
} from 'lucide-react';
import { useCRMLeadHistory } from '@/hooks/crm/useCRMLeadHistory';

interface LeadHistoryTabProps {
  leadId: string;
}

const LeadHistoryTab = ({ leadId }: LeadHistoryTabProps) => {
  const { history, loading } = useCRMLeadHistory(leadId);

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'created':
        return <User className="h-4 w-4" />;
      case 'updated':
        return <Edit className="h-4 w-4" />;
      case 'moved':
        return <Move className="h-4 w-4" />;
      case 'assigned':
        return <UserPlus className="h-4 w-4" />;
      case 'commented':
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getActionColor = (actionType: string) => {
    switch (actionType) {
      case 'created':
        return 'bg-green-500';
      case 'updated':
        return 'bg-blue-500';
      case 'moved':
        return 'bg-purple-500';
      case 'assigned':
        return 'bg-orange-500';
      case 'commented':
        return 'bg-gray-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getActionLabel = (actionType: string) => {
    switch (actionType) {
      case 'created':
        return 'Criado';
      case 'updated':
        return 'Atualizado';
      case 'moved':
        return 'Movido';
      case 'assigned':
        return 'Atribuído';
      case 'commented':
        return 'Comentário';
      default:
        return 'Ação';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4 space-y-6">
      <h3 className="text-lg font-semibold">Histórico de Atividades ({history.length})</h3>

      {history.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Clock className="h-12 w-12 text-gray-400 mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">Nenhuma atividade</h4>
            <p className="text-gray-500 text-center">
              O histórico de atividades aparecerá aqui conforme ações forem realizadas
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

          <div className="space-y-6">
            {history.map((entry, index) => (
              <div key={entry.id} className="relative flex items-start space-x-4">
                {/* Timeline dot */}
                <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full ${getActionColor(entry.action_type)} text-white flex-shrink-0`}>
                  {getActionIcon(entry.action_type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">
                            {getActionLabel(entry.action_type)}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {formatDate(entry.created_at)}
                          </span>
                        </div>
                        {entry.user && (
                          <span className="text-sm text-gray-600">
                            {entry.user.name}
                          </span>
                        )}
                      </div>

                      <div className="space-y-2">
                        {entry.description && (
                          <p className="text-sm text-gray-900">
                            {entry.description}
                          </p>
                        )}

                        {entry.field_name && (entry.old_value || entry.new_value) && (
                          <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                            <span className="font-medium">Campo:</span> {entry.field_name}
                            {entry.old_value && (
                              <div>
                                <span className="font-medium">De:</span> {entry.old_value}
                              </div>
                            )}
                            {entry.new_value && (
                              <div>
                                <span className="font-medium">Para:</span> {entry.new_value}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadHistoryTab;
