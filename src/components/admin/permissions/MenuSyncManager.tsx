
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  RotateCcw,
  Search,
  Shield,
  Database
} from "lucide-react";
import { toast } from "sonner";
import { MenuSyncService } from "@/services/permissions/MenuSyncService";

const MenuSyncManager = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastSync, setLastSync] = useState<{
    added: number;
    updated: number;
    inconsistencies: string[];
  } | null>(null);
  const [validation, setValidation] = useState<{
    isConsistent: boolean;
    issues: string[];
    suggestions: string[];
  } | null>(null);

  const menuSyncService = new MenuSyncService();

  const handleSync = async () => {
    setIsLoading(true);
    try {
      const result = await menuSyncService.syncMenusWithDatabase();
      setLastSync(result);
      
      if (result.added > 0 || result.updated > 0) {
        toast.success(`Sincronização concluída! ${result.added} adicionados, ${result.updated} atualizados`);
      } else {
        toast.success('Todos os menus já estão sincronizados');
      }

      // Revalidar após sync
      await handleValidate();
    } catch (error) {
      console.error('Erro na sincronização:', error);
      toast.error('Erro ao sincronizar menus');
    } finally {
      setIsLoading(false);
    }
  };

  const handleValidate = async () => {
    try {
      const result = await menuSyncService.validateMenuConsistency();
      setValidation(result);
      
      if (result.isConsistent) {
        toast.success('Todos os menus estão consistentes');
      } else {
        toast.warning(`${result.issues.length} inconsistência(s) encontrada(s)`);
      }
    } catch (error) {
      console.error('Erro na validação:', error);
      toast.error('Erro ao validar menus');
    }
  };

  React.useEffect(() => {
    handleValidate();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RotateCcw className="w-5 h-5" />
            Sincronização de Menus
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Mantenha os menus do sistema sincronizados entre o sidebar e as permissões
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Button 
              onClick={handleSync} 
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Sincronizando...' : 'Sincronizar Menus'}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleValidate}
              className="flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Validar Consistência
            </Button>
          </div>

          {/* Status da Validação */}
          {validation && (
            <Alert className={validation.isConsistent ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'}>
              <div className="flex items-center gap-2">
                {validation.isConsistent ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                )}
                <span className="font-medium">
                  {validation.isConsistent ? 'Sistema Consistente' : 'Inconsistências Detectadas'}
                </span>
              </div>
              {!validation.isConsistent && (
                <AlertDescription className="mt-2">
                  <div className="space-y-2">
                    <div>
                      <strong>Problemas encontrados:</strong>
                      <ul className="list-disc list-inside ml-2 text-sm">
                        {validation.issues.map((issue, index) => (
                          <li key={index}>{issue}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <strong>Sugestões:</strong>
                      <ul className="list-disc list-inside ml-2 text-sm">
                        {validation.suggestions.map((suggestion, index) => (
                          <li key={index}>{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </AlertDescription>
              )}
            </Alert>
          )}

          {/* Resultado da Última Sincronização */}
          {lastSync && (
            <Card className="bg-gray-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  Última Sincronização
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-green-600">{lastSync.added}</div>
                    <div className="text-muted-foreground">Adicionados</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-blue-600">{lastSync.updated}</div>
                    <div className="text-muted-foreground">Atualizados</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-orange-600">{lastSync.inconsistencies.length}</div>
                    <div className="text-muted-foreground">Inconsistências</div>
                  </div>
                </div>
                
                {lastSync.inconsistencies.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="text-sm font-medium mb-2">Inconsistências:</div>
                    <div className="space-y-1">
                      {lastSync.inconsistencies.map((inc, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {inc}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Informações dos Menus */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Menus do Sistema
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Lista de todos os menus disponíveis no sidebar
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 max-h-60 overflow-y-auto">
            {menuSyncService.getSidebarMenus().map((menu) => (
              <div key={menu.key} className="flex items-center justify-between p-2 border rounded">
                <div>
                  <div className="font-medium text-sm">{menu.label}</div>
                  <div className="text-xs text-muted-foreground">{menu.description}</div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {menu.key}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MenuSyncManager;
