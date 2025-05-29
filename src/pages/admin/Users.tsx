
import React from 'react';
import { PerformanceOptimizedUserProvider } from '@/contexts/PerformanceOptimizedUserContext';
import ModernUnifiedUserPage from '@/features/users/components/ModernUnifiedUserPage';

const Users = () => {
  return (
    <PerformanceOptimizedUserProvider>
      <ModernUnifiedUserPage />
    </PerformanceOptimizedUserProvider>
  );
};

export default Users;
