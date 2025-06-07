
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface RobustAuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  isInitialized: boolean;
}

export const useRobustAuth = () => {
  const [authState, setAuthState] = useState<RobustAuthState>({
    user: null,
    session: null,
    loading: true,
    error: null,
    isInitialized: false
  });

  useEffect(() => {
    console.log('🔐 Inicializando autenticação robusta...');
    
    let mounted = true;
    let subscription: any;

    const initializeAuth = async () => {
      try {
        // Configurar listener primeiro
        const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            if (!mounted) return;
            
            console.log('🔄 Auth state change:', event, { hasSession: !!session });
            
            setAuthState({
              user: session?.user || null,
              session: session || null,
              loading: false,
              error: null,
              isInitialized: true
            });
          }
        );
        subscription = authSubscription;

        // Verificar sessão inicial
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (error) {
          console.error('❌ Erro ao obter sessão:', error);
          setAuthState(prev => ({
            ...prev,
            loading: false,
            error: error.message,
            isInitialized: true
          }));
          return;
        }

        console.log('✅ Sessão inicial obtida:', { hasSession: !!session });

        setAuthState({
          user: session?.user || null,
          session: session || null,
          loading: false,
          error: null,
          isInitialized: true
        });

      } catch (error: any) {
        console.error('❌ Erro na inicialização auth:', error);
        if (mounted) {
          setAuthState(prev => ({
            ...prev,
            loading: false,
            error: 'Erro na inicialização da autenticação',
            isInitialized: true
          }));
        }
      }
    };

    // Timeout de emergência
    const emergencyTimeout = setTimeout(() => {
      if (mounted && !authState.isInitialized) {
        console.warn('⚠️ Timeout de emergência na autenticação');
        setAuthState(prev => ({
          ...prev,
          loading: false,
          isInitialized: true
        }));
      }
    }, 5000);

    initializeAuth();

    return () => {
      mounted = false;
      if (subscription) {
        subscription.unsubscribe();
      }
      clearTimeout(emergencyTimeout);
    };
  }, []);

  return {
    user: authState.user,
    session: authState.session,
    loading: authState.loading,
    error: authState.error,
    isInitialized: authState.isInitialized,
    retryCount: 0
  };
};
