
import { useState, useEffect, useRef, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useOptimizedPermissions } from '@/hooks/useOptimizedPermissions';

interface OptimizedAuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  hasPermissions: boolean;
  canAccessMenu: (menuKey: string) => boolean;
}

export const useOptimizedAuth = (): OptimizedAuthState => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  
  const initializeRef = useRef(false);
  const subscriptionRef = useRef<any>(null);
  
  const { permissions, loading: permissionsLoading } = useOptimizedPermissions();

  // Evitar múltiplas inicializações
  const initializeAuth = useCallback(async () => {
    if (initializeRef.current) return;
    initializeRef.current = true;

    try {
      // Verificar sessão existente apenas uma vez
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();
      
      if (!error && currentSession) {
        setSession(currentSession);
        setUser(currentSession.user);
      }
    } catch (error) {
      console.error('Erro ao verificar sessão:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Configurar listener de mudanças de auth apenas uma vez
  const setupAuthListener = useCallback(() => {
    if (subscriptionRef.current) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('🔄 Auth state change:', event);
        
        // Atualizações síncronas apenas
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Se não há sessão, garantir que loading seja false
        if (!currentSession) {
          setLoading(false);
        }
      }
    );

    subscriptionRef.current = subscription;
  }, []);

  // Inicializar apenas uma vez
  useEffect(() => {
    setupAuthListener();
    initializeAuth();

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
      initializeRef.current = false;
    };
  }, [setupAuthListener, initializeAuth]);

  // Função para verificar acesso a menu
  const canAccessMenu = useCallback((menuKey: string): boolean => {
    if (permissions.hasAdminAccess) return true;
    return permissions.allowedMenus.includes(menuKey);
  }, [permissions.hasAdminAccess, permissions.allowedMenus]);

  return {
    user,
    session,
    loading: loading || permissionsLoading,
    isAdmin: permissions.hasAdminAccess,
    hasPermissions: !permissionsLoading,
    canAccessMenu
  };
};
