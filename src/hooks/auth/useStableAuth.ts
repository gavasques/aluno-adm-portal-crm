
import { useState, useEffect, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook de autenticação otimizado para evitar loops e recarregamentos
 */
export const useStableAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Refs para controle de estado
  const isInitializedRef = useRef(false);
  const subscriptionRef = useRef<any>(null);

  useEffect(() => {
    // Evitar múltiplas inicializações
    if (isInitializedRef.current) return;
    
    const initAuth = async () => {
      console.log('🔧 Inicializando auth estável...');
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
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, currentSession) => {
            console.log('📡 Auth event:', event, currentSession?.user?.email);
            
            setSession(currentSession);
            setUser(currentSession?.user ?? null);
            
            if (event === 'SIGNED_OUT') {
              console.log('🚪 Usuário fez logout');
              setSession(null);
              setUser(null);
            }
          }
        );

        subscriptionRef.current = subscription;
        
      } catch (error) {
        console.error('❌ Erro na inicialização auth:', error);
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

  return { user, session, loading };
};
