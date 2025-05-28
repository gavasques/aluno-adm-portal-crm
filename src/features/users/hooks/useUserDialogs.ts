
import { useState } from 'react';
import { User } from '@/types/user.types';

export type DialogType = 'view' | 'delete' | 'reset' | 'changePassword' | 'sendMagicLink' | 'permissions' | 'storage' | 'activity' | 'mentor';

export interface DialogState {
  isOpen: boolean;
  type: DialogType | null;
  user: User | null;
}

export const useUserDialogs = () => {
  const [dialogState, setDialogState] = useState<DialogState>({
    isOpen: false,
    type: null,
    user: null
  });

  const openDialog = (type: DialogType, user: User) => {
    setDialogState({
      isOpen: true,
      type,
      user
    });
  };

  const closeDialog = () => {
    setDialogState({
      isOpen: false,
      type: null,
      user: null
    });
  };

  return {
    dialogState,
    openDialog,
    closeDialog
  };
};
