
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const useSimpleAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('🔧 useSimpleAuth: Iniciando...');
    
    let mounted = true;
    
    const initAuth = async () => {
      try {
        console.log('🔧 useSimpleAuth: Verificando sessão inicial...');
        
        // Verificar sessão existente
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (sessionError) {
          console.error('❌ useSimpleAuth: Erro ao obter sessão:', sessionError);
          setError(sessionError.message);
          setLoading(false);
          return;
        }

        console.log('✅ useSimpleAuth: Sessão obtida:', {
          hasSession: !!currentSession,
          userEmail: currentSession?.user?.email
        });
        
        setSession(currentSession);
        setUser(currentSession?.user || null);
        setError(null);
        setLoading(false);
        
      } catch (err: any) {
        console.error('❌ useSimpleAuth: Erro na inicialização:', err);
        if (mounted) {
          setError('Erro ao inicializar autenticação');
          setLoading(false);
        }
      }
    };

    // Configurar listener para mudanças de autenticação
    console.log('🔧 useSimpleAuth: Configurando listener...');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        if (!mounted) return;
        
        console.log('🔄 useSimpleAuth: Auth event:', event, {
          hasSession: !!currentSession,
          userEmail: currentSession?.user?.email
        });
        
        setSession(currentSession);
        setUser(currentSession?.user || null);
        setError(null);
        setLoading(false);
      }
    );

    // Inicializar autenticação
    initAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
      console.log('🔧 useSimpleAuth: Cleanup realizado');
    };
  }, []);

  console.log('🔧 useSimpleAuth: Estado atual:', {
    hasUser: !!user,
    hasSession: !!session,
    loading,
    error,
    userEmail: user?.email
  });

  return {
    user,
    session,
    loading,
    error
  };
};
