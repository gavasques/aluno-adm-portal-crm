
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthEventHandler } from "./useAuthEventHandler";

/**
 * Hook for handling authentication state changes
 */
export const useAuthState = () => {
  const { user, session, loading, handleAuthStateChange } = useAuthEventHandler();
  
  useEffect(() => {
    // Configurar o listener de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        handleAuthStateChange(event, currentSession);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [handleAuthStateChange]);

  return {
    user,
    session,
    loading,
  };
};
