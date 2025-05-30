
import React from 'react';
import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

export const ChatLoadingIndicator: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-3 max-w-3xl"
    >
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center flex-shrink-0">
        <Bot className="h-3.5 w-3.5 text-white" />
      </div>
      <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl rounded-tl-sm p-3 flex-1">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <span className="text-xs text-gray-600 dark:text-gray-400">Livi AI está pensando...</span>
        </div>
      </div>
    </motion.div>
  );
};
