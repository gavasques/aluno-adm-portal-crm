
import React, { useState, useEffect } from 'react';
import { ResourceBlockingDetector } from '@/utils/resourceBlockingDetector';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { X, AlertTriangle, RefreshCw } from 'lucide-react';

export const BlockingDetectionBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [blockingResult, setBlockingResult] = useState<any>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Verificar bloqueios após um delay
    const checkTimer = setTimeout(() => {
      const result = ResourceBlockingDetector.detectBlocking();
      setBlockingResult(result);
      
      if (result.isBlocked && !dismissed) {
        setShowBanner(true);
      }
    }, 3000);

    return () => clearTimeout(checkTimer);
  }, [dismissed]);

  const handleDismiss = () => {
    setShowBanner(false);
    setDismissed(true);
    localStorage.setItem('blocking_banner_dismissed', 'true');
  };

  const handleReload = () => {
    window.location.reload();
  };

  if (!showBanner || !blockingResult?.isBlocked) {
    return null;
  }

  return (
    <Alert className="fixed top-4 left-4 right-4 z-50 border-orange-200 bg-orange-50">
      <AlertTriangle className="h-4 w-4 text-orange-600" />
      <AlertDescription className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <strong className="text-orange-800">Recursos bloqueados detectados</strong>
            <p className="text-sm text-orange-700 mt-1">
              Extensões do navegador podem estar interferindo. Sugestões:
            </p>
            <ul className="text-xs text-orange-600 mt-1 ml-4">
              {blockingResult.suggestions.map((suggestion: string, index: number) => (
                <li key={index}>• {suggestion}</li>
              ))}
            </ul>
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
