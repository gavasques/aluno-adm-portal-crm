
import { useState } from 'react';
import { User } from '@/types/user.types';

export type DialogType = 'view' | 'reset' | 'delete' | 'permissions' | null;

export interface DialogState {
  type: DialogType;
  user: User | null;
  isOpen: boolean;
}

export const useUserDialogs = () => {
  const [dialogState, setDialogState] = useState<DialogState>({
    type: null,
    user: null,
    isOpen: false
  });

  const openDialog = (type: DialogType, user: User) => {
    setDialogState({
      type,
      user,
      isOpen: true
    });
  };

  const closeDialog = () => {
    setDialogState({
      type: null,
      user: null,
      isOpen: false
    });
  };

  const handleViewDetails = (user: User) => {
    openDialog('view', user);
  };

  const handleResetPassword = (user: User) => {
    openDialog('reset', user);
  };

  const handleDeleteUser = (user: User) => {
    openDialog('delete', user);
  };

  const handleSetPermissionGroup = (user: User) => {
    openDialog('permissions', user);
  };

  return {
    type: dialogState.type,
    user: dialogState.user,
    isOpen: dialogState.isOpen,
    closeDialog,
    handleViewDetails,
    handleResetPassword,
    handleDeleteUser,
    handleSetPermissionGroup
  };
};
