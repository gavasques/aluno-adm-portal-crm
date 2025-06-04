
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { runCORSDiagnostics, logCORSDiagnostics, type CORSDiagnostics } from '@/utils/cors-diagnostics';
import { toast } from 'sonner';

export const CORSTestPanel: React.FC = () => {
  const [diagnostics, setDiagnostics] = useState<CORSDiagnostics | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRunDiagnostics = async () => {
    setIsLoading(true);
    try {
      const result = await runCORSDiagnostics();
      setDiagnostics(result);
      
      // Também exibir no console
      await logCORSDiagnostics();
      
      if (result.corsError) {
        toast.error('Erro de CORS detectado!', {
          description: 'Verifique o console para mais detalhes'
        });
      } else if (result.canConnect) {
        toast.success('Conexão funcionando!');
      }
    } catch (error) {
      console.error('Erro ao executar diagnóstico:', error);
      toast.error('Erro ao executar diagnóstico');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: boolean, isError = false) => {
    if (isError) {
      return status ? <XCircle className="h-4 w-4 text-red-500" /> : <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    return status ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />;
  };

  const getStatusBadge = (status: boolean, isError = false) => {
    if (isError) {
      return (
        <Badge variant={status ? "destructive" : "default"}>
          {status ? "Erro" : "OK"}
        </Badge>
      );
    }
    return (
      <Badge variant={status ? "default" : "destructive"}>
        {status ? "OK" : "Erro"}
      </Badge>
    );
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Diagnóstico de CORS
        </CardTitle>
        <CardDescription>
          Teste a conectividade com o Supabase e diagnostique problemas de CORS
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Button 
            onClick={handleRunDiagnostics} 
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            {isLoading ? 'Executando...' : 'Executar Diagnóstico'}
          </Button>
          
          {diagnostics && (
            <div className="text-sm text-gray-600">
              Origem: {diagnostics.currentOrigin}
            </div>
          )}
        </div>

        {diagnostics && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm font-medium">Conexão</span>
                <div className="flex items-center gap-2">
                  {getStatusIcon(diagnostics.canConnect)}
                  {getStatusBadge(diagnostics.canConnect)}
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm font-medium">CORS</span>
                <div className="flex items-center gap-2">
                  {getStatusIcon(diagnostics.corsError, true)}
                  {getStatusBadge(diagnostics.corsError, true)}
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm font-medium">Autenticação</span>
                <div className="flex items-center gap-2">
                  {getStatusIcon(diagnostics.authWorking)}
                  {getStatusBadge(diagnostics.authWorking)}
                </div>
              </div>
            </div>

            {diagnostics.errors.length > 0 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="text-sm font-medium text-red-800 mb-2">Erros Encontrados:</h4>
                <ul className="text-sm text-red-700 space-y-1">
                  {diagnostics.errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}

            {diagnostics.recommendations.length > 0 && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="text-sm font-medium text-blue-800 mb-2">Recomendações:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  {diagnostics.recommendations.map((rec, index) => (
                    <li key={index}>• {rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-gray-500 mt-4">
          <p>💡 <strong>Dica:</strong> Se houver erros de CORS, verifique as configurações no dashboard do Supabase:</p>
          <p>Settings → API → CORS Origins</p>
          <p>Adicione: <code>https://lovable.dev</code> e <code>*.lovable.dev</code></p>
        </div>
      </CardContent>
    </Card>
  );
};
