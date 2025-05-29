
import React from 'react';
import { motion } from 'framer-motion';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowUpDown } from 'lucide-react';

export const ModernUserTableHeader: React.FC = () => {
  return (
    <TableHeader className="sticky top-0 backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border-b border-white/20">
      <TableRow className="hover:bg-transparent">
        <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
          <motion.div 
            className="flex items-center space-x-2 cursor-pointer"
            whileHover={{ scale: 1.02 }}
          >
            <span>Usuário</span>
            <ArrowUpDown className="h-4 w-4 opacity-50" />
          </motion.div>
        </TableHead>
        <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
          <motion.div 
            className="flex items-center space-x-2 cursor-pointer"
            whileHover={{ scale: 1.02 }}
          >
            <span>Status</span>
            <ArrowUpDown className="h-4 w-4 opacity-50" />
          </motion.div>
        </TableHead>
        <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
          <motion.div 
            className="flex items-center space-x-2 cursor-pointer"
            whileHover={{ scale: 1.02 }}
          >
            <span>Função</span>
            <ArrowUpDown className="h-4 w-4 opacity-50" />
          </motion.div>
        </TableHead>
        <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
          <motion.div 
            className="flex items-center space-x-2 cursor-pointer"
            whileHover={{ scale: 1.02 }}
          >
            <span>Último Acesso</span>
            <ArrowUpDown className="h-4 w-4 opacity-50" />
          </motion.div>
        </TableHead>
        <TableHead className="text-right font-semibold text-gray-700 dark:text-gray-300">
          Ações
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};
