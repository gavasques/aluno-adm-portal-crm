
import { useState, useEffect, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const useSimpleAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const initialized = useRef(false);
  const subscription = useRef<any>(null);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    console.log('🔧 Inicializando autenticação simples...');

    const initAuth = async () => {
      try {
        // Verificar sessão existente
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('❌ Erro ao obter sessão:', sessionError);
          setError(sessionError.message);
        } else {
          console.log('✅ Sessão verificada:', currentSession?.user?.email || 'Sem usuário');
          setSession(currentSession);
          setUser(currentSession?.user || null);
        }
      } catch (err) {
        console.error('❌ Erro na inicialização:', err);
        setError('Erro ao inicializar autenticação');
      } finally {
        setLoading(false);
      }
    };

    // Configurar listener
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('🔄 Auth event:', event, currentSession?.user?.email || 'Sem usuário');
        
        setSession(currentSession);
        setUser(currentSession?.user || null);
        setError(null);
        
        if (!initialized.current) {
          setLoading(false);
        }
      }
    );

    subscription.current = authSubscription;
    initAuth();

    return () => {
      if (subscription.current) {
        subscription.current.unsubscribe();
      }
      initialized.current = false;
    };
  }, []);

  return {
    user,
    session,
    loading,
    error
  };
};
