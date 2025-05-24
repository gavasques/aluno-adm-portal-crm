
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Plus, HardDrive, FileText, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import StorageUpgradeDialog from "../StorageUpgradeDialog";
import { useAdminStorage } from "@/hooks/admin/useAdminStorage";

interface UserStorageDetailsProps {
  userId: string;
  userName: string;
  storageUsedMb: number;
  storageLimitMb: number;
}

const UserStorageDetails: React.FC<UserStorageDetailsProps> = ({
  userId,
  userName,
  storageUsedMb,
  storageLimitMb
}) => {
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const { storageUpgrades } = useAdminStorage();
  
  const usagePercentage = (storageUsedMb / storageLimitMb) * 100;
  
  const formatMB = (mb: number) => {
    if (mb >= 1024) {
      return `${(mb / 1024).toFixed(1)}GB`;
    }
    return `${mb.toFixed(0)}MB`;
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

  // Filtrar upgrades deste usuário
  const userUpgrades = storageUpgrades.filter(upgrade => upgrade.user_id === userId);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            Armazenamento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status atual */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-mono">
                {formatMB(storageUsedMb)} / {formatMB(storageLimitMb)}
              </span>
              <Badge variant={getStatusColor(usagePercentage)} className="text-xs">
                {usagePercentage.toFixed(0)}%
              </Badge>
            </div>
            
            <div className="relative">
              <Progress value={usagePercentage} className="h-3" />
              <div 
                className={`absolute top-0 left-0 h-3 rounded-full transition-all ${getProgressColor(usagePercentage)}`}
                style={{ width: `${Math.min(usagePercentage, 100)}%` }}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div className="space-y-1">
                <p className="text-lg font-bold text-blue-600">
                  {formatMB(storageUsedMb)}
                </p>
                <p className="text-gray-500">Usado</p>
              </div>
              <div className="space-y-1">
                <p className="text-lg font-bold text-green-600">
                  {formatMB(storageLimitMb - storageUsedMb)}
                </p>
                <p className="text-gray-500">Disponível</p>
              </div>
              <div className="space-y-1">
                <p className="text-lg font-bold text-gray-800">
                  {formatMB(storageLimitMb)}
                </p>
                <p className="text-gray-500">Total</p>
              </div>
            </div>

            {usagePercentage >= 90 && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-red-800 text-sm">
                  ⚠️ Armazenamento quase esgotado. Considere aumentar o limite.
                </p>
              </div>
            )}
          </div>

          {/* Ações */}
          <div className="flex gap-2">
            <Button
              onClick={() => setShowUpgradeDialog(true)}
              className="flex-1"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Armazenamento
            </Button>
          </div>

          {/* Histórico de Upgrades */}
          {userUpgrades.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Histórico de Upgrades
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {userUpgrades.slice(0, 5).map((upgrade) => (
                  <div key={upgrade.id} className="flex justify-between items-center text-xs bg-gray-50 p-2 rounded">
                    <div>
                      <span className="font-medium">+{upgrade.upgrade_amount_mb}MB</span>
                      {upgrade.notes && (
                        <span className="text-gray-500 ml-2">({upgrade.notes})</span>
                      )}
                    </div>
                    <span className="text-gray-500">
                      {new Date(upgrade.upgrade_date).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <StorageUpgradeDialog
        open={showUpgradeDialog}
        onOpenChange={setShowUpgradeDialog}
        userId={userId}
        userName={userName}
      />
    </>
  );
};

export default UserStorageDetails;
