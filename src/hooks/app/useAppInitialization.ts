
import { useEffect } from 'react';
import { ResourceBlockingDetector } from '@/utils/resourceBlockingDetector';
import { runCORSDiagnostics } from '@/utils/cors-diagnostics';

export const useAppInitialization = () => {
  useEffect(() => {
    const initializeDiagnostics = async () => {
      console.log('🔍 App: Executando diagnósticos CORS...');
      
      // Interceptar erros de console para detectar bloqueios
      const originalConsoleError = console.error;
      console.error = (...args) => {
        if (args.some(arg => 
          typeof arg === 'string' && 
          (arg.includes('ERR_BLOCKED_BY_CLIENT') || arg.includes('net::ERR_BLOCKED_BY_CLIENT'))
        )) {
          console.warn('⚠️ App: Detectado bloqueio de recursos por extensão do navegador');
          ResourceBlockingDetector.createFallbackMode();
        }
        originalConsoleError.apply(console, args);
      };

      // Executar diagnósticos CORS
      try {
        await runCORSDiagnostics();
      } catch (error) {
        console.error('❌ App: Erro ao executar diagnósticos CORS:', error);
      }
    };

    initializeDiagnostics();

    // Verificar bloqueios após carregamento
    const blockingCheckTimer = setTimeout(() => {
      const result = ResourceBlockingDetector.detectBlocking();
      if (result.isBlocked) {
        console.warn('🚫 Bloqueio detectado:', result);
      }
    }, 2000);

    return () => clearTimeout(blockingCheckTimer);
  }, []);
};
