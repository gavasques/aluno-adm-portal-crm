
import { useAuth as useAuthContext } from '@/hooks/auth';

export const useAuth = () => {
  return useAuthContext();
};
