
import { usePerformanceOptimizedUserContext } from '@/contexts/PerformanceOptimizedUserContext';

export const useUsers = () => {
  return usePerformanceOptimizedUserContext();
};
