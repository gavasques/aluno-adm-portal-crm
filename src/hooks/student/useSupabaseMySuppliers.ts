
import { useEffect } from "react";
import { useSession } from "@/hooks/auth/useSession";
import { useConnectionManager } from "./useConnectionManager";
import { useLoadSuppliers } from "./my-suppliers/loadSuppliers";
import { useSupplierOperations } from "./my-suppliers/operations";
import { UseSupabaseMySuppliers } from "./my-suppliers/types";

export const useSupabaseMySuppliers = (): UseSupabaseMySuppliers => {
  const { user, session } = useSession();
  
  const { 
    connectionState, 
    recordError, 
    recordSuccess, 
    canMakeRequest,
    isNetworkError,
    isCircuitOpen
  } = useConnectionManager();

  const {
    suppliers,
    setSuppliers,
    loading,
    error,
    loadSuppliers,
    refreshSuppliers,
    loadingTimeoutRef,
    debounceTimeoutRef
  } = useLoadSuppliers(
    user,
    session,
    canMakeRequest,
    isCircuitOpen,
    isNetworkError,
    recordError,
    recordSuccess
  );

  const {
    createSupplier,
    updateSupplier,
    deleteSupplier
  } = useSupplierOperations(
    user,
    canMakeRequest,
    recordSuccess,
    recordError,
    setSuppliers
  );

  useEffect(() => {
    if (user?.id && session?.access_token) {
      console.log('User and session available, loading suppliers...');
      loadSuppliers();
    } else {
      console.log('No user or session available, clearing suppliers...');
      setSuppliers([]);
    }

    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [user?.id, session?.access_token]);

  return {
    suppliers,
    loading,
    error,
    retryCount: connectionState.consecutiveErrors,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    refreshSuppliers
  };
};
