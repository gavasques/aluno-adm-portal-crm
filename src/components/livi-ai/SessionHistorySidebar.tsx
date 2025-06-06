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
      className={`session-card bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border border-gray-200/50 dark:border-slate-600/50 rounded-lg p-2.5 mb-2 shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md hover:bg-white/90 dark:hover:bg-slate-700/90 ${
        currentSession?.id === session.id ? 'ring-1 ring-blue-500 border-blue-200 dark:border-blue-600' : ''
      }`}
      onClick={() => onSelectSession(session)}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex justify-between items-center mb-1.5">
        <div className="flex items-center min-w-0 flex-1">
          <div className="w-3 h-3 flex items-center justify-center mr-2 flex-shrink-0">
            <MessageSquare className={`h-2.5 w-2.5 ${session.is_active ? 'text-blue-500' : 'text-gray-400'}`} />
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
              className="text-xs h-4 p-1 bg-white/80 dark:bg-slate-700/80"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className="font-medium text-xs text-gray-700 dark:text-gray-300 truncate">
              {formatDate(session.created_at)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 flex-shrink-0 ml-1">
          <Badge 
            variant={session.is_active ? "default" : "secondary"}
            className={`text-xs px-1.5 py-0 rounded-full whitespace-nowrap h-4 ${
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
            className="h-4 w-4 p-0 hover:bg-white/60 dark:hover:bg-slate-700/60"
            onClick={(e) => {
              e.stopPropagation();
              startEdit(session);
            }}
          >
            <Edit3 className="h-2 w-2" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
            onClick={(e) => {
              e.stopPropagation();
              if (confirm('Tem certeza que deseja deletar esta sessão?')) {
                onDeleteSession(session.id);
              }
            }}
          >
            <Trash2 className="h-2 w-2" />
          </Button>
        </div>
      </div>

      <div className="text-gray-500 dark:text-gray-400 text-xs flex items-center mb-1">
        <Clock className="h-2.5 w-2.5 mr-1" />
        <span>{formatTimeRange(session)}</span>
      </div>
      <div className="text-gray-500 dark:text-gray-400 text-xs">
        {session.total_messages} {session.total_messages === 1 ? 'mensagem' : 'mensagens'}
      </div>
    </motion.div>
  );

  return (
    <div className="w-full h-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-r border-gray-200/50 dark:border-slate-700/50 shadow-sm flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-gray-200/50 dark:border-slate-700/50">
        <h2 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">
          Histórico de Sessões
        </h2>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
          <Input
            placeholder="Buscar conversas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-7 h-7 text-xs bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border-gray-200/50 dark:border-slate-600/50"
          />
        </div>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {loading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-14 bg-white/40 dark:bg-slate-700/40 rounded-lg animate-pulse" />
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
                className="text-center py-6"
              >
                <MessageSquare className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 dark:text-gray-400 text-xs">
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
