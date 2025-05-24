
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useUserStorage } from "@/hooks/useUserStorage";
import { Skeleton } from "@/components/ui/skeleton";
import { HardDrive, FileText, Calendar } from "lucide-react";
import UserFilesList from "./UserFilesList";

const StoragePanel: React.FC = () => {
  const { storageInfo, userFiles, isLoading } = useUserStorage();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!storageInfo) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-gray-500">
            Não foi possível carregar as informações de armazenamento.
          </p>
        </CardContent>
      </Card>
    );
  }

  const formatMB = (mb: number) => {
    if (mb >= 1024) {
      return `${(mb / 1024).toFixed(1)} GB`;
    }
    return `${mb.toFixed(1)} MB`;
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="space-y-6">
      {/* Card de Resumo de Armazenamento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            Armazenamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Usado: {formatMB(storageInfo.storage_used_mb)}</span>
              <span>Disponível: {formatMB(storageInfo.storage_limit_mb)}</span>
            </div>
            
            <div className="relative">
              <Progress 
                value={storageInfo.usage_percentage} 
                className="h-3"
              />
              <div 
                className={`absolute top-0 left-0 h-3 rounded-full transition-all ${getProgressColor(storageInfo.usage_percentage)}`}
                style={{ width: `${Math.min(storageInfo.usage_percentage, 100)}%` }}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-1">
                <p className="text-2xl font-bold text-blue-600">
                  {formatMB(storageInfo.storage_used_mb)}
                </p>
                <p className="text-sm text-gray-500">Usado</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-green-600">
                  {formatMB(storageInfo.storage_available_mb)}
                </p>
                <p className="text-sm text-gray-500">Disponível</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-gray-800">
                  {userFiles.length}
                </p>
                <p className="text-sm text-gray-500">Arquivos</p>
              </div>
            </div>

            {storageInfo.usage_percentage >= 90 && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-red-800 text-sm">
                  ⚠️ Seu armazenamento está quase cheio. 
                  Considere excluir alguns arquivos ou entrar em contato com o administrador 
                  para solicitar mais espaço.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Lista de Arquivos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Meus Arquivos ({userFiles.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <UserFilesList files={userFiles} />
        </CardContent>
      </Card>
    </div>
  );
};

export default StoragePanel;
