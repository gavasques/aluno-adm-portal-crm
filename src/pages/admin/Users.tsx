
import React from 'react';
import { UserProvider } from '@/contexts/UserContext';
import UnifiedUserPage from '@/features/users/components/UnifiedUserPage';

const Users = () => {
  return (
    <UserProvider>
      <div className="container mx-auto py-6 space-y-6">
        <UnifiedUserPage />
      </div>
    </UserProvider>
  );
};

export default Users;
