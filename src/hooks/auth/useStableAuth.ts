
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
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Evitar múltiplas inicializações
    if (isInitializedRef.current) return;
    
    const initAuth = async () => {
      console.log('🔧 Inicializando auth estável...');
      isInitializedRef.current = true;

      try {
        // Configurar listener primeiro
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, currentSession) => {
            console.log('📡 Auth event:', event);
            
            // Cancelar timeout anterior se existir
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }
            
            // Debounce das atualizações para evitar múltiplas renderizações
            timeoutRef.current = setTimeout(() => {
              setSession(currentSession);
              setUser(currentSession?.user ?? null);
              setLoading(false);
            }, 100);
          }
        );

        subscriptionRef.current = subscription;

        // Verificar sessão inicial após configurar listener
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (!error) {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
        }
        
        setLoading(false);
        
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
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      isInitializedRef.current = false;
    };
  }, []);

  return { user, session, loading };
};
