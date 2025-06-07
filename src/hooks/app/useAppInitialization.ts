
import { useEffect } from 'react';
import { ResourceBlockingDetector } from '@/utils/resourceBlockingDetector';

export const useAppInitialization = () => {
  useEffect(() => {
    console.log('🚀 App: Iniciando aplicação...');
    
    // Verificar bloqueios após carregamento, mas de forma menos agressiva
    const blockingCheckTimer = setTimeout(() => {
      try {
        const result = ResourceBlockingDetector.detectBlocking();
        if (result.isBlocked) {
          console.warn('🚫 Bloqueio detectado:', result);
          ResourceBlockingDetector.createFallbackMode();
        }
      } catch (error) {
        console.warn('⚠️ Erro ao verificar bloqueios:', error);
      }
    }, 3000);

    return () => clearTimeout(blockingCheckTimer);
  }, []);
};
