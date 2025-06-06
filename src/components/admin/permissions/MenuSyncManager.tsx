
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import { MenuSyncService } from "@/services/permissions/MenuSyncService";
import { toast } from "@/hooks/use-toast";

const MenuSyncManager: React.FC = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<any>(null);

  const handleMenuSync = async () => {
    try {
      setIsSyncing(true);
      setSyncResult(null);
      
      const menuSyncService = new MenuSyncService();
      const result = await menuSyncService.syncMenusWithDatabase();
      
      setSyncResult({ success: true, data: result });
      
      toast({
        title: "Sincronização concluída",
        description: `${result.added || 0} menus criados, ${result.updated || 0} atualizados`,
      });
    } catch (error: any) {
      console.error("Erro ao sincronizar menus:", error);
      setSyncResult({ success: false, error: error.message });
      toast({
        title: "Erro na sincronização",
        description: error.message || "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Sincronização de Menus
          </CardTitle>
          <CardDescription>
            Sincronize os menus do código com o banco de dados para manter as permissões atualizadas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">O que esta operação faz:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Analisa os menus definidos no código da aplicação</li>
              <li>• Cria novos registros para menus que não existem no banco</li>
              <li>• Atualiza informações de menus existentes</li>
              <li>• Mantém a consistência entre código e permissões</li>
            </ul>
          </div>

          <Button
            onClick={handleMenuSync}
            disabled={isSyncing}
            className="w-full"
          >
            {isSyncing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sincronizando menus...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Iniciar Sincronização
              </>
            )}
          </Button>

          {syncResult && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  {syncResult.success ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  )}
                  <h4 className="font-medium">
                    {syncResult.success ? "Sincronização Concluída" : "Erro na Sincronização"}
                  </h4>
                </div>

                {syncResult.success && syncResult.data && (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        {syncResult.data.added || 0} novos menus criados
                      </Badge>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        {syncResult.data.updated || 0} menus atualizados
                      </Badge>
                    </div>
                  </div>
                )}

                {!syncResult.success && (
                  <p className="text-sm text-red-600">{syncResult.error}</p>
                )}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MenuSyncManager;
