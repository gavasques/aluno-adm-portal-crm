
import React from "react";
import { Calendar } from "lucide-react";

interface HistoryTabProps {
  partnerId: number;
}

export const HistoryTab: React.FC<HistoryTabProps> = ({ partnerId }) => {
  return (
    <div className="text-center py-8">
      <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
      <p className="text-gray-500">Nenhum histórico disponível</p>
    </div>
  );
};
