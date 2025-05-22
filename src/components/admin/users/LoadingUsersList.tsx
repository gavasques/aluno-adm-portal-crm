
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";

const LoadingUsersList: React.FC = () => {
  return (
    <TableRow>
      <TableCell colSpan={6} className="text-center py-8">
        <div className="flex justify-center items-center">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Carregando usuários...</span>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default LoadingUsersList;
