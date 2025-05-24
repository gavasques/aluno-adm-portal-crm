
import React, { useEffect, useRef, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthEventHandler } from "./useAuthEventHandler";

/**
 * Hook for handling authentication state changes
 */
export const useAuthState = () => {
  const { user, session, loading, handleAuthStateChange } = useAuthEventHandler();
  const subscriptionRef = useRef<any>(null);
  const isInitializedRef = useRef(false);
  
  // Memoize the handler to prevent unnecessary re-subscriptions
  const memoizedHandler = useMemo(
    () => (event: string, currentSession: any) => {
      handleAuthStateChange(event, currentSession);
    },
    [handleAuthStateChange]
  );

  React.useEffect(() => {
    // Evitar múltiplas subscrições
    if (subscriptionRef.current || isInitializedRef.current) {
      return;
    }

    console.log("Configurando listener de autenticação");
    isInitializedRef.current = true;
    
    // Configurar o listener de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(memoizedHandler);

    subscriptionRef.current = subscription;

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
      isInitializedRef.current = false;
    };
  }, [memoizedHandler]);

  return {
    user,
    session,
    loading,
  };
};
