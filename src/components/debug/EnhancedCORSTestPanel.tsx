
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, XCircle, RefreshCw, Globe, Database, Key, Wifi } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { ENVIRONMENT } from '@/config/cors';
import { toast } from 'sonner';

interface CORSTestResult {
  test: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  details?: string;
}

export const EnhancedCORSTestPanel: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<CORSTestResult[]>([]);

  const runComprehensiveTests = async () => {
    setIsRunning(true);
    setResults([]);
    const newResults: CORSTestResult[] = [];

    try {
      // Test 1: Basic connectivity
      console.log('🔍 [CORS_TEST] Teste 1: Conectividade básica');
      try {
        const { data, error } = await supabase.from('profiles').select('id').limit(1);
        if (error) {
          newResults.push({
            test: 'Conectividade Básica',
            status: 'error',
            message: 'Falha na conexão com o banco',
            details: error.message
          });
        } else {
          newResults.push({
            test: 'Conectividade Básica',
            status: 'success',
            message: 'Conexão com banco funcionando',
            details: `${data?.length || 0} registros acessíveis`
          });
        }
      } catch (error: any) {
        newResults.push({
          test: 'Conectividade Básica',
          status: 'error',
          message: 'Erro de rede ou CORS',
          details: error.message
        });
      }

      // Test 2: Authentication
      console.log('🔍 [CORS_TEST] Teste 2: Autenticação');
      try {
        const { data: session, error } = await supabase.auth.getSession();
        if (error) {
          newResults.push({
            test: 'Autenticação',
            status: 'error',
            message: 'Erro ao verificar sessão',
            details: error.message
          });
        } else if (session.session) {
          newResults.push({
            test: 'Autenticação',
            status: 'success',
            message: 'Usuário autenticado',
            details: `Email: ${session.session.user.email}`
          });
        } else {
          newResults.push({
            test: 'Autenticação',
            status: 'warning',
            message: 'Usuário não autenticado',
            details: 'Faça login para acessar recursos protegidos'
          });
        }
      } catch (error: any) {
        newResults.push({
          test: 'Autenticação',
          status: 'error',
          message: 'Falha na verificação de autenticação',
          details: error.message
        });
      }

      // Test 3: Edge Functions
      console.log('🔍 [CORS_TEST] Teste 3: Edge Functions');
      try {
        const { data, error } = await supabase.functions.invoke('list-users', {
          method: 'GET'
        });
        
        if (error) {
          newResults.push({
            test: 'Edge Functions',
            status: 'error',
            message: 'Falha na chamada da edge function',
            details: error.message
          });
        } else {
          newResults.push({
            test: 'Edge Functions',
            status: 'success',
            message: 'Edge function respondeu',
            details: 'Comunicação com serverless funcionando'
          });
        }
      } catch (error: any) {
        newResults.push({
          test: 'Edge Functions',
          status: 'error',
          message: 'Erro ao chamar edge function',
          details: error.message
        });
      }

      // Test 4: Environment detection
      console.log('🔍 [CORS_TEST] Teste 4: Detecção de ambiente');
      const isLovable = ENVIRONMENT.isLovable();
      const currentOrigin = ENVIRONMENT.getOrigin();
      
      newResults.push({
        test: 'Ambiente',
        status: isLovable ? 'success' : 'warning',
        message: isLovable ? 'Ambiente Lovable detectado' : 'Ambiente local/externo',
        details: `Origin: ${currentOrigin}`
      });

      setResults(newResults);
      
      // Summary toast
      const errorCount = newResults.filter(r => r.status === 'error').length;
      const successCount = newResults.filter(r => r.status === 'success').length;
      
      if (errorCount === 0) {
        toast.success(`Todos os testes passaram! (${successCount}/${newResults.length})`);
      } else {
        toast.error(`${errorCount} teste(s) falharam de ${newResults.length} total`);
      }

    } catch (error: any) {
      console.error('❌ [CORS_TEST] Erro geral nos testes:', error);
      newResults.push({
        test: 'Sistema',
        status: 'error',
        message: 'Erro crítico no sistema de testes',
        details: error.message
      });
      setResults(newResults);
      toast.error('Erro crítico nos testes de CORS');
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: CORSTestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: CORSTestResult['status']) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800 border-green-200">OK</Badge>;
      case 'error':
        return <Badge variant="destructive">Erro</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Aviso</Badge>;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Diagnóstico de Conectividade
        </CardTitle>
        <CardDescription>
          Testes de conectividade, autenticação e edge functions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Info do ambiente */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-blue-500" />
            <div className="text-sm">
              <div className="font-medium">Ambiente</div>
              <div className="text-gray-600">
                {ENVIRONMENT.isLovable() ? 'Lovable' : 'Local'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-green-500" />
            <div className="text-sm">
              <div className="font-medium">Supabase</div>
              <div className="text-gray-600">Conectado</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Key className="h-4 w-4 text-purple-500" />
            <div className="text-sm">
              <div className="font-medium">Auth</div>
              <div className="text-gray-600">PKCE</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Wifi className="h-4 w-4 text-orange-500" />
            <div className="text-sm">
              <div className="font-medium">Origin</div>
              <div className="text-gray-600 text-xs">{ENVIRONMENT.getOrigin()}</div>
            </div>
          </div>
        </div>

        {/* Botão de teste */}
        <div className="flex items-center gap-4">
          <Button 
            onClick={runComprehensiveTests} 
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            {isRunning ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            {isRunning ? 'Executando Testes...' : 'Executar Testes'}
          </Button>
        </div>

        {/* Resultados */}
        {results.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Resultados dos Testes</h3>
            <div className="space-y-2">
              {results.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(result.status)}
                    <div>
                      <div className="font-medium">{result.test}</div>
                      <div className="text-sm text-gray-600">{result.message}</div>
                      {result.details && (
                        <div className="text-xs text-gray-500 mt-1">{result.details}</div>
                      )}
                    </div>
                  </div>
                  {getStatusBadge(result.status)}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
