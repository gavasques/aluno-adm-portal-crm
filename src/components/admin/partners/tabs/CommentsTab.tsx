
import React from "react";
import { MessageSquare } from "lucide-react";

interface CommentsTabProps {
  partnerId: number;
}

export const CommentsTab: React.FC<CommentsTabProps> = ({ partnerId }) => {
  return (
    <div className="text-center py-8">
      <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
      <p className="text-gray-500">Nenhum comentário disponível</p>
    </div>
  );
};
