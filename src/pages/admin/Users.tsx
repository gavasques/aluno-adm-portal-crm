
import React from 'react';
import { PerformanceOptimizedUserProvider } from '@/contexts/PerformanceOptimizedUserContext';
import UnifiedUserPage from '@/features/users/components/UnifiedUserPage';

const Users = () => {
  return (
    <PerformanceOptimizedUserProvider>
      <div className="container mx-auto py-6 space-y-6">
        <UnifiedUserPage />
      </div>
    </PerformanceOptimizedUserProvider>
  );
};

export default Users;
