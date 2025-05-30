
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Calendar, 
  MessageSquare, 
  Clock, 
  CreditCard, 
  Trash2, 
  Edit3,
  Filter,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
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
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    'hoje': true,
    'ontem': false,
    'esta-semana': false,
    'mais-antigas': false
  });

  const filteredSessions = sessions.filter(session =>
    session.session_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupSessionsByDate = (sessions: LiviAISession[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const groups = {
      hoje: [] as LiviAISession[],
      ontem: [] as LiviAISession[],
      'esta-semana': [] as LiviAISession[],
      'mais-antigas': [] as LiviAISession[]
    };

    sessions.forEach(session => {
      const sessionDate = new Date(session.created_at);
      
      if (sessionDate >= today) {
        groups.hoje.push(session);
      } else if (sessionDate >= yesterday) {
        groups.ontem.push(session);
      } else if (sessionDate >= weekAgo) {
        groups['esta-semana'].push(session);
      } else {
        groups['mais-antigas'].push(session);
      }
    });

    return groups;
  };

  const sessionGroups = groupSessionsByDate(filteredSessions);

  const formatDuration = (minutes?: number) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
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

  const toggleGroup = (groupKey: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey]
    }));
  };

  const renderSessionCard = (session: LiviAISession) => (
    <Card 
      key={session.id}
      className={`cursor-pointer transition-all duration-200 hover:shadow-md mb-2 ${
        currentSession?.id === session.id ? 'ring-2 ring-violet-500 bg-violet-50 dark:bg-violet-900/20' : ''
      }`}
      onClick={() => onSelectSession(session)}
    >
      <CardContent className="p-3">
        <div className="flex items-start justify-between mb-2">
          {editingSessionId === session.id ? (
            <div className="flex-1 mr-2">
              <Input
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveEdit();
                  if (e.key === 'Escape') cancelEdit();
                }}
                onBlur={saveEdit}
                className="text-sm"
                autoFocus
              />
            </div>
          ) : (
            <h4 className="font-medium text-sm line-clamp-2 flex-1">
              {session.session_name}
            </h4>
          )}
          
          <div className="flex gap-1 ml-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
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
                onDeleteSession(session.id);
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-2">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{formatDistanceToNow(new Date(session.created_at), { addSuffix: true, locale: ptBR })}</span>
          </div>
          {session.is_active && (
            <Badge variant="default" className="text-xs">Ativa</Badge>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            <span>{session.total_messages}</span>
          </div>
          <div className="flex items-center gap-1">
            <CreditCard className="h-3 w-3" />
            <span>{session.credits_consumed}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{formatDuration(session.session_duration_minutes)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderSessionGroup = (groupKey: string, groupLabel: string, sessions: LiviAISession[]) => {
    if (sessions.length === 0) return null;

    return (
      <Collapsible 
        key={groupKey}
        open={expandedGroups[groupKey]} 
        onOpenChange={() => toggleGroup(groupKey)}
      >
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-2 h-auto">
            <span className="font-medium text-sm">{groupLabel} ({sessions.length})</span>
            {expandedGroups[groupKey] ? 
              <ChevronDown className="h-4 w-4" /> : 
              <ChevronRight className="h-4 w-4" />
            }
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2 mt-2">
          <AnimatePresence>
            {sessions.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                {renderSessionCard(session)}
              </motion.div>
            ))}
          </AnimatePresence>
        </CollapsibleContent>
      </Collapsible>
    );
  };

  return (
    <div className="h-full flex flex-col bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-r border-white/20">
      {/* Header */}
      <div className="p-4 border-b border-white/20">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
          Histórico de Conversas
        </h3>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar conversas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {renderSessionGroup('hoje', 'Hoje', sessionGroups.hoje)}
            {renderSessionGroup('ontem', 'Ontem', sessionGroups.ontem)}
            {renderSessionGroup('esta-semana', 'Esta semana', sessionGroups['esta-semana'])}
            {renderSessionGroup('mais-antigas', 'Mais antigas', sessionGroups['mais-antigas'])}
            
            {filteredSessions.length === 0 && (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400">
                  {searchTerm ? 'Nenhuma conversa encontrada' : 'Nenhuma conversa ainda'}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
