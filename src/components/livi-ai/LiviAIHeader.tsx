
import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Play, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LiviAISession } from '@/hooks/useLiviAISessions';

interface LiviAIHeaderProps {
  currentSession: LiviAISession | null;
  onStartSession: () => void;
  onEndSession: () => void;
  hasCredits: boolean;
}

export const LiviAIHeader: React.FC<LiviAIHeaderProps> = ({
  currentSession,
  onStartSession,
  onEndSession,
  hasCredits
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-b border-gray-200/50 dark:border-slate-700/50 shadow-sm flex-shrink-0 overflow-x-hidden"
    >
      <div className="p-4 w-full">
        <div className="flex items-center justify-between gap-4 min-w-0 max-w-4xl mx-auto">
          {/* Logo e Status */}
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg flex-shrink-0"
            >
              <Bot className="h-4 w-4 text-white" />
            </motion.div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent truncate">
                Livi AI
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {currentSession?.is_active ? 'Sessão ativa' : 'Nenhuma sessão ativa'}
              </p>
            </div>
          </div>

          {/* Ações */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button 
              onClick={onStartSession} 
              disabled={currentSession?.is_active || !hasCredits}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              size="sm"
            >
              <Play className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Iniciar</span>
            </Button>
            <Button 
              onClick={onEndSession} 
              disabled={!currentSession?.is_active}
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 shadow-sm"
              size="sm"
            >
              <Square className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Encerrar</span>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
