
import { useState, useCallback } from 'react';
import { User } from '@/types/user.types';

export type UserDialogType = 
  | 'details' 
  | 'delete' 
  | 'status' 
  | 'reset' 
  | 'permission'
  | null;

export interface UserDialogState {
  type: UserDialogType;
  user: User | null;
  isOpen: boolean;
}

export interface UserDialogActions {
  openDialog: (type: Exclude<UserDialogType, null>, user: User) => void;
  closeDialog: () => void;
  handleViewDetails: (user: User) => void;
  handleResetPassword: (user: User) => void;
  handleDeleteUser: (user: User) => void;
  handleToggleUserStatus: (user: User) => void;
  handleSetPermissionGroup: (user: User) => void;
}

export const useUserDialogs = (): UserDialogState & UserDialogActions => {
  const [dialogState, setDialogState] = useState<UserDialogState>({
    type: null,
    user: null,
    isOpen: false
  });

  const openDialog = useCallback((type: Exclude<UserDialogType, null>, user: User) => {
    console.log(`🔧 UserDialogs: Opening ${type} dialog for user:`, user.email);
    setDialogState({
      type,
      user,
      isOpen: true
    });
  }, []);

  const closeDialog = useCallback(() => {
    console.log('🔧 UserDialogs: Closing dialog');
    setDialogState({
      type: null,
      user: null,
      isOpen: false
    });
  }, []);

  const handleViewDetails = useCallback((user: User) => {
    openDialog('details', user);
  }, [openDialog]);

  const handleResetPassword = useCallback((user: User) => {
    openDialog('reset', user);
  }, [openDialog]);

  const handleDeleteUser = useCallback((user: User) => {
    openDialog('delete', user);
  }, [openDialog]);

  const handleToggleUserStatus = useCallback((user: User) => {
    openDialog('status', user);
  }, [openDialog]);

  const handleSetPermissionGroup = useCallback((user: User) => {
    openDialog('permission', user);
  }, [openDialog]);

  return {
    ...dialogState,
    openDialog,
    closeDialog,
    handleViewDetails,
    handleResetPassword,
    handleDeleteUser,
    handleToggleUserStatus,
    handleSetPermissionGroup
  };
};
