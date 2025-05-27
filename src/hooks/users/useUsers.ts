
import { useOptimizedUserContext } from '@/contexts/OptimizedUserContext';

export const useUsers = () => {
  return useOptimizedUserContext();
};
