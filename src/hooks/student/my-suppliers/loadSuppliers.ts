
import { useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import { MySupplier } from "@/types/my-suppliers.types";
import { withTimeout, transformSupplierData } from "./utils";
import { fetchSuppliersQuery } from "./queries";

export const useLoadSuppliers = (
  user: any,
  session: any,
  canMakeRequest: () => boolean,
  isCircuitOpen: boolean,
  isNetworkError: boolean,
  recordError: () => void,
  recordSuccess: () => void
) => {
  const [suppliers, setSuppliers] = useState<MySupplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const checkAuthAndUser = useCallback(() => {
    const isAuthenticated = !!(user?.id && session?.access_token);
    
    if (!isAuthenticated) {
      console.log("User not properly authenticated", { 
        hasUser: !!user?.id, 
        hasSession: !!session?.access_token,
        userAud: session?.user?.aud 
      });
      setLoading(false);
      setError("Usuário não autenticado corretamente");
      return false;
    }
    return true;
  }, [user?.id, session?.access_token, session?.user?.aud]);

  const loadSuppliers = useCallback(async () => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(async () => {
      if (!checkAuthAndUser()) return;
      
      if (!canMakeRequest()) {
        console.log('Cannot make request due to connection manager restrictions');
        if (isCircuitOpen) {
          setError('Muitas tentativas falharam. Aguarde antes de tentar novamente.');
        } else if (isNetworkError) {
          setError('Sem conexão com a internet');
        }
        setLoading(false);
        return;
      }

      try {
        setError(null);
        console.log(`Loading suppliers for user: ${user!.id}`);

        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
        }
        
        loadingTimeoutRef.current = setTimeout(() => {
          if (loading) {
            console.log('Loading timeout reached');
            setError('Operação demorou muito para responder');
            setLoading(false);
          }
        }, 15000);

        const suppliersQueryResult = await withTimeout(fetchSuppliersQuery(user!.id)) as any;

        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
          loadingTimeoutRef.current = null;
        }

        if (suppliersQueryResult.error) {
          console.error('Supabase error loading suppliers:', suppliersQueryResult.error);
          throw new Error(`Erro do banco de dados: ${suppliersQueryResult.error.message}`);
        }

        console.log(`Successfully loaded ${suppliersQueryResult.data?.length || 0} suppliers`);

        const transformedSuppliers: MySupplier[] = (suppliersQueryResult.data || []).map(transformSupplierData);

        setSuppliers(transformedSuppliers);
        recordSuccess();
        
      } catch (err: any) {
        console.error('Error loading suppliers:', err);
        
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
          loadingTimeoutRef.current = null;
        }
        
        recordError();
        
        let errorMessage = 'Erro desconhecido ao carregar fornecedores';
        
        if (err.message?.includes('Operação expirou')) {
          errorMessage = 'A operação demorou muito para responder';
        } else if (err.message?.includes('Failed to fetch')) {
          errorMessage = 'Erro de conexão. Verifique sua internet.';
        } else if (err.message) {
          errorMessage = err.message;
        }
        
        setError(errorMessage);
        
        if (!err.message?.includes('Failed to fetch') && !isNetworkError) {
          toast.error('Erro ao carregar fornecedores');
        }
      } finally {
        setLoading(false);
      }
    }, 500);
  }, [user?.id, checkAuthAndUser, canMakeRequest, isCircuitOpen, isNetworkError, recordError, recordSuccess, loading]);

  const refreshSuppliers = () => {
    if (canMakeRequest()) {
      setLoading(true);
      loadSuppliers();
    } else {
      toast.error('Não é possível atualizar no momento');
    }
  };

  return {
    suppliers,
    setSuppliers,
    loading,
    error,
    loadSuppliers,
    refreshSuppliers,
    loadingTimeoutRef,
    debounceTimeoutRef
  };
};
