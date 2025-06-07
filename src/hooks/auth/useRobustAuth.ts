
import { useState, useEffect, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { ResourceBlockingDetector } from '@/utils/resourceBlockingDetector';

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

  const initTimeoutRef = useRef<NodeJS.Timeout>();
  const retryCountRef = useRef(0);
  const maxRetries = 2; // Reduzir tentativas

  const initializeAuth = async (attempt = 1) => {
    try {
      console.log(`🔐 Inicializando autenticação (tentativa ${attempt}/${maxRetries})`);
      
      // Verificar se há bloqueios apenas se necessário
      if (attempt === 1) {
        const blockingResult = ResourceBlockingDetector.detectBlocking();
        if (blockingResult.isBlocked) {
          console.warn('⚠️ Recursos bloqueados detectados');
          ResourceBlockingDetector.createFallbackMode();
        }
      }

      // Tentar obter sessão com timeout menor
      const sessionPromise = supabase.auth.getSession();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout na autenticação')), 3000)
      );

      const { data: { session }, error } = await Promise.race([
        sessionPromise,
        timeoutPromise
      ]) as any;

      if (error) {
        throw error;
      }

      console.log('✅ Sessão obtida com sucesso:', { hasSession: !!session });

      setAuthState({
        user: session?.user || null,
        session: session || null,
        loading: false,
        error: null,
        isInitialized: true
      });

      retryCountRef.current = 0;

    } catch (error: any) {
      console.error(`❌ Erro na inicialização (tentativa ${attempt}):`, error);
      
      if (attempt < maxRetries) {
        retryCountRef.current = attempt;
        const delay = 1000 * attempt; // Delay linear mais simples
        console.log(`🔄 Reagendando tentativa ${attempt + 1} em ${delay}ms`);
        
        setTimeout(() => {
          initializeAuth(attempt + 1);
        }, delay);
      } else {
        console.error('💥 Falha definitiva na autenticação após todas as tentativas');
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: 'Erro na inicialização da autenticação. Tente recarregar a página.',
          isInitialized: true
        }));
      }
    }
  };

  const handleAuthStateChange = (event: string, session: Session | null) => {
    console.log('🔄 Auth state change:', event, { hasSession: !!session });
    
    setAuthState(prev => ({
      ...prev,
      user: session?.user || null,
      session: session || null,
      loading: false,
      error: null,
      isInitialized: true
    }));
  };

  useEffect(() => {
    let mounted = true;
    let subscription: any;

    const setup = async () => {
      try {
        // Configurar listener primeiro
        const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            if (mounted) {
              handleAuthStateChange(event, session);
            }
          }
        );
        subscription = authSubscription;

        // Timeout de emergência menor
        initTimeoutRef.current = setTimeout(() => {
          if (mounted && !authState.isInitialized) {
            console.warn('⚠️ Timeout de emergência atingido');
            setAuthState(prev => ({
              ...prev,
              loading: false,
              error: null, // Não tratar timeout como erro crítico
              isInitialized: true
            }));
          }
        }, 6000);

        // Inicializar autenticação
        await initializeAuth();

      } catch (error) {
        console.error('❌ Erro no setup:', error);
        if (mounted) {
          setAuthState(prev => ({
            ...prev,
            loading: false,
            error: 'Erro no setup da autenticação',
            isInitialized: true
          }));
        }
      }
    };

    setup();

    return () => {
      mounted = false;
      if (subscription) {
        subscription.unsubscribe();
      }
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
      }
    };
  }, []);

  return {
    user: authState.user,
    session: authState.session,
    loading: authState.loading,
    error: authState.error,
    isInitialized: authState.isInitialized,
    retryCount: retryCountRef.current
  };
};
