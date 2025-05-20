
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";

interface EmptyTableMessageProps {
  colSpan: number;
  message?: string;
}

const EmptyTableMessage: React.FC<EmptyTableMessageProps> = ({
  colSpan,
  message = "Nenhum fornecedor encontrado.",
}) => {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="text-center py-8 text-gray-500">
        {message}
      </TableCell>
    </TableRow>
  );
};

export default EmptyTableMessage;
