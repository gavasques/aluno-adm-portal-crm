
import React, { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthEventHandler } from "./useAuthEventHandler";

/**
 * Hook for handling authentication state changes
 */
export const useAuthState = () => {
  const { user, session, loading, handleAuthStateChange } = useAuthEventHandler();
  const subscriptionRef = useRef<any>(null);
  
  React.useEffect(() => {
    // Evitar múltiplas subscrições
    if (subscriptionRef.current) {
      return;
    }

    console.log("Configurando listener de autenticação");
    
    // Configurar o listener de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        handleAuthStateChange(event, currentSession);
      }
    );

    subscriptionRef.current = subscription;

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, []); // Dependência vazia para executar apenas uma vez

  return {
    user,
    session,
    loading,
  };
};
