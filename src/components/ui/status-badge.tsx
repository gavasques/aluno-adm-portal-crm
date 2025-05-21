
import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  isActive?: boolean;
  status?: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ isActive, status, className }) => {
  let isActiveState = isActive;
  
  // Se o status for fornecido, usar para determinar se está ativo
  if (status !== undefined) {
    isActiveState = status === "Ativo";
  }
  
  return (
    <Badge 
      className={cn(
        "px-2 py-1 font-medium text-xs",
        isActiveState 
          ? "bg-green-100 text-green-800 hover:bg-green-200" 
          : "bg-red-100 text-red-800 hover:bg-red-200",
        className
      )}
    >
      {status || (isActiveState ? "Ativo" : "Inativo")}
    </Badge>
  );
};

export default StatusBadge;
