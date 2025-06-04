
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CRMDashboard from '@/components/admin/crm/enhanced/CRMDashboard';
import { UnifiedCRMProvider } from '@/providers/CRMProvider';
import { CORSDebugSection } from '@/components/admin/dashboard/CORSDebugSection';
import { runCORSDiagnostics } from '@/utils/cors-diagnostics';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CRM = () => {
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  // Verificar conectividade na montagem do componente
  useEffect(() => {
    const checkConnection = async () => {
      try {
        console.log('🔍 [CRM_PAGE] Verificando conectividade inicial...');
        const diagnostics = await runCORSDiagnostics();
        
        if (diagnostics.canConnect && !diagnostics.corsError) {
          setConnectionStatus('connected');
          console.log('✅ [CRM_PAGE] Conectividade OK');
        } else {
          setConnectionStatus('error');
          console.log('❌ [CRM_PAGE] Problemas de conectividade detectados');
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
        const diagnostics = await runCORSDiagnostics();
        if (diagnostics.canConnect && !diagnostics.corsError) {
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

  // Renderizar interface de erro se houver problemas de conectividade
  if (connectionStatus === 'error') {
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
                  Problema de Conectividade Detectado
                </h2>
              </div>
              <p className="text-red-700 mb-4">
                Não foi possível conectar com o servidor. Isso pode ser um problema de CORS 
                ou configuração de rede.
              </p>
              <div className="flex gap-3">
                <Button onClick={handleRetryConnection} variant="outline">
                  Tentar Novamente
                </Button>
                <Button 
                  onClick={() => setShowDiagnostics(!showDiagnostics)} 
                  variant="secondary"
                >
                  {showDiagnostics ? 'Ocultar' : 'Mostrar'} Diagnóstico
                </Button>
              </div>
            </CardContent>
          </Card>

          {showDiagnostics && <CORSDebugSection />}
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
          <span className="text-gray-600">Verificando conectividade...</span>
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
        {/* Indicador de status de conectividade */}
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border">
          <Wifi className="h-4 w-4 text-green-600" />
          <span className="text-sm text-green-700 font-medium">Conectado</span>
        </div>

        <CRMDashboard onOpenLead={handleOpenLead} />
      </motion.div>
    </UnifiedCRMProvider>
  );
};

export default CRM;
