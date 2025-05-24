
import { useState, useEffect, useCallback, useRef } from "react";
import { useSession } from "@/hooks/auth/useSession";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MySupplier, SupplierFormValues } from "@/types/my-suppliers.types";
import { useConnectionManager } from "./useConnectionManager";

export const useSupabaseMySuppliers = () => {
  const { user, session } = useSession();
  const [suppliers, setSuppliers] = useState<MySupplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
  const { 
    connectionState, 
    recordError, 
    recordSuccess, 
    canMakeRequest,
    isNetworkError,
    isCircuitOpen
  } = useConnectionManager();
  
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Função auxiliar para verificar se o usuário está autenticado
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

  // Função para adicionar timeout nas operações
  const withTimeout = async <T>(
    operation: Promise<T>, 
    timeoutMs: number = 10000
  ): Promise<T> => {
    return Promise.race([
      operation,
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Operação expirou')), timeoutMs);
      })
    ]);
  };

  // Carregar fornecedores com melhor handling de erros
  const loadSuppliers = useCallback(async () => {
    // Limpar timeouts anteriores
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Debounce para evitar múltiplas chamadas
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

        // Definir timeout para loading
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

        // Buscar fornecedores com timeout
        const suppliersQuery = supabase
          .from('my_suppliers')
          .select(`
            *,
            brands:my_supplier_brands(*),
            branches:my_supplier_branches(*),
            contacts:my_supplier_contacts(*),
            communications:my_supplier_communications(*),
            ratings:my_supplier_ratings(*),
            commentItems:my_supplier_comments(*)
          `)
          .eq('user_id', user!.id)
          .order('created_at', { ascending: false });

        const { data: suppliersData, error: suppliersError } = await withTimeout(
          suppliersQuery
        );

        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
          loadingTimeoutRef.current = null;
        }

        if (suppliersError) {
          console.error('Supabase error loading suppliers:', suppliersError);
          throw new Error(`Erro do banco de dados: ${suppliersError.message}`);
        }

        console.log(`Successfully loaded ${suppliersData?.length || 0} suppliers`);

        // Transformar dados para o formato esperado
        const transformedSuppliers: MySupplier[] = (suppliersData || []).map(supplier => ({
          ...supplier,
          files: [],
          images: []
        }));

        setSuppliers(transformedSuppliers);
        setRetryCount(0);
        recordSuccess(); // Registrar sucesso no connection manager
        
      } catch (err: any) {
        console.error('Error loading suppliers:', err);
        
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
          loadingTimeoutRef.current = null;
        }
        
        recordError(); // Registrar erro no connection manager
        
        let errorMessage = 'Erro desconhecido ao carregar fornecedores';
        
        if (err.message?.includes('Operação expirou')) {
          errorMessage = 'A operação demorou muito para responder';
        } else if (err.message?.includes('Failed to fetch')) {
          errorMessage = 'Erro de conexão. Verifique sua internet.';
        } else if (err.message) {
          errorMessage = err.message;
        }
        
        setError(errorMessage);
        setRetryCount(prev => prev + 1);
        
        if (!err.message?.includes('Failed to fetch') && !isNetworkError) {
          toast.error('Erro ao carregar fornecedores');
        }
      } finally {
        setLoading(false);
      }
    }, 500);
  }, [user?.id, checkAuthAndUser, canMakeRequest, isCircuitOpen, isNetworkError, recordError, recordSuccess, loading]);

  // Criar novo fornecedor
  const createSupplier = async (data: SupplierFormValues): Promise<MySupplier | null> => {
    if (!checkAuthAndUser()) {
      toast.error('Usuário não autenticado');
      return null;
    }

    if (!canMakeRequest()) {
      toast.error('Não é possível criar fornecedor no momento');
      return null;
    }

    try {
      console.log('Creating supplier:', data);

      const supplierData = {
        user_id: user!.id,
        name: data.name,
        category: data.category,
        cnpj: data.cnpj || null,
        email: data.email || null,
        phone: data.phone || null,
        website: data.website || null,
        address: data.address || null,
        type: data.type || 'Distribuidor',
        logo: data.name.substring(0, 2).toUpperCase(),
        rating: 0,
        comment_count: 0
      };

      const createQuery = supabase
        .from('my_suppliers')
        .insert(supplierData)
        .select(`
          *,
          brands:my_supplier_brands(*),
          branches:my_supplier_branches(*),
          contacts:my_supplier_contacts(*),
          communications:my_supplier_communications(*),
          ratings:my_supplier_ratings(*),
          commentItems:my_supplier_comments(*)
        `)
        .single();

      const { data: newSupplier, error } = await withTimeout(createQuery);

      if (error) {
        console.error('Error creating supplier:', error);
        throw new Error(`Erro ao criar fornecedor: ${error.message}`);
      }

      console.log('Supplier created successfully:', newSupplier);

      const transformedSupplier: MySupplier = {
        ...newSupplier,
        files: [],
        images: []
      };

      setSuppliers(prev => [transformedSupplier, ...prev]);
      toast.success(`${data.name} foi adicionado com sucesso.`);
      recordSuccess();
      
      return transformedSupplier;
    } catch (err: any) {
      console.error('Error creating supplier:', err);
      recordError();
      toast.error(err.message || 'Erro ao criar fornecedor');
      return null;
    }
  };

  // Atualizar fornecedor
  const updateSupplier = async (id: string, updates: Partial<MySupplier>): Promise<MySupplier | null> => {
    if (!checkAuthAndUser()) {
      toast.error('Usuário não autenticado');
      return null;
    }

    if (!canMakeRequest()) {
      toast.error('Não é possível atualizar fornecedor no momento');
      return null;
    }

    try {
      console.log('Updating supplier:', id, updates);

      const updateQuery = supabase
        .from('my_suppliers')
        .update({
          name: updates.name,
          category: updates.category,
          cnpj: updates.cnpj,
          email: updates.email,
          phone: updates.phone,
          website: updates.website,
          address: updates.address,
          type: updates.type,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user!.id)
        .select(`
          *,
          brands:my_supplier_brands(*),
          branches:my_supplier_branches(*),
          contacts:my_supplier_contacts(*),
          communications:my_supplier_communications(*),
          ratings:my_supplier_ratings(*),
          commentItems:my_supplier_comments(*)
        `)
        .single();

      const { data: updatedSupplier, error } = await withTimeout(updateQuery);

      if (error) {
        console.error('Error updating supplier:', error);
        throw new Error(`Erro ao atualizar fornecedor: ${error.message}`);
      }

      console.log('Supplier updated successfully:', updatedSupplier);

      const transformedSupplier: MySupplier = {
        ...updatedSupplier,
        files: [],
        images: []
      };

      setSuppliers(prev => prev.map(supplier => 
        supplier.id === id ? transformedSupplier : supplier
      ));

      toast.success('Fornecedor atualizado com sucesso!');
      recordSuccess();
      return transformedSupplier;
    } catch (err: any) {
      console.error('Error updating supplier:', err);
      recordError();
      toast.error(err.message || 'Erro ao atualizar fornecedor');
      return null;
    }
  };

  // Deletar fornecedor
  const deleteSupplier = async (id: string): Promise<boolean> => {
    if (!checkAuthAndUser()) {
      toast.error('Usuário não autenticado');
      return false;
    }

    if (!canMakeRequest()) {
      toast.error('Não é possível excluir fornecedor no momento');
      return false;
    }

    try {
      console.log('Deleting supplier:', id);

      const deleteQuery = supabase
        .from('my_suppliers')
        .delete()
        .eq('id', id)
        .eq('user_id', user!.id);

      const { error } = await withTimeout(deleteQuery);

      if (error) {
        console.error('Error deleting supplier:', error);
        throw new Error(`Erro ao excluir fornecedor: ${error.message}`);
      }

      console.log('Supplier deleted successfully');

      setSuppliers(prev => prev.filter(supplier => supplier.id !== id));
      toast.success('Fornecedor excluído com sucesso.');
      recordSuccess();
      return true;
    } catch (err: any) {
      console.error('Error deleting supplier:', err);
      recordError();
      toast.error(err.message || 'Erro ao excluir fornecedor');
      return false;
    }
  };

  // Carregar fornecedores quando o usuário muda
  useEffect(() => {
    if (user?.id && session?.access_token) {
      console.log('User and session available, loading suppliers...');
      setLoading(true);
      loadSuppliers();
    } else {
      console.log('No user or session available, clearing suppliers...');
      setSuppliers([]);
      setLoading(false);
      setError(null);
    }

    // Cleanup timeouts on unmount
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
    refreshSuppliers: () => {
      if (canMakeRequest()) {
        setLoading(true);
        loadSuppliers();
      } else {
        toast.error('Não é possível atualizar no momento');
      }
    }
  };
};
