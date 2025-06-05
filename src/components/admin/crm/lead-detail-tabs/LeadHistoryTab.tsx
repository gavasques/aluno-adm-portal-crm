
import React from 'react';
import { Clock, User, Edit, ArrowRight, MessageSquare, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useCRMLeadHistory } from '@/hooks/crm/useCRMLeadHistory';

interface LeadHistoryTabProps {
  leadId: string;
}

const LeadHistoryTab = ({ leadId }: LeadHistoryTabProps) => {
  const { history, loading } = useCRMLeadHistory(leadId);

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'moved':
      case 'status_changed':
      case 'pipeline_changed':
        return <ArrowRight className="h-4 w-4 text-blue-500" />;
      case 'comment':
        return <MessageSquare className="h-4 w-4 text-green-500" />;
      case 'contact_scheduled':
      case 'contact_completed':
        return <Calendar className="h-4 w-4 text-purple-500" />;
      case 'field_updated':
      case 'assigned':
        return <Edit className="h-4 w-4 text-orange-500" />;
      case 'created':
        return <User className="h-4 w-4 text-gray-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'moved':
      case 'status_changed':
      case 'pipeline_changed':
        return 'border-blue-200 bg-blue-50';
      case 'comment':
        return 'border-green-200 bg-green-50';
      case 'contact_scheduled':
      case 'contact_completed':
        return 'border-purple-200 bg-purple-50';
      case 'field_updated':
      case 'assigned':
        return 'border-orange-200 bg-orange-50';
      case 'created':
        return 'border-gray-200 bg-gray-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getActionLabel = (actionType: string) => {
    switch (actionType) {
      case 'created':
        return 'Lead criado';
      case 'moved':
        return 'Movido no pipeline';
      case 'status_changed':
        return 'Status alterado';
      case 'pipeline_changed':
        return 'Pipeline alterado';
      case 'assigned':
        return 'Responsável alterado';
      case 'field_updated':
        return 'Campo atualizado';
      case 'contact_scheduled':
        return 'Contato agendado';
      case 'contact_completed':
        return 'Contato realizado';
      case 'notes_updated':
        return 'Observações atualizadas';
      default:
        return actionType;
    }
  };

  if (loading) {
    return (
      <div className="p-6 h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Clock className="h-5 w-5 text-gray-600" />
          Histórico de Atividades ({history.length})
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Todas as ações realizadas neste lead
        </p>
      </div>

      <div className="relative">
        {/* Linha do tempo */}
        {history.length > 0 && (
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        )}

        <div className="space-y-6">
          {history.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Ícone na linha do tempo */}
              <div className={`absolute left-4 w-4 h-4 rounded-full border-2 border-white shadow-sm flex items-center justify-center ${getActionColor(item.action_type)}`}>
                {getActionIcon(item.action_type)}
              </div>

              {/* Conteúdo */}
              <div className="ml-12 bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">
                    {getActionLabel(item.action_type)}
                  </h4>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(item.created_at), { 
                      addSuffix: true, 
                      locale: ptBR 
                    })}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                
                {/* Mostrar mudanças de valores quando disponível */}
                {item.old_value && item.new_value && (
                  <div className="text-xs text-gray-500 bg-gray-50 rounded p-2">
                    <span className="line-through text-red-600">{item.old_value}</span>
                    <span className="mx-2">→</span>
                    <span className="text-green-600">{item.new_value}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                  <User className="h-3 w-3" />
                  <span>{item.user?.name || 'Sistema'}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {history.length === 0 && (
        <div className="text-center py-12">
          <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Nenhuma atividade registrada para este lead</p>
        </div>
      )}
    </div>
  );
};

export default LeadHistoryTab;
