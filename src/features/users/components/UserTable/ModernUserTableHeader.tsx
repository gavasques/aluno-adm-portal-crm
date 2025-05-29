
import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const ModernUserTableHeader: React.FC = () => {
  return (
    <TableHeader>
      <TableRow className="border-b border-white/10 hover:bg-white/5">
        <TableHead className="text-left font-semibold text-gray-700 dark:text-gray-200" style={{ width: '35%' }}>
          Usuário
        </TableHead>
        <TableHead className="text-left font-semibold text-gray-700 dark:text-gray-200" style={{ width: '25%' }}>
          Badges
        </TableHead>
        <TableHead className="text-center font-semibold text-gray-700 dark:text-gray-200" style={{ width: '15%' }}>
          Armazenamento
        </TableHead>
        <TableHead className="text-center font-semibold text-gray-700 dark:text-gray-200" style={{ width: '15%' }}>
          Último Acesso
        </TableHead>
        <TableHead className="text-center font-semibold text-gray-700 dark:text-gray-200" style={{ width: '10%' }}>
          Ações
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};
