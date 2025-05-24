
import React from "react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

const UsersTableHeader: React.FC = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Usuário</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Função</TableHead>
        <TableHead>Último Login</TableHead>
        <TableHead>Storage %</TableHead>
        <TableHead className="text-right">Ações</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default UsersTableHeader;
