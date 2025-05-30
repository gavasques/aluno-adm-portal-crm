
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useUserStorage } from "@/hooks/useUserStorage";
import { Skeleton } from "@/components/ui/skeleton";
import { HardDrive, FileText, Calendar, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import UserFilesList from "./UserFilesList";

const StoragePanel: React.FC = () => {
  const { storageInfo, userFiles, isLoading, error, refreshStorage } = useUserStorage();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error && !storageInfo) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
            <div>
              <p className="text-lg font-medium text-gray-900">Erro ao carregar armazenamento</p>
              <p className="text-sm text-gray-500 mt-1">{error}</p>
            </div>
            <Button onClick={refreshStorage} variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Tentar novamente
            </Button>
          </div>
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

  // Usar valores padrão se storageInfo for null
  const safeStorageInfo = storageInfo || {
    storage_used_mb: 0,
    storage_limit_mb: 100,
    storage_available_mb: 100,
    usage_percentage: 0,
    storage_percentage: 0
  };

  return (
    <div className="space-y-6">
      {/* Card de Resumo de Armazenamento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            Armazenamento
            {error && (
              <Button 
                onClick={refreshStorage} 
                variant="ghost" 
                size="sm"
                className="ml-auto text-xs"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Atualizar
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Usado: {formatMB(safeStorageInfo.storage_used_mb)}</span>
              <span>Disponível: {formatMB(safeStorageInfo.storage_limit_mb)}</span>
            </div>
            
            <div className="relative">
              <Progress 
                value={safeStorageInfo.usage_percentage} 
                className="h-3"
              />
              <div 
                className={`absolute top-0 left-0 h-3 rounded-full transition-all ${getProgressColor(safeStorageInfo.usage_percentage)}`}
                style={{ width: `${Math.min(safeStorageInfo.usage_percentage, 100)}%` }}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-1">
                <p className="text-2xl font-bold text-blue-600">
                  {formatMB(safeStorageInfo.storage_used_mb)}
                </p>
                <p className="text-sm text-gray-500">Usado</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-green-600">
                  {formatMB(safeStorageInfo.storage_available_mb)}
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

            {safeStorageInfo.usage_percentage >= 90 && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-red-800 text-sm">
                  ⚠️ Seu armazenamento está quase cheio. 
                  Considere excluir alguns arquivos ou entrar em contato com o administrador 
                  para solicitar mais espaço.
                </p>
              </div>
            )}

            {error && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                <p className="text-yellow-800 text-sm">
                  ⚠️ Alguns dados podem estar desatualizados devido a problemas de conexão.
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
