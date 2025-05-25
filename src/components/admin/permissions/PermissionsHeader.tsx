
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import PermissionGroupRecoveryButton from "./PermissionGroupRecoveryButton";

interface PermissionsHeaderProps {
  onAdd: () => void;
  onRecoverySuccess?: () => void;
}

const PermissionsHeader: React.FC<PermissionsHeaderProps> = ({ 
  onAdd, 
  onRecoverySuccess 
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Grupos de Permissão</h1>
        <p className="text-gray-600 mt-1">
          Gerencie grupos de permissão e controle de acesso dos usuários
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        {onRecoverySuccess && (
          <PermissionGroupRecoveryButton onSuccess={onRecoverySuccess} />
        )}
        <Button onClick={onAdd} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novo Grupo
        </Button>
      </div>
    </div>
  );
};

export default PermissionsHeader;
