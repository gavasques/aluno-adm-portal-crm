
import React from "react";
import { Progress } from "@/components/ui/progress";

interface StorageIndicatorProps {
  usedStorage: number;
  storageLimit: number;
  formatBytes: (bytes: number) => string;
}

const StorageIndicator: React.FC<StorageIndicatorProps> = ({ 
  usedStorage, 
  storageLimit, 
  formatBytes 
}) => {
  const usedPercentage = (usedStorage / storageLimit) * 100;
  
  return (
    <div className="flex flex-col items-end">
      <div className="text-sm text-gray-500 mb-1">
        {formatBytes(usedStorage)} de {formatBytes(storageLimit)} usados
      </div>
      <div className="w-40">
        <Progress value={usedPercentage} className="h-2" />
      </div>
    </div>
  );
};

export default StorageIndicator;
