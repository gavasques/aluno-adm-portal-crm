
import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  isActive: boolean;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ isActive, className }) => {
  return (
    <Badge 
      className={cn(
        "px-2 py-1 font-medium text-xs",
        isActive 
          ? "bg-green-100 text-green-800 hover:bg-green-200" 
          : "bg-gray-100 text-gray-800 hover:bg-gray-200",
        className
      )}
    >
      {isActive ? "Ativo" : "Inativo"}
    </Badge>
  );
};

export default StatusBadge;
