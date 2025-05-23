
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, XCircle } from "lucide-react";

interface UserStatusBadgeProps {
  status: string;
  permissionGroupId?: string | null;
  isTemporaryGroup?: boolean;
}

const UserStatusBadge: React.FC<UserStatusBadgeProps> = ({ 
  status, 
  permissionGroupId,
  isTemporaryGroup 
}) => {
  const normalizedStatus = typeof status === 'string' ? status.toLowerCase() : '';
  const isActive = normalizedStatus === "ativo" || normalizedStatus === "active";
  
  // Se o usuário está no grupo temporário "Geral", mostrar badge especial
  if (isTemporaryGroup && permissionGroupId) {
    return (
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="bg-orange-50 border-orange-200 text-orange-700">
          <Clock className="w-3 h-3 mr-1" />
          Aguardando Validação
        </Badge>
      </div>
    );
  }
  
  // Status normal do usuário
  if (isActive) {
    return (
      <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
        <CheckCircle className="w-3 h-3 mr-1" />
        Ativo
      </Badge>
    );
  } else {
    return (
      <Badge variant="outline" className="bg-red-50 border-red-200 text-red-700">
        <XCircle className="w-3 h-3 mr-1" />
        Inativo
      </Badge>
    );
  }
};

export default UserStatusBadge;
