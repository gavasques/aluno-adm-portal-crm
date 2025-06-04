
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, XCircle, RefreshCw, ExternalLink, Settings } from 'lucide-react';
import { runCORSDiagnostics, logCORSDiagnostics, type CORSDiagnostics } from '@/utils/cors-diagnostics';
import { ENVIRONMENT, CORS_CONFIG } from '@/config/cors';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const EnhancedCORSTestPanel: React.FC = () => {
  const [diagnostics, setDiagnostics] = useState<CORSDiagnostics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionDetails, setConnectionDetails] = useState<any>(null);

  const currentOrigin = ENVIRONMENT.getOrigin();
  const isLovableEnv = ENVIRONMENT.isLovable();

  useEffect(() => {
    // Auto-run diagnostics on mount
    handleRunDiagnostics();
  }, []);

  const handleRunDiagnostics = async () => {
    setIsLoading(true);
    try {
      console.log('🔍 [ENHANCED_CORS_TEST] Iniciando diagnóstico completo...');
      
      // Teste completo de conectividade
      const tests = await Promise.allSettled([
        // Teste 1: Conectividade básica com database
        supabase.from('profiles').select('id').limit(1),
        
        // Teste 2: Verificar sessão de autenticação
        supabase.auth.getSession(),
        
        // Teste 3: Testar edge function list-users
        supabase.functions.invoke('list-users', {
          body: { test: true },
          headers: {
            'x-lovable-origin': currentOrigin,
            'x-application-name': 'crm-lead-management'
          }
        }),
        
        // Teste 4: Testar configuração CORS atual
        fetch(`${supabase.supabaseUrl}/rest/v1/profiles?select=id&limit=1`, {
          headers: {
            'apikey': supabase.supabaseKey,
            'x-lovable-origin': currentOrigin
          }
        })
      ]);

      const [dbTest, authTest, edgeFunctionTest, corsTest] = tests;
      
      const details = {
        dbTest: dbTest.status === 'fulfilled' && !dbTest.value.error,
        authTest: authTest.status === 'fulfilled' && !authTest.value.error,
        edgeFunctionTest: edgeFunctionTest.status === 'fulfilled' && !edgeFunctionTest.value.error,
        corsTest: corsTest.status === 'fulfilled' && corsTest.value.ok,
        environment: {
          isLovable: isLovableEnv,
          origin: currentOrigin,
          hostname: window.location.hostname,
          allowedOrigins: CORS_CONFIG.allowedOrigins,
          isOriginAllowed: CORS_CONFIG.isOriginAllowed(currentOrigin)
        },
        errors: []
      };

      // Coletar erros detalhados
      if (dbTest.status === 'rejected') details.errors.push(`DB: ${dbTest.reason}`);
      if (authTest.status === 'rejected') details.errors.push(`Auth: ${authTest.reason}`);
      if (edgeFunctionTest.status === 'rejected') details.errors.push(`Edge Function: ${edgeFunctionTest.reason}`);
      if (corsTest.status === 'rejected') details.errors.push(`CORS: ${corsTest.reason}`);

      setConnectionDetails(details);
      
      // Executar diagnóstico original também
      const result = await runCORSDiagnostics();
      setDiagnostics(result);
      
      // Log completo no console
      await logCORSDiagnostics();
      
      // Feedback baseado nos resultados
      if (details.dbTest && details.authTest) {
        toast.success('✅ Conectividade básica funcionando!');
      } else if (!details.environment.isOriginAllowed) {
        toast.error('❌ Origem não permitida na configuração CORS');
      } else {
        toast.warning('⚠️ Alguns testes falharam - veja detalhes');
      }
      
    } catch (error) {
      console.error('❌ [ENHANCED_CORS_TEST] Erro ao executar diagnóstico:', error);
      toast.error('Erro ao executar diagnóstico');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestEdgeFunction = async () => {
    setIsLoading(true);
    try {
      console.log('🧪 [ENHANCED_CORS_TEST] Testando edge function específica...');
      
      const { data, error } = await supabase.functions.invoke('list-users', {
        body: { action: 'test' },
        headers: {
          'x-lovable-origin': currentOrigin,
          'x-application-name': 'crm-lead-management'
        }
      });
      
      if (error) {
        console.error('❌ [ENHANCED_CORS_TEST] Erro na edge function:', error);
        toast.error(`Edge Function falhou: ${error.message}`);
      } else {
        console.log('✅ [ENHANCED_CORS_TEST] Edge function funcionando:', data);
        toast.success('✅ Edge Function funcionando!');
      }
    } catch (error: any) {
      console.error('❌ [ENHANCED_CORS_TEST] Erro no teste da edge function:', error);
      toast.error(`Teste falhou: ${error.message}`);
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
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Diagnóstico Avançado de CORS e Conectividade
        </CardTitle>
        <CardDescription>
          Teste completo da conectividade com Supabase e diagnóstico de problemas de CORS
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Informações do Ambiente */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
          <div>
            <h4 className="font-medium text-blue-900">Ambiente Atual</h4>
            <p className="text-sm text-blue-700">Origem: <code className="bg-blue-100 px-1 rounded">{currentOrigin}</code></p>
            <p className="text-sm text-blue-700">Lovable: {isLovableEnv ? '✅ Sim' : '❌ Não'}</p>
          </div>
          <div>
            <h4 className="font-medium text-blue-900">Configuração CORS</h4>
            <p className="text-sm text-blue-700">
              Origem Permitida: {connectionDetails?.environment?.isOriginAllowed ? '✅ Sim' : '❌ Não'}
            </p>
            <p className="text-sm text-blue-700">
              Origins Configurados: {CORS_CONFIG.allowedOrigins.length} domínios
            </p>
          </div>
        </div>

        {/* Controles */}
        <div className="flex items-center gap-4 flex-wrap">
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
            {isLoading ? 'Executando...' : 'Executar Testes Completos'}
          </Button>
          
          <Button 
            variant="outline"
            onClick={handleTestEdgeFunction} 
            disabled={isLoading}
          >
            Testar Edge Function
          </Button>

          {isLovableEnv && (
            <Button 
              variant="outline"
              onClick={() => window.open('https://supabase.com/dashboard/project/qflmguzmticupqtnlirf/settings/api', '_blank')}
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Abrir Dashboard Supabase
            </Button>
          )}
        </div>

        {/* Resultados dos Testes */}
        {connectionDetails && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Resultados dos Testes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm font-medium">Database</span>
                <div className="flex items-center gap-2">
                  {getStatusIcon(connectionDetails.dbTest)}
                  {getStatusBadge(connectionDetails.dbTest)}
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm font-medium">Autenticação</span>
                <div className="flex items-center gap-2">
                  {getStatusIcon(connectionDetails.authTest)}
                  {getStatusBadge(connectionDetails.authTest)}
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm font-medium">Edge Function</span>
                <div className="flex items-center gap-2">
                  {getStatusIcon(connectionDetails.edgeFunctionTest)}
                  {getStatusBadge(connectionDetails.edgeFunctionTest)}
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm font-medium">CORS Direto</span>
                <div className="flex items-center gap-2">
                  {getStatusIcon(connectionDetails.corsTest)}
                  {getStatusBadge(connectionDetails.corsTest)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Diagnóstico Original */}
        {diagnostics && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Diagnóstico Detalhado</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm font-medium">Conexão Geral</span>
                <div className="flex items-center gap-2">
                  {getStatusIcon(diagnostics.canConnect)}
                  {getStatusBadge(diagnostics.canConnect)}
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm font-medium">Erro CORS</span>
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
          </div>
        )}

        {/* Erros Detalhados */}
        {connectionDetails?.errors && connectionDetails.errors.length > 0 && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="text-sm font-medium text-red-800 mb-2">Erros Detalhados:</h4>
            <ul className="text-sm text-red-700 space-y-1">
              {connectionDetails.errors.map((error: string, index: number) => (
                <li key={index} className="font-mono text-xs">• {error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Configuração Necessária */}
        {isLovableEnv && (!connectionDetails?.environment?.isOriginAllowed || connectionDetails?.errors?.length > 0) && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Settings className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-800">⚠️ Configuração CORS Necessária</p>
                <p className="text-yellow-700 mt-2">
                  Para resolver os problemas detectados, configure no Supabase Dashboard:
                </p>
                <div className="mt-2 p-2 bg-yellow-100 rounded text-yellow-800 font-mono text-xs">
                  Settings → API → CORS Origins
                </div>
                <p className="text-yellow-700 mt-2">Adicionar estes domínios:</p>
                <ul className="mt-1 space-y-1">
                  {CORS_CONFIG.allowedOrigins.map((origin, index) => (
                    <li key={index} className="font-mono text-xs text-yellow-800">
                      • <code className="bg-yellow-100 px-1 rounded">{origin}</code>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Status de Sucesso */}
        {connectionDetails?.dbTest && connectionDetails?.authTest && connectionDetails?.environment?.isOriginAllowed && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">✅ Conectividade OK!</p>
                <p className="text-green-700 text-sm mt-1">
                  Todos os testes principais passaram. O sistema está funcionando corretamente.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
