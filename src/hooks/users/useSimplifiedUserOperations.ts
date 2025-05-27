
import { useState } from 'react';

export const useSimplifiedUserOperations = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);

  const handleAddUser = () => {
    setShowAddDialog(true);
  };

  const handleInviteUser = () => {
    setShowInviteDialog(true);
  };

  return {
    // Dialog states
    showAddDialog,
    setShowAddDialog,
    showInviteDialog,
    setShowInviteDialog,
    
    // Handlers
    handleAddUser,
    handleInviteUser,
  };
};
