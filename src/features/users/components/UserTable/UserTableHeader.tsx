
import React from "react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

interface UserTableHeaderProps {
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (field: string) => void;
}

export const UserTableHeader: React.FC<UserTableHeaderProps> = ({
  sortField,
  sortDirection,
  onSort
}) => {
  const getSortIcon = (field: string) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
    return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  const handleSort = (field: string) => {
    if (onSort) {
      onSort(field);
    }
  };

  return (
    <TableHeader>
      <TableRow>
        <TableHead>
          <Button
            variant="ghost"
            className="h-auto p-0 font-medium hover:bg-transparent"
            onClick={() => handleSort('name')}
          >
            Usuário
            {getSortIcon('name')}
          </Button>
        </TableHead>
        <TableHead>
          <Button
            variant="ghost"
            className="h-auto p-0 font-medium hover:bg-transparent"
            onClick={() => handleSort('status')}
          >
            Status
            {getSortIcon('status')}
          </Button>
        </TableHead>
        <TableHead>
          <Button
            variant="ghost"
            className="h-auto p-0 font-medium hover:bg-transparent"
            onClick={() => handleSort('role')}
          >
            Função
            {getSortIcon('role')}
          </Button>
        </TableHead>
        <TableHead>
          <Button
            variant="ghost"
            className="h-auto p-0 font-medium hover:bg-transparent"
            onClick={() => handleSort('lastLogin')}
          >
            Último Login
            {getSortIcon('lastLogin')}
          </Button>
        </TableHead>
        <TableHead>
          <Button
            variant="ghost"
            className="h-auto p-0 font-medium hover:bg-transparent"
            onClick={() => handleSort('storage')}
          >
            Armazenamento
            {getSortIcon('storage')}
          </Button>
        </TableHead>
        <TableHead className="text-right">Ações</TableHead>
      </TableRow>
    </TableHeader>
  );
};
