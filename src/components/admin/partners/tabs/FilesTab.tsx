
import React from "react";
import { FileText } from "lucide-react";

interface FilesTabProps {
  partnerId: number;
}

export const FilesTab: React.FC<FilesTabProps> = ({ partnerId }) => {
  return (
    <div className="text-center py-8">
      <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
      <p className="text-gray-500">Nenhum arquivo disponível</p>
    </div>
  );
};
