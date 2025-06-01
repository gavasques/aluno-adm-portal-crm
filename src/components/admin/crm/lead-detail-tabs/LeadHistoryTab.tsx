
import React, { useState } from 'react';
import { Clock, User, Edit, ArrowRight, MessageSquare, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface LeadHistoryTabProps {
  leadId: string;
}

const LeadHistoryTab = ({ leadId }: LeadHistoryTabProps) => {
  const [history] = useState([
    {
      id: '1',
      action: 'status_change',
      description: 'Movido para "Qualificado"',
      user: 'João Silva',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
      details: 'Lead movido de "Novo" para "Qualificado"'
    },
    {
      id: '2',
      action: 'comment',
      description: 'Comentário adicionado',
      user: 'Maria Santos',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 horas atrás
      details: 'Cliente demonstrou interesse em marca própria'
    },
    {
      id: '3',
      action: 'contact_scheduled',
      description: 'Contato agendado',
      user: 'João Silva',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 dia atrás
      details: 'Reunião agendada para amanhã às 14:00'
    },
    {
      id: '4',
      action: 'field_update',
      description: 'Informações atualizadas',
      user: 'Maria Santos',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 dias atrás
      details: 'Telefone e endereço atualizados'
    },
    {
      id: '5',
      action: 'created',
      description: 'Lead criado',
      user: 'Sistema',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 dias atrás
      details: 'Lead adicionado ao sistema via formulário web'
    }
  ]);

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'status_change':
        return <ArrowRight className="h-4 w-4 text-blue-500" />;
      case 'comment':
        return <MessageSquare className="h-4 w-4 text-green-500" />;
      case 'contact_scheduled':
        return <Calendar className="h-4 w-4 text-purple-500" />;
      case 'field_update':
        return <Edit className="h-4 w-4 text-orange-500" />;
      case 'created':
        return <User className="h-4 w-4 text-gray-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'status_change':
        return 'border-blue-200 bg-blue-50';
      case 'comment':
        return 'border-green-200 bg-green-50';
      case 'contact_scheduled':
        return 'border-purple-200 bg-purple-50';
      case 'field_update':
        return 'border-orange-200 bg-orange-50';
      case 'created':
        return 'border-gray-200 bg-gray-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Clock className="h-5 w-5 text-gray-600" />
          Histórico de Atividades
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Todas as ações realizadas neste lead
        </p>
      </div>

      <div className="relative">
        {/* Linha do tempo */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

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
              <div className={`absolute left-4 w-4 h-4 rounded-full border-2 border-white shadow-sm flex items-center justify-center ${getActionColor(item.action)}`}>
                {getActionIcon(item.action)}
              </div>

              {/* Conteúdo */}
              <div className="ml-12 bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{item.description}</h4>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(item.timestamp, { addSuffix: true, locale: ptBR })}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">{item.details}</p>
                
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <User className="h-3 w-3" />
                  <span>{item.user}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {history.length === 0 && (
        <div className="text-center py-12">
          <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Nenhuma atividade registrada</p>
        </div>
      )}
    </div>
  );
};

export default LeadHistoryTab;
