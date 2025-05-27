
import { useUserContext } from '@/contexts/UserContext';

export const useUsers = () => {
  return useUserContext();
};
