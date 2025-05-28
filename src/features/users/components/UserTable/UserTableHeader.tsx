
import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const UserTableHeader: React.FC = () => {
  return (
    <TableHeader>
      <TableRow className="bg-gray-50">
        <TableHead className="font-semibold text-gray-900">Usuário</TableHead>
        <TableHead className="font-semibold text-gray-900">Status & Badges</TableHead>
        <TableHead className="font-semibold text-gray-900">Função</TableHead>
        <TableHead className="font-semibold text-gray-900">Último Acesso</TableHead>
        <TableHead className="w-16"></TableHead>
      </TableRow>
    </TableHeader>
  );
};
