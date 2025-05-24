
import React from "react";
import { Badge } from "@/components/ui/badge";

interface StoragePercentageBadgeProps {
  storageUsedMb: number;
  storageLimitMb: number;
}

const StoragePercentageBadge: React.FC<StoragePercentageBadgeProps> = ({
  storageUsedMb,
  storageLimitMb
}) => {
  const percentage = Math.round((storageUsedMb / storageLimitMb) * 100);
  
  const getVariant = (percent: number) => {
    if (percent >= 90) return "destructive";
    if (percent >= 75) return "outline";
    return "secondary";
  };

  return (
    <Badge variant={getVariant(percentage)} className="text-xs font-mono">
      {percentage}%
    </Badge>
  );
};

export default StoragePercentageBadge;
