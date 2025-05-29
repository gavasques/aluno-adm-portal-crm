
import { useState } from 'react';
import { User } from '@/types/user.types';

export const useUserCreditsDialog = () => {
  const [isCreditsDialogOpen, setIsCreditsDialogOpen] = useState(false);
  const [selectedUserForCredits, setSelectedUserForCredits] = useState<User | null>(null);

  const openCreditsDialog = (user: User) => {
    setSelectedUserForCredits(user);
    setIsCreditsDialogOpen(true);
  };

  const closeCreditsDialog = () => {
    setIsCreditsDialogOpen(false);
    setSelectedUserForCredits(null);
  };

  return {
    isCreditsDialogOpen,
    selectedUserForCredits,
    openCreditsDialog,
    closeCreditsDialog,
  };
};
