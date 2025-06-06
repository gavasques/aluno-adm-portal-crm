
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import { PermissionServiceFactory } from "@/services/permissions";
import { toast } from "@/hooks/use-toast";

const MenuSyncManager: React.FC = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<any>(null);

  const handleMenuSync = async () => {
    try {
      setIsSyncing(true);
      setSyncResult(null);
      
      const menuService = PermissionServiceFactory.getSystemMenuService();
      const result = await menuService.syncMenusFromCode();
      
      setSyncResult(result);
      
      if (result.success) {
        toast({
          title: "Sincronização concluída",
          description: `${result.data?.created || 0} menus criados, ${result.data?.updated || 0} atualizados`,
        });
      } else {
        toast({
          title: "Erro na sincronização",
          description: result.error || "Erro desconhecido",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Erro ao sincronizar menus:", error);
      toast({
        title: "Erro",
        description: "Erro inesperado durante a sincronização",
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
                        {syncResult.data.created || 0} novos menus criados
                      </Badge>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        {syncResult.data.updated || 0} menus atualizados
                      </Badge>
                    </div>
                    
                    {syncResult.data.menus && syncResult.data.menus.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium mb-2">Menus processados:</p>
                        <div className="max-h-32 overflow-y-auto space-y-1">
                          {syncResult.data.menus.map((menu: any, index: number) => (
                            <div key={index} className="text-xs bg-gray-50 p-2 rounded">
                              <span className="font-medium">{menu.display_name}</span>
                              <span className="text-gray-500 ml-2">({menu.menu_key})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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
