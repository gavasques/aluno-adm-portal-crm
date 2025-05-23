
import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  // Verificar se o status é ativo, com diferentes formas de escrita possíveis
  const isActive = status === "Ativo" || 
                  status === "ativo" || 
                  status === "ATIVO" ||
                  status === "active" || 
                  status === "Active";
  
  return (
    <Badge 
      className={cn(
        "px-2 py-1 font-medium text-xs",
        isActive 
          ? "bg-green-100 text-green-800 hover:bg-green-200" 
          : "bg-red-100 text-red-800 hover:bg-red-200",
        className
      )}
    >
      {status}
    </Badge>
  );
};

export default StatusBadge;
