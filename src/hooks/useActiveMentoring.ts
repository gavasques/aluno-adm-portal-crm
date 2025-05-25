
import { useMemo } from 'react';
import { useSecureMentoring } from '@/hooks/useSecureMentoring';

export const useActiveMentoring = () => {
  const { 
    getMySecureEnrollments,
    loading,
    isAuthenticated
  } = useSecureMentoring();

  const hasActiveMentoring = useMemo(() => {
    if (!isAuthenticated || loading) return false;
    
    const enrollments = getMySecureEnrollments;
    return enrollments.some(enrollment => enrollment.status === 'ativa');
  }, [getMySecureEnrollments, isAuthenticated, loading]);

  return {
    hasActiveMentoring,
    loading,
    isAuthenticated
  };
};
