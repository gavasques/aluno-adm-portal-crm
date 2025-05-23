
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertTriangle } from "lucide-react";

interface UserStatusBadgeProps {
  status: string;
  permissionGroupId?: string | null;
  isTemporaryGroup?: boolean;
}

const UserStatusBadge: React.FC<UserStatusBadgeProps> = ({ 
  status, 
  permissionGroupId,
  isTemporaryGroup = false 
}) => {
  // Se o usuário está no grupo temporário "Geral"
  if (isTemporaryGroup) {
    return (
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="border-orange-300 text-orange-700 bg-orange-50">
          {status}
        </Badge>
        <Badge variant="outline" className="border-amber-300 text-amber-700 bg-amber-50 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Pendente
        </Badge>
      </div>
    );
  }

  // Status normal baseado no valor original
  const getStatusVariant = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    
    if (normalizedStatus === "ativo" || normalizedStatus === "active") {
      return "default";
    } else if (normalizedStatus === "inativo" || normalizedStatus === "inactive") {
      return "secondary";
    }
    
    return "outline";
  };

  const getStatusColor = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    
    if (normalizedStatus === "ativo" || normalizedStatus === "active") {
      return "text-green-700 bg-green-50 border-green-200";
    } else if (normalizedStatus === "inativo" || normalizedStatus === "inactive") {
      return "text-red-700 bg-red-50 border-red-200";
    }
    
    return "text-gray-700 bg-gray-50 border-gray-200";
  };

  return (
    <Badge 
      variant="outline" 
      className={getStatusColor(status)}
    >
      {status}
    </Badge>
  );
};

export default UserStatusBadge;
