
import { useState, useCallback } from 'react';
import { User } from '@/types/user.types';

export type DialogType = 'view' | 'delete' | 'reset' | 'permissions' | 'changePassword';

export interface DialogState {
  type: DialogType | null;
  user: User | null;
  isOpen: boolean;
}

export const useUserDialogs = () => {
  const [dialogState, setDialogState] = useState<DialogState>({
    type: null,
    user: null,
    isOpen: false
  });

  const openDialog = useCallback((type: DialogType, user: User) => {
    setDialogState({
      type,
      user,
      isOpen: true
    });
  }, []);

  const closeDialog = useCallback(() => {
    setDialogState({
      type: null,
      user: null,
      isOpen: false
    });
  }, []);

  const handleViewDetails = useCallback((user: User) => {
    openDialog('view', user);
  }, [openDialog]);

  const handleResetPassword = useCallback((user: User) => {
    openDialog('reset', user);
  }, [openDialog]);

  const handleChangePassword = useCallback((user: User) => {
    openDialog('changePassword', user);
  }, [openDialog]);

  const handleDeleteUser = useCallback((user: User) => {
    openDialog('delete', user);
  }, [openDialog]);

  const handleSetPermissionGroup = useCallback((user: User) => {
    openDialog('permissions', user);
  }, [openDialog]);

  return {
    ...dialogState,
    closeDialog,
    handleViewDetails,
    handleResetPassword,
    handleChangePassword,
    handleDeleteUser,
    handleSetPermissionGroup
  };
};
