
import React from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UsersHeaderProps {
  refreshUsersList: () => void;
  isRefreshing: boolean;
}

export const UsersHeader: React.FC<UsersHeaderProps> = ({ 
  refreshUsersList, 
  isRefreshing 
}) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-portal-dark">Gestão de Usuários</h1>
      <Button onClick={refreshUsersList} disabled={isRefreshing}>
        <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        {isRefreshing ? "Atualizando..." : "Atualizar"}
      </Button>
    </div>
  );
};

export default UsersHeader;
