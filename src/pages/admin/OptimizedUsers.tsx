
import React from 'react';
import { OptimizedUserProvider } from '@/contexts/OptimizedUserContext';
import OptimizedUnifiedUserPage from '@/features/users/components/OptimizedUnifiedUserPage';

const OptimizedUsers = () => {
  return (
    <OptimizedUserProvider>
      <div className="container mx-auto py-6 space-y-6">
        <OptimizedUnifiedUserPage />
      </div>
    </OptimizedUserProvider>
  );
};

export default OptimizedUsers;
