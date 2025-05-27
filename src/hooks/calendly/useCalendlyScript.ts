
import { useState, useEffect } from 'react';

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (options: any) => void;
      closePopupWidget: () => void;
    };
  }
}

export const useCalendlyScript = () => {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadCalendlyScript = () => {
      return new Promise<void>((resolve, reject) => {
        if (window.Calendly) {
          setScriptLoaded(true);
          resolve();
          return;
        }

        console.log('📦 Carregando script do Calendly...');
        const script = document.createElement('script');
        script.src = 'https://assets.calendly.com/assets/external/widget.js';
        script.async = true;
        
        const timeout = setTimeout(() => {
          reject(new Error('Timeout ao carregar script do Calendly'));
        }, 10000);

        script.onload = () => {
          clearTimeout(timeout);
          console.log('✅ Script do Calendly carregado com sucesso');
          setScriptLoaded(true);
          resolve();
        };
        
        script.onerror = () => {
          clearTimeout(timeout);
          reject(new Error('Falha ao carregar script do Calendly'));
        };
        
        document.head.appendChild(script);
      });
    };

    loadCalendlyScript().catch((err) => {
      console.error('❌ Erro ao carregar script do Calendly:', err);
      setError('Erro ao carregar o Calendly. Verifique sua conexão com a internet.');
    });
  }, []);

  return { scriptLoaded, error };
};
