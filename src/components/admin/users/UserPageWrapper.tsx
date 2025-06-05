
import React from 'react';
import { PerformanceOptimizedUserProvider } from '@/contexts/PerformanceOptimizedUserContext';
import ModernUnifiedUserPage from '@/features/users/components/ModernUnifiedUserPage';

const UserPageWrapper = () => {
  console.log('UserPageWrapper component is rendering');

  return (
    <div className="p-8">
      <PerformanceOptimizedUserProvider>
        <ModernUnifiedUserPage />
      </PerformanceOptimizedUserProvider>
    </div>
  );
};

export default UserPageWrapper;
