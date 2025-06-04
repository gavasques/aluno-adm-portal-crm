
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, XCircle, RefreshCw, Settings, Copy, ExternalLink } from 'lucide-react';
import { runCORSDiagnostics, logCORSDiagnostics, type CORSDiagnostics } from '@/utils/cors-diagnostics';
import { toast } from 'sonner';
import { ENVIRONMENT } from '@/config/cors';

export const EnhancedCORSTestPanel: React.FC = () => {
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
          description: 'Verifique as configurações no Dashboard do Supabase'
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado para área de transferência');
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

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const isLovable = ENVIRONMENT.isLovable();

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Diagnóstico Avançado de CORS
        </CardTitle>
        <CardDescription>
          Testes abrangentes de conectividade, CORS e funcionalidades do Supabase
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Informações do ambiente */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 mb-3 flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Ambiente Local
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="font-medium">Origem atual:</span>
              <div className="flex items-center gap-2">
                <code className="bg-white px-2 py-1 rounded text-xs">{currentOrigin}</code>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => copyToClipboard(currentOrigin)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Ambiente:</span>
              <Badge variant={isLovable ? "default" : "secondary"}>
                {isLovable ? 'Produção' : 'Desenvolvimento'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Configuração necessária */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-medium text-yellow-800 mb-3">⚠️ Configuração Necessária no Supabase</h4>
          <div className="space-y-3 text-sm text-yellow-700">
            <p>Se houver erros de CORS, verifique as configurações no dashboard do Supabase:</p>
            
            <div className="bg-white rounded p-3 border">
              <p className="font-medium mb-2">Settings → API → CORS Origins → Adicionar:</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <code className="text-xs">https://lovable.dev</code>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => copyToClipboard('https://lovable.dev')}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <code className="text-xs">*.lovable.dev</code>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => copyToClipboard('*.lovable.dev')}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                {isLovable && (
                  <div className="flex items-center justify-between">
                    <code className="text-xs">{currentOrigin}</code>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => copyToClipboard(currentOrigin)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 mt-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.open('https://supabase.com/dashboard/project/qflmguzmticupqtnlirf/settings/api', '_blank')}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Abrir Dashboard Supabase
              </Button>
            </div>
          </div>
        </div>

        {/* Botão de teste */}
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
            Executar Testes Completos
          </Button>
          
          {diagnostics && (
            <div className="text-sm text-gray-600">
              Última execução: {new Date().toLocaleTimeString()}
            </div>
          )}
        </div>

        {diagnostics && (
          <div className="space-y-4">
            {/* Status cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-4 border rounded-lg bg-white">
                <div>
                  <span className="text-sm font-medium">Conectividade</span>
                  <p className="text-xs text-gray-500">Acesso ao Supabase</p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(diagnostics.canConnect)}
                  {getStatusBadge(diagnostics.canConnect)}
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg bg-white">
                <div>
                  <span className="text-sm font-medium">CORS</span>
                  <p className="text-xs text-gray-500">Políticas de origem</p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(diagnostics.corsError, true)}
                  {getStatusBadge(diagnostics.corsError, true)}
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg bg-white">
                <div>
                  <span className="text-sm font-medium">Autenticação</span>
                  <p className="text-xs text-gray-500">Sessão do usuário</p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(diagnostics.authWorking)}
                  {getStatusBadge(diagnostics.authWorking)}
                </div>
              </div>
            </div>

            {/* Erros encontrados */}
            {diagnostics.errors.length > 0 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="text-sm font-medium text-red-800 mb-3 flex items-center gap-2">
                  <XCircle className="h-4 w-4" />
                  Erros Encontrados
                </h4>
                <ul className="text-sm text-red-700 space-y-2">
                  {diagnostics.errors.map((error, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-red-500 font-bold">•</span>
                      <span>{error}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recomendações */}
            {diagnostics.recommendations.length > 0 && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="text-sm font-medium text-blue-800 mb-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Recomendações
                </h4>
                <ul className="text-sm text-blue-700 space-y-2">
                  {diagnostics.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Sucesso */}
            {diagnostics.canConnect && !diagnostics.corsError && diagnostics.authWorking && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="text-sm font-medium text-green-800 mb-2 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  ✅ Todos os testes passaram!
                </h4>
                <p className="text-sm text-green-700">
                  A conectividade com o Supabase está funcionando corretamente.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Dicas adicionais */}
        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded border">
          <p className="font-medium mb-1">💡 Dicas de troubleshooting:</p>
          <ul className="space-y-1">
            <li>• Verifique se os domínios foram adicionados exatamente como mostrado acima</li>
            <li>• Após alterar as configurações do Supabase, aguarde alguns minutos</li>
            <li>• Limpe o cache do navegador se os problemas persistirem</li>
            <li>• Use o console do navegador (F12) para ver erros detalhados</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
