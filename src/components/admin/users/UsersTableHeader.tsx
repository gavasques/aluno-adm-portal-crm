
import React from "react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

const UsersTableHeader: React.FC = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Nome</TableHead>
        <TableHead>Email</TableHead>
        <TableHead>Papel</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Último Login</TableHead>
        <TableHead className="text-right">Ações</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default UsersTableHeader;
