
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";

const EmptyPermissions = () => {
  return (
    <TableRow>
      <TableCell colSpan={4} className="h-32 text-center">
        <div className="flex flex-col items-center justify-center text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mb-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-sm">Nenhum grupo de permissão encontrado</p>
          <p className="text-xs mt-1">
            Clique em "Novo Grupo de Permissão" para começar
          </p>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default EmptyPermissions;
