
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Plus, HardDrive } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StorageColumnProps {
  userId: string;
  userName: string;
  storageUsedMb: number;
  storageLimitMb: number;
  onAddStorage: (userId: string, userName: string) => void;
}

const StorageColumn: React.FC<StorageColumnProps> = ({
  userId,
  userName,
  storageUsedMb,
  storageLimitMb,
  onAddStorage
}) => {
  const usagePercentage = Math.min((storageUsedMb / storageLimitMb) * 100, 100);
  
  const formatMB = (mb: number) => {
    if (mb >= 1024) {
      return `${(mb / 1024).toFixed(1)}GB`;
    }
    return `${Math.round(mb)}MB`;
  };

  const getStatusColor = (percentage: number) => {
    if (percentage >= 90) return "destructive";
    if (percentage >= 75) return "outline";
    return "secondary";
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  const handleAddStorage = () => {
    console.log('🔄 Adicionando storage para usuário:', userName, userId);
    onAddStorage(userId, userName);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-mono">
          {formatMB(storageUsedMb)} / {formatMB(storageLimitMb)}
        </span>
        <Badge variant={getStatusColor(usagePercentage)} className="text-xs">
          {Math.round(usagePercentage)}%
        </Badge>
      </div>
      
      <div className="relative">
        <Progress value={usagePercentage} className="h-2" />
        <div 
          className={`absolute top-0 left-0 h-2 rounded-full transition-all ${getProgressColor(usagePercentage)}`}
          style={{ width: `${Math.min(usagePercentage, 100)}%` }}
        />
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={handleAddStorage}
        className="w-full text-xs h-7 hover:bg-blue-50"
      >
        <Plus className="h-3 w-3 mr-1" />
        +100MB
      </Button>
    </div>
  );
};

export default StorageColumn;
