
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";

const EmptyUsersList: React.FC = () => {
  return (
    <TableRow>
      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
        Nenhum usuário encontrado com os critérios de busca.
      </TableCell>
    </TableRow>
  );
};

export default EmptyUsersList;
