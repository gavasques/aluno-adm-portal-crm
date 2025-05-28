
import React from "react";

interface UsersHeaderProps {
  // Removido refreshUsersList e isRefreshing - não são mais necessários
}

export const UsersHeader: React.FC<UsersHeaderProps> = () => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-portal-dark">Gestão de Usuários</h1>
    </div>
  );
};

export default UsersHeader;
