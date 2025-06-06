
import { useState, useEffect, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const useSimpleAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const initialized = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    console.log('🔧 Inicializando autenticação...');

    // Timeout de segurança para evitar travamento
    timeoutRef.current = setTimeout(() => {
      console.log('⚠️ Timeout na inicialização, continuando sem autenticação');
      setLoading(false);
    }, 5000);

    const initAuth = async () => {
      try {
        // Verificar sessão existente com timeout
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 3000)
        );

        const { data: { session: currentSession }, error: sessionError } = await Promise.race([
          sessionPromise,
          timeoutPromise
        ]) as any;
        
        if (sessionError && sessionError.message !== 'Timeout') {
          console.error('❌ Erro ao obter sessão:', sessionError);
          setError(sessionError.message);
        } else if (currentSession) {
          console.log('✅ Sessão encontrada:', currentSession?.user?.email);
          setSession(currentSession);
          setUser(currentSession?.user || null);
        } else {
          console.log('ℹ️ Nenhuma sessão encontrada');
        }
      } catch (err) {
        console.warn('⚠️ Erro na inicialização (continuando):', err);
        // Não definir erro aqui, apenas continuar
      } finally {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        setLoading(false);
      }
    };

    // Configurar listener simples
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('🔄 Auth event:', event);
        
        setSession(currentSession);
        setUser(currentSession?.user || null);
        setError(null);
        setLoading(false);
      }
    );

    initAuth();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      subscription.unsubscribe();
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
