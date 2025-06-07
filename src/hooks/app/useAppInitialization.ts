
import { useEffect } from 'react';

export const useAppInitialization = () => {
  useEffect(() => {
    console.log('🚀 App: Inicialização simples...');
    
    // Inicialização mínima sem verificações agressivas
    try {
      // Log básico de inicialização
      console.log('✅ App inicializado com sucesso');
    } catch (error) {
      console.warn('⚠️ Aviso na inicialização:', error);
    }
  }, []);
};
