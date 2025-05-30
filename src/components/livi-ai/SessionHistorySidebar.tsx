
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
      minute: '2-digit'
    });
    
    if (session.ended_at) {
      const endTime = new Date(session.ended_at).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      });
      return `${startTime} - ${endTime}`;
    }
    
    return startTime;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit'
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
      className={`session-card bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/20 dark:border-slate-700/20 rounded-lg p-3 mb-3 shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md hover:bg-white/80 dark:hover:bg-slate-800/80 ${
        currentSession?.id === session.id ? 'ring-1 ring-blue-500 border-blue-200 dark:border-blue-600' : ''
      }`}
      onClick={() => onSelectSession(session)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center min-w-0 flex-1">
          <div className="w-4 h-4 flex items-center justify-center mr-2 flex-shrink-0">
            <MessageSquare className={`h-3 w-3 ${session.is_active ? 'text-blue-500' : 'text-gray-400'}`} />
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
              className="text-xs h-5 p-1 bg-white/80 dark:bg-slate-700/80"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className="font-medium text-xs text-gray-700 dark:text-gray-300 truncate">
              {formatDate(session.created_at)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 flex-shrink-0 ml-2">
          <Badge 
            variant={session.is_active ? "default" : "secondary"}
            className={`text-xs px-2 py-0 rounded-full whitespace-nowrap h-5 ${
              session.is_active 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
            }`}
          >
            {session.is_active ? 'Ativa' : 'Encerrada'}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            className="h-5 w-5 p-0 hover:bg-white/60 dark:hover:bg-slate-700/60"
            onClick={(e) => {
              e.stopPropagation();
              startEdit(session);
            }}
          >
            <Edit3 className="h-2.5 w-2.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-5 w-5 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
            onClick={(e) => {
              e.stopPropagation();
              if (confirm('Tem certeza que deseja deletar esta sessão?')) {
                onDeleteSession(session.id);
              }
            }}
          >
            <Trash2 className="h-2.5 w-2.5" />
          </Button>
        </div>
      </div>

      <div className="text-gray-500 dark:text-gray-400 text-xs flex items-center mb-1">
        <Clock className="h-3 w-3 mr-1" />
        <span>{formatTimeRange(session)}</span>
      </div>
      <div className="text-gray-500 dark:text-gray-400 text-xs">
        {session.total_messages} {session.total_messages === 1 ? 'mensagem' : 'mensagens'}
      </div>
    </motion.div>
  );

  return (
    <div className="w-full h-full bg-white/40 dark:bg-slate-900/40 backdrop-blur-lg border-r border-white/20 dark:border-slate-700/20 shadow-lg flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/20 dark:border-slate-700/20">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-3">
          Histórico de Sessões
        </h2>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
          <Input
            placeholder="Buscar conversas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 h-8 text-xs bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/20 dark:border-slate-700/20"
          />
        </div>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {loading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-white/40 dark:bg-slate-800/40 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <AnimatePresence>
            {filteredSessions.length > 0 ? (
              filteredSessions.map(renderSessionCard)
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8"
              >
                <MessageSquare className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {searchTerm ? 'Nenhuma conversa encontrada' : 'Nenhuma conversa ainda'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};
