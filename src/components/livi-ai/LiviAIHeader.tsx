
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
      className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-b border-white/20 dark:border-slate-700/20 shadow-sm flex-shrink-0"
    >
      <div className="p-3 max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo e Status */}
          <div className="flex items-center space-x-3">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg"
            >
              <Bot className="h-4 w-4 text-white" />
            </motion.div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Livi AI
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {currentSession?.is_active ? 'Sessão ativa' : 'Nenhuma sessão ativa'}
              </p>
            </div>
          </div>

          {/* Ações */}
          <div className="flex items-center gap-2">
            <Button 
              onClick={onStartSession} 
              disabled={currentSession?.is_active || !hasCredits}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              size="sm"
            >
              <Play className="h-4 w-4 mr-2" />
              Iniciar
            </Button>
            <Button 
              onClick={onEndSession} 
              disabled={!currentSession?.is_active}
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 shadow-sm"
              size="sm"
            >
              <Square className="h-4 w-4 mr-2" />
              Encerrar
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
