
import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const ModernUserTableHeader: React.FC = () => {
  return (
    <TableHeader>
      <TableRow className="border-b border-white/10 hover:bg-white/5">
        <TableHead className="text-left font-semibold text-gray-700 dark:text-gray-200 w-[35%] min-w-[280px]">
          Usuário
        </TableHead>
        <TableHead className="text-left font-semibold text-gray-700 dark:text-gray-200 w-[25%] min-w-[200px]">
          Badges
        </TableHead>
        <TableHead className="text-center font-semibold text-gray-700 dark:text-gray-200 w-[15%] min-w-[120px]">
          Armazenamento
        </TableHead>
        <TableHead className="text-center font-semibold text-gray-700 dark:text-gray-200 w-[15%] min-w-[120px]">
          Último Acesso
        </TableHead>
        <TableHead className="text-center font-semibold text-gray-700 dark:text-gray-200 w-[10%] min-w-[80px]">
          Ações
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};
