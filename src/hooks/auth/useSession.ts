
import { useState, useEffect, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { recoveryModeUtils } from './useRecoveryMode';

/**
 * Hook de sessão otimizado para controlar autenticação
 */
export const useSession = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Refs para controle de estado
  const isInitializedRef = useRef(false);
  const subscriptionRef = useRef<any>(null);

  // Verificar se estamos na página de redefinição de senha
  const isResetPasswordPage = window.location.pathname === "/reset-password";

  const handleAuthStateChange = (event: string, currentSession: Session | null) => {
    console.log('🔄 Auth event:', event, 'User:', currentSession?.user?.email);
    
    // Tratamento especial para logout
    if (event === "SIGNED_OUT") {
      console.log('🚪 Processando logout...');
      
      setSession(null);
      setUser(null);
      setLoading(false);
      
      recoveryModeUtils.disableRecoveryMode();
      
      // Redirecionamento mais suave
      setTimeout(() => {
        if (window.location.pathname !== "/") {
          window.location.href = "/";
        }
      }, 100);
      
      return;
    }
    
    // Detectar recuperação de senha
    if (event === "PASSWORD_RECOVERY" || 
        (event === "SIGNED_IN" && currentSession?.user?.aud === "recovery") ||
        recoveryModeUtils.detectRecoveryFlow?.(currentSession, window.location.pathname)) {
      console.log('🔑 Modo recuperação ativo');
      recoveryModeUtils.enableRecoveryMode();
      setSession(currentSession);
      setLoading(false);
      return;
    }
    
    // Se estiver em modo de recuperação, não fazer login automático
    if (isResetPasswordPage || recoveryModeUtils.isInRecoveryMode()) {
      console.log('🔄 Em modo recuperação - sem login automático');
      setSession(currentSession);
      setLoading(false);
      return;
    }

    // Comportamento normal
    console.log('✅ Atualizando estado normal:', {
      hasSession: !!currentSession,
      userEmail: currentSession?.user?.email
    });
    
    setSession(currentSession);
    setUser(currentSession?.user ?? null);
    setLoading(false);
  };

  useEffect(() => {
    // Evitar múltiplas inicializações
    if (isInitializedRef.current) return;
    
    const initAuth = async () => {
      console.log('🔧 Inicializando sessão...');
      isInitializedRef.current = true;

      try {
        // Verificar sessão inicial primeiro
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (!error && currentSession) {
          console.log('✅ Sessão existente encontrada:', currentSession.user?.email);
          setSession(currentSession);
          setUser(currentSession.user);
        } else {
          console.log('❌ Nenhuma sessão encontrada');
        }
        
        setLoading(false);

        // Configurar listener após verificar sessão inicial
        const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);
        subscriptionRef.current = subscription;
        
      } catch (error) {
        console.error('❌ Erro na inicialização sessão:', error);
        setLoading(false);
      }
    };

    initAuth();

    // Cleanup
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
      isInitializedRef.current = false;
    };
  }, []);

  // Funções de recovery mode
  const isInRecoveryMode = () => {
    return recoveryModeUtils.isInRecoveryMode();
  };

  const setRecoveryMode = (enabled: boolean) => {
    if (enabled) {
      recoveryModeUtils.enableRecoveryMode();
    } else {
      recoveryModeUtils.disableRecoveryMode();
    }
  };

  return { 
    user, 
    session, 
    loading, 
    isInRecoveryMode, 
    setRecoveryMode 
  };
};
