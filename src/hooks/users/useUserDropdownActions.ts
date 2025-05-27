
import { useState } from 'react';
import { User } from '@/types/user.types';

export const useUserDropdownActions = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionType, setActionType] = useState<string>('');

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setActionType('view');
  };

  const handleResetPassword = (user: User) => {
    setSelectedUser(user);
    setActionType('reset');
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setActionType('delete');
  };

  const handleToggleStatus = (user: User) => {
    setSelectedUser(user);
    setActionType('toggle');
  };

  const handleSetPermissions = (user: User) => {
    setSelectedUser(user);
    setActionType('permissions');
  };

  const clearSelection = () => {
    setSelectedUser(null);
    setActionType('');
  };

  return {
    selectedUser,
    actionType,
    handleViewDetails,
    handleResetPassword,
    handleDeleteUser,
    handleToggleStatus,
    handleSetPermissions,
    clearSelection
  };
};
