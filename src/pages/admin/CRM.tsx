
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CRMDashboard from '@/components/admin/crm/enhanced/CRMDashboard';
import { UnifiedCRMProvider } from '@/providers/CRMProvider';
import { EnhancedCORSTestPanel } from '@/components/debug/EnhancedCORSTestPanel';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Wifi, WifiOff, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { ENVIRONMENT } from '@/config/cors';

const CRM = () => {
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [connectionDetails, setConnectionDetails] = useState<any>(null);

  // Verificar conectividade na montagem do componente
  useEffect(() => {
    const checkConnection = async () => {
      try {
        console.log('🔍 [CRM_PAGE] Verificando conectividade avançada...');
        
        // Teste múltiplo para garantir conectividade
        const tests = await Promise.allSettled([
          // Teste 1: Conectividade básica
          supabase.from('profiles').select('id').limit(1),
          
          // Teste 2: Verificar sessão
          supabase.auth.getSession(),
          
          // Teste 3: Testar edge function
          supabase.functions.invoke('list-users').catch(e => ({ error: e }))
        ]);

        const [profileTest, sessionTest, edgeFunctionTest] = tests;
        
        const details = {
          profileTest: profileTest.status === 'fulfilled' && !profileTest.value.error,
          sessionTest: sessionTest.status === 'fulfilled' && !sessionTest.value.error,
          edgeFunctionTest: edgeFunctionTest.status === 'fulfilled' && !edgeFunctionTest.value.error,
          environment: {
            isLovable: ENVIRONMENT.isLovable(),
            origin: ENVIRONMENT.getOrigin(),
            hostname: window.location.hostname
          }
        };

        setConnectionDetails(details);
        
        // Considerar conectado se pelo menos os testes básicos passaram
        if (details.profileTest && details.sessionTest) {
          setConnectionStatus('connected');
          console.log('✅ [CRM_PAGE] Conectividade OK');
        } else {
          setConnectionStatus('error');
          console.log('❌ [CRM_PAGE] Problemas de conectividade detectados', details);
          setShowDiagnostics(true);
        }
      } catch (error) {
        console.error('❌ [CRM_PAGE] Erro ao verificar conectividade:', error);
        setConnectionStatus('error');
        setShowDiagnostics(true);
      }
    };

    checkConnection();
  }, []);

  const handleOpenLead = (leadId: string) => {
    setSelectedLeadId(leadId);
  };

  const handleRetryConnection = async () => {
    setConnectionStatus('checking');
    setShowDiagnostics(false);
    
    // Aguardar um pouco antes de tentar novamente
    setTimeout(async () => {
      try {
        const { data, error } = await supabase.from('profiles').select('id').limit(1);
        if (!error) {
          setConnectionStatus('connected');
        } else {
          setConnectionStatus('error');
          setShowDiagnostics(true);
        }
      } catch (error) {
        setConnectionStatus('error');
        setShowDiagnostics(true);
      }
    }, 1000);
  };

  // Renderizar interface de erro se houver problemas de conectividade críticos
  if (connectionStatus === 'error' && !connectionDetails?.profileTest) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-gray-100">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl w-full space-y-6"
        >
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <WifiOff className="h-6 w-6 text-red-600" />
                <h2 className="text-lg font-semibold text-red-800">
                  Problema Crítico de Conectividade
                </h2>
              </div>
              <p className="text-red-700 mb-4">
                Não foi possível conectar com o Supabase. Isso pode ser um problema de CORS, 
                configuração de rede ou autenticação.
              </p>
              
              {connectionDetails && (
                <div className="mb-4 p-3 bg-white rounded border text-sm">
                  <h4 className="font-medium mb-2">Detalhes dos Testes:</h4>
                  <ul className="space-y-1">
                    <li className={`flex items-center gap-2 ${connectionDetails.profileTest ? 'text-green-700' : 'text-red-700'}`}>
                      {connectionDetails.profileTest ? <CheckCircle className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                      Conectividade com banco: {connectionDetails.profileTest ? 'OK' : 'Falhou'}
                    </li>
                    <li className={`flex items-center gap-2 ${connectionDetails.sessionTest ? 'text-green-700' : 'text-red-700'}`}>
                      {connectionDetails.sessionTest ? <CheckCircle className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                      Autenticação: {connectionDetails.sessionTest ? 'OK' : 'Falhou'}
                    </li>
                    <li className={`flex items-center gap-2 ${connectionDetails.edgeFunctionTest ? 'text-green-700' : 'text-yellow-700'}`}>
                      {connectionDetails.edgeFunctionTest ? <CheckCircle className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                      Edge Functions: {connectionDetails.edgeFunctionTest ? 'OK' : 'Com problemas'}
                    </li>
                  </ul>
                </div>
              )}
              
              <div className="flex gap-3">
                <Button onClick={handleRetryConnection} variant="outline">
                  Tentar Novamente
                </Button>
                <Button 
                  onClick={() => setShowDiagnostics(!showDiagnostics)} 
                  variant="secondary"
                >
                  {showDiagnostics ? 'Ocultar' : 'Mostrar'} Diagnóstico Avançado
                </Button>
              </div>
            </CardContent>
          </Card>

          {showDiagnostics && <EnhancedCORSTestPanel />}
        </motion.div>
      </div>
    );
  }

  // Renderizar loading enquanto verifica conectividade
  if (connectionStatus === 'checking') {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-3"
        >
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="rounded-full h-8 w-8 border-b-2 border-blue-600"
          />
          <span className="text-gray-600">Verificando conectividade avançada...</span>
        </motion.div>
      </div>
    );
  }

  // Renderizar CRM normal se tudo estiver OK
  return (
    <UnifiedCRMProvider>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="h-full w-full relative"
      >
        {/* Indicador de status de conectividade aprimorado */}
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border">
          <Wifi className="h-4 w-4 text-green-600" />
          <span className="text-sm text-green-700 font-medium">Conectado</span>
          {connectionDetails && !connectionDetails.edgeFunctionTest && (
            <AlertTriangle className="h-3 w-3 text-yellow-500" title="Edge Functions com problemas" />
          )}
        </div>

        {/* Botão de diagnóstico rápido */}
        {ENVIRONMENT.isLovable() && (
          <div className="fixed bottom-4 right-4 z-50">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDiagnostics(!showDiagnostics)}
              className="bg-white/90 backdrop-blur-sm"
            >
              Diagnóstico CORS
            </Button>
          </div>
        )}

        {showDiagnostics && (
          <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-semibold">Diagnóstico CORS</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowDiagnostics(false)}>
                  ✕
                </Button>
              </div>
              <div className="p-4">
                <EnhancedCORSTestPanel />
              </div>
            </div>
          </div>
        )}

        <CRMDashboard onOpenLead={handleOpenLead} />
      </motion.div>
    </UnifiedCRMProvider>
  );
};

export default CRM;
