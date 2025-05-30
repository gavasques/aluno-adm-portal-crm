
import React from 'react';
import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

export const ChatWelcomeMessage: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-2 sm:gap-3 w-full"
    >
      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
        <Bot className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-white" />
      </div>
      <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl rounded-tl-sm p-2 sm:p-3 flex-1 max-w-[85%] sm:max-w-[75%] lg:max-w-none">
        <p className="text-gray-900 dark:text-gray-100 leading-relaxed text-xs sm:text-sm break-words">
          Olá! Eu sou o Livi AI, seu assistente especializado em importação e Amazon. 
          Como posso ajudar você hoje?
        </p>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 sm:mt-1.5">
          {new Date().toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>
    </motion.div>
  );
};
