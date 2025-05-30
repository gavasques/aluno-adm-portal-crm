
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Clock, 
  Search,
  Edit3,
  Trash2
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LiviAISession } from '@/hooks/useLiviAISessions';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SessionHistorySidebarProps {
  sessions: LiviAISession[];
  currentSession: LiviAISession | null;
  onSelectSession: (session: LiviAISession) => void;
  onDeleteSession: (sessionId: string) => void;
  onRenameSession: (sessionId: string, newName: string) => void;
  loading: boolean;
}

export const SessionHistorySidebar: React.FC<SessionHistorySidebarProps> = ({
  sessions,
  currentSession,
  onSelectSession,
  onDeleteSession,
  onRenameSession,
  loading
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const filteredSessions = sessions.filter(session =>
    session.session_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTimeRange = (session: LiviAISession) => {
    const startTime = new Date(session.started_at).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    
    if (session.ended_at) {
      const endTime = new Date(session.ended_at).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      return `${startTime} - ${endTime}`;
    }
    
    return startTime;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const startEdit = (session: LiviAISession) => {
    setEditingSessionId(session.id);
    setEditingName(session.session_name);
  };

  const saveEdit = () => {
    if (editingSessionId && editingName.trim()) {
      onRenameSession(editingSessionId, editingName.trim());
    }
    setEditingSessionId(null);
    setEditingName('');
  };

  const cancelEdit = () => {
    setEditingSessionId(null);
    setEditingName('');
  };

  const renderSessionCard = (session: LiviAISession) => (
    <motion.div
      key={session.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={`session-card bg-white border border-gray-100 rounded-lg p-4 mb-4 shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
        currentSession?.id === session.id ? 'ring-2 ring-primary border-primary' : ''
      }`}
      onClick={() => onSelectSession(session)}
    >
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <div className="w-6 h-6 flex items-center justify-center mr-2">
            <MessageSquare className={`h-4 w-4 ${session.is_active ? 'text-primary' : 'text-gray-400'}`} />
          </div>
          {editingSessionId === session.id ? (
            <Input
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveEdit();
                if (e.key === 'Escape') cancelEdit();
              }}
              onBlur={saveEdit}
              className="text-sm h-6 p-1"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className="font-medium">{formatDate(session.created_at)}</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Badge 
            variant={session.is_active ? "default" : "secondary"}
            className={`text-xs px-3 py-1 rounded-full whitespace-nowrap ${
              session.is_active 
                ? 'bg-gray-900 text-white' 
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {session.is_active ? 'Ativa' : 'Encerrada'}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 ml-1"
            onClick={(e) => {
              e.stopPropagation();
              startEdit(session);
            }}
          >
            <Edit3 className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
            onClick={(e) => {
              e.stopPropagation();
              if (confirm('Tem certeza que deseja deletar esta sessão?')) {
                onDeleteSession(session.id);
              }
            }}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className="text-gray-500 text-sm flex items-center mb-1">
        <Clock className="h-4 w-4 mr-1" />
        <span>{formatTimeRange(session)}</span>
      </div>
      <div className="text-gray-500 text-sm">
        {session.total_messages} {session.total_messages === 1 ? 'mensagem' : 'mensagens'}
      </div>
    </motion.div>
  );

  return (
    <div className="w-96 bg-white shadow-md p-6 overflow-y-auto h-full">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-6">Histórico de Sessões</h1>
      
      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar conversas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Sessions List */}
      <div className="space-y-2">
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <AnimatePresence>
            {filteredSessions.length > 0 ? (
              filteredSessions.map(renderSessionCard)
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">
                  {searchTerm ? 'Nenhuma conversa encontrada' : 'Nenhuma conversa ainda'}
                </p>
              </div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};
