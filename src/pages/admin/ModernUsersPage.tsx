
import React from 'react';
import { PerformanceOptimizedUserProvider } from '@/contexts/PerformanceOptimizedUserContext';
import ModernUnifiedUserPage from '@/features/users/components/ModernUnifiedUserPage';

const ModernUsersPage = () => {
  return (
    <PerformanceOptimizedUserProvider>
      <ModernUnifiedUserPage />
    </PerformanceOptimizedUserProvider>
  );
};

export default ModernUsersPage;
