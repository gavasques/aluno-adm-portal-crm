
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from '@/hooks/auth/useSession';
import { MySupplier } from '@/types/my-suppliers.types';
import { fetchSuppliersQuery } from './queries';
import { transformSupplierData } from './utils';

export const useOptimizedQueries = () => {
  const { user } = useSession();
  const queryClient = useQueryClient();

  const {
    data: suppliers = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['my-suppliers', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      
      console.log('Fetching suppliers with optimized query...');
      const result = await fetchSuppliersQuery(user.id);
      
      if (result.error) {
        throw new Error(result.error.message);
      }
      
      return (result.data || []).map(transformSupplierData);
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      if (error.message.includes('Failed to fetch')) return failureCount < 2;
      return failureCount < 1;
    }
  });

  const invalidateSuppliers = () => {
    queryClient.invalidateQueries({ queryKey: ['my-suppliers', user?.id] });
  };

  const updateSupplierInCache = (updatedSupplier: MySupplier) => {
    queryClient.setQueryData(['my-suppliers', user?.id], (oldData: MySupplier[] | undefined) => {
      if (!oldData) return oldData;
      return oldData.map(supplier => 
        supplier.id === updatedSupplier.id ? updatedSupplier : supplier
      );
    });
  };

  const addSupplierToCache = (newSupplier: MySupplier) => {
    queryClient.setQueryData(['my-suppliers', user?.id], (oldData: MySupplier[] | undefined) => {
      if (!oldData) return [newSupplier];
      return [newSupplier, ...oldData];
    });
  };

  const removeSupplierFromCache = (supplierId: string) => {
    queryClient.setQueryData(['my-suppliers', user?.id], (oldData: MySupplier[] | undefined) => {
      if (!oldData) return oldData;
      return oldData.filter(supplier => supplier.id !== supplierId);
    });
  };

  return {
    suppliers,
    isLoading,
    error: error?.message || null,
    refetch,
    invalidateSuppliers,
    updateSupplierInCache,
    addSupplierToCache,
    removeSupplierFromCache
  };
};
