
import React from 'react';
import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

export const ChatWelcomeMessage: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-4 max-w-3xl"
    >
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
        <Bot className="h-4 w-4 text-white" />
      </div>
      <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl rounded-tl-sm p-4 flex-1">
        <p className="text-gray-900 dark:text-gray-100 leading-relaxed">
          Olá! Eu sou o Livi AI, seu assistente especializado em importação e Amazon. 
          Como posso ajudar você hoje?
        </p>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {new Date().toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>
    </motion.div>
  );
};
