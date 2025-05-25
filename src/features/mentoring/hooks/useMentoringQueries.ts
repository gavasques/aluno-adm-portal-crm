
import { useQueryClient } from '@tanstack/react-query';
import { useMentoringReadQueries } from './useMentoringReadQueries';
import { useMentoringCatalogMutations } from './useMentoringCatalogMutations';
import { useMentoringSessionMutations } from './useMentoringSessionMutations';
import { mentoringQueryKeys } from './queryKeys';

export { mentoringQueryKeys };

export const useMentoringQueries = () => {
  const queryClient = useQueryClient();
  
  // Import all query and mutation hooks
  const readQueries = useMentoringReadQueries();
  const catalogMutations = useMentoringCatalogMutations();
  const sessionMutations = useMentoringSessionMutations();

  return {
    // Read Queries
    ...readQueries,
    
    // Catalog Mutations
    ...catalogMutations,
    
    // Session Mutations
    ...sessionMutations,
    
    // Utilities
    invalidateAllQueries: () => queryClient.invalidateQueries({ queryKey: mentoringQueryKeys.all }),
    clearCache: () => queryClient.clear()
  };
};
