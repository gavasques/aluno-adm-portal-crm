
import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { X, AlertTriangle, RefreshCw } from 'lucide-react';

export const BlockingDetectionBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Banner muito conservador - só mostrar em casos extremos
    const waseDismissed = localStorage.getItem('blocking_banner_dismissed') === 'true';
    if (waseDismissed) {
      return;
    }

    // Só verificar após muito tempo e apenas se houver evidência real
    const checkTimer = setTimeout(() => {
      try {
        const hasRealBlocking = window.location.href.includes('ERR_BLOCKED_BY_CLIENT') ||
                               document.querySelector('[data-adblock-key]') !== null;
        
        if (hasRealBlocking) {
          setShowBanner(true);
        }
      } catch (error) {
        // Ignorar erros de verificação
      }
    }, 15000); // Aguardar 15 segundos

    return () => clearTimeout(checkTimer);
  }, []);

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('blocking_banner_dismissed', 'true');
  };

  const handleReload = () => {
    localStorage.removeItem('blocking_banner_dismissed');
    window.location.reload();
  };

  if (!showBanner) {
    return null;
  }

  return (
    <Alert className="fixed top-4 left-4 right-4 z-50 border-orange-200 bg-orange-50">
      <AlertTriangle className="h-4 w-4 text-orange-600" />
      <AlertDescription className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <strong className="text-orange-800">Possível bloqueio detectado</strong>
            <p className="text-sm text-orange-700 mt-1">
              Se a aplicação não estiver funcionando, tente desativar extensões de bloqueio.
            </p>
          </div>
          <div className="flex gap-2 ml-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleReload}
              className="text-orange-700 border-orange-300 hover:bg-orange-100"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Recarregar
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleDismiss}
              className="text-orange-700 hover:bg-orange-100"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
};
