
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, XCircle, RefreshCw, Wifi, WifiOff, Network, Activity } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ENVIRONMENT } from '@/config/cors';

interface CORSTestResult {
  test: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  details?: any;
}

export const EnhancedCORSTestPanel: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<CORSTestResult[]>([]);

  const runComprehensiveTests = async () => {
    setIsLoading(true);
    setTestResults([]);
    const results: CORSTestResult[] = [];

    try {
      console.log('🔍 [ENHANCED_CORS] Iniciando testes abrangentes...');

      // Teste 1: Configuração do ambiente
      results.push({
        test: 'Configuração do Ambiente',
        status: 'success',
        message: `Ambiente: ${ENVIRONMENT.isLovable() ? 'Lovable' : ENVIRONMENT.isDevelopment() ? 'Desenvolvimento' : 'Produção'}`,
        details: {
          origin: ENVIRONMENT.getOrigin(),
          hostname: window.location.hostname,
          allowedOrigins: ENVIRONMENT.getAllowedOrigins()
        }
      });

      // Teste 2: Conectividade básica com Supabase
      try {
        console.log('🔍 [ENHANCED_CORS] Testando conectividade básica...');
        const { data, error } = await supabase
          .from('profiles')
          .select('id')
          .limit(1);

        if (error) {
          throw error;
        }

        results.push({
          test: 'Conectividade Básica',
          status: 'success',
          message: 'Conexão com Supabase funcionando',
          details: { recordsFound: data?.length || 0 }
        });
      } catch (error: any) {
        results.push({
          test: 'Conectividade Básica',
          status: 'error',
          message: `Erro de conexão: ${error.message}`,
          details: { error: error.code || error.message }
        });
      }

      // Teste 3: Autenticação
      try {
        console.log('🔍 [ENHANCED_CORS] Testando autenticação...');
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }

        if (sessionData?.session) {
          results.push({
            test: 'Autenticação',
            status: 'success',
            message: 'Usuário autenticado',
            details: { 
              userId: sessionData.session.user.id,
              email: sessionData.session.user.email
            }
          });
        } else {
          results.push({
            test: 'Autenticação',
            status: 'warning',
            message: 'Nenhuma sessão ativa',
            details: { needsLogin: true }
          });
        }
      } catch (error: any) {
        results.push({
          test: 'Autenticação',
          status: 'error',
          message: `Erro de autenticação: ${error.message}`,
          details: { error: error.code || error.message }
        });
      }

      // Teste 4: Edge Functions - list-users
      try {
        console.log('🔍 [ENHANCED_CORS] Testando Edge Function list-users...');
        const { data, error } = await supabase.functions.invoke('list-users');
        
        if (error) {
          throw error;
        }

        results.push({
          test: 'Edge Function (list-users)',
          status: 'success',
          message: 'Edge function respondendo',
          details: { 
            usersCount: data?.users?.length || 0,
            hasData: !!data
          }
        });
      } catch (error: any) {
        results.push({
          test: 'Edge Function (list-users)',
          status: 'error',
          message: `Erro na Edge Function: ${error.message}`,
          details: { error: error.code || error.message }
        });
      }

      // Teste 5: Operações CRUD
      try {
        console.log('🔍 [ENHANCED_CORS] Testando operações CRUD...');
        
        // Teste SELECT
        const { data: selectData, error: selectError } = await supabase
          .from('crm_pipelines')
          .select('id, name')
          .limit(1);

        if (selectError) {
          throw new Error(`SELECT failed: ${selectError.message}`);
        }

        results.push({
          test: 'Operações CRUD',
          status: 'success',
          message: 'Operações de leitura funcionando',
          details: { 
            selectWorking: true,
            recordsFound: selectData?.length || 0
          }
        });
      } catch (error: any) {
        results.push({
          test: 'Operações CRUD',
          status: 'error',
          message: `Erro em operações CRUD: ${error.message}`,
          details: { error: error.message }
        });
      }

      // Teste 6: Real-time
      try {
        console.log('🔍 [ENHANCED_CORS] Testando Real-time...');
        
        const channel = supabase.channel('cors-test-channel');
        
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Timeout connecting to realtime'));
          }, 5000);

          channel
            .on('presence', { event: 'sync' }, () => {
              clearTimeout(timeout);
              resolve(true);
            })
            .subscribe((status) => {
              if (status === 'SUBSCRIBED') {
                clearTimeout(timeout);
                resolve(true);
              } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
                clearTimeout(timeout);
                reject(new Error(`Realtime status: ${status}`));
              }
            });
        });

        supabase.removeChannel(channel);

        results.push({
          test: 'Real-time',
          status: 'success',
          message: 'Conexão real-time funcionando',
          details: { realtimeWorking: true }
        });
      } catch (error: any) {
        results.push({
          test: 'Real-time',
          status: 'warning',
          message: `Real-time com problemas: ${error.message}`,
          details: { error: error.message }
        });
      }

      // Análise final
      const errorCount = results.filter(r => r.status === 'error').length;
      const warningCount = results.filter(r => r.status === 'warning').length;

      if (errorCount === 0 && warningCount === 0) {
        toast.success('Todos os testes passaram! CORS funcionando perfeitamente.');
      } else if (errorCount === 0) {
        toast.info(`Testes concluídos com ${warningCount} avisos.`);
      } else {
        toast.error(`Testes falharam: ${errorCount} erros, ${warningCount} avisos.`);
      }

    } catch (error: any) {
      console.error('Erro ao executar testes:', error);
      results.push({
        test: 'Erro Geral',
        status: 'error',
        message: `Erro inesperado: ${error.message}`,
        details: { error: error.message }
      });
      toast.error('Erro ao executar testes de CORS');
    } finally {
      setTestResults(results);
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: CORSTestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: CORSTestResult['status']) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800">Sucesso</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800">Aviso</Badge>;
      case 'error':
        return <Badge variant="destructive">Erro</Badge>;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="h-5 w-5" />
          Diagnóstico Avançado de CORS
        </CardTitle>
        <CardDescription>
          Testes abrangentes de conectividade, CORS e funcionalidades do Supabase
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Button 
            onClick={runComprehensiveTests} 
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Activity className="h-4 w-4" />
            )}
            {isLoading ? 'Executando Testes...' : 'Executar Testes Completos'}
          </Button>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            {ENVIRONMENT.isLovable() ? (
              <>
                <Wifi className="h-4 w-4 text-green-600" />
                <span>Ambiente Lovable</span>
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4 text-blue-600" />
                <span>Ambiente Local</span>
              </>
            )}
          </div>
        </div>

        {testResults.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Resultados dos Testes:</h4>
            
            {testResults.map((result, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(result.status)}
                  <div>
                    <span className="font-medium">{result.test}</span>
                    <p className="text-sm text-gray-600">{result.message}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(result.status)}
                  {result.details && (
                    <details className="text-xs">
                      <summary className="cursor-pointer text-blue-600">Detalhes</summary>
                      <pre className="mt-1 p-2 bg-gray-100 rounded text-xs">
                        {JSON.stringify(result.details, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            ))}
            
            {/* Resumo dos resultados */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <h5 className="font-medium mb-2">Resumo:</h5>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-green-600 font-bold text-lg">
                    {testResults.filter(r => r.status === 'success').length}
                  </div>
                  <div>Sucessos</div>
                </div>
                <div className="text-center">
                  <div className="text-yellow-600 font-bold text-lg">
                    {testResults.filter(r => r.status === 'warning').length}
                  </div>
                  <div>Avisos</div>
                </div>
                <div className="text-center">
                  <div className="text-red-600 font-bold text-lg">
                    {testResults.filter(r => r.status === 'error').length}
                  </div>
                  <div>Erros</div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500 mt-4 space-y-1">
          <p><strong>Origem atual:</strong> {ENVIRONMENT.getOrigin()}</p>
          <p><strong>Ambiente:</strong> {ENVIRONMENT.isLovable() ? 'Lovable' : ENVIRONMENT.isDevelopment() ? 'Desenvolvimento' : 'Produção'}</p>
          <p><strong>💡 Dica:</strong> Se houver erros de CORS, verifique as configurações no dashboard do Supabase:</p>
          <p>Settings → API → CORS Origins → Adicionar: <code>https://lovable.dev</code> e <code>*.lovable.dev</code></p>
        </div>
      </CardContent>
    </Card>
  );
};
