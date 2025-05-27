
import React from "react";
import { useUserDropdownActions } from "@/hooks/users/useUserDropdownActions";
import UserDetailsDialog from "../UserDetailsDialog";
import { UserDeleteDialog } from "./UserDeleteDialog";
import { UserStatusDialog } from "./UserStatusDialog";
import { ResetPasswordDialog } from "./ResetPasswordDialog";
import { UserPermissionGroupDialog } from "./UserPermissionGroupDialog";

export const PerformanceOptimizedUserDialogs: React.FC = () => {
  const {
    selectedUser,
    showDetailsDialog,
    showDeleteDialog,
    showStatusDialog,
    showResetDialog,
    showPermissionDialog,
    setShowDetailsDialog,
    setShowDeleteDialog,
    setShowStatusDialog,
    setShowResetDialog,
    setShowPermissionDialog,
    confirmDelete,
    confirmToggleStatus,
    confirmResetPassword,
    confirmSetPermissionGroup
  } = useUserDropdownActions();

  return (
    <>
      {selectedUser && (
        <>
          <UserDetailsDialog
            open={showDetailsDialog}
            onOpenChange={setShowDetailsDialog}
            user={selectedUser}
          />

          <UserDeleteDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
            userEmail={selectedUser.email}
            onConfirmDelete={confirmDelete}
          />

          <UserStatusDialog
            open={showStatusDialog}
            onOpenChange={setShowStatusDialog}
            userEmail={selectedUser.email}
            currentStatus={selectedUser.status}
            onConfirmToggleStatus={confirmToggleStatus}
          />

          <ResetPasswordDialog
            open={showResetDialog}
            onOpenChange={setShowResetDialog}
            userEmail={selectedUser.email}
            onConfirmReset={confirmResetPassword}
          />

          <UserPermissionGroupDialog
            open={showPermissionDialog}
            onOpenChange={setShowPermissionDialog}
            user={selectedUser}
            onConfirmSetPermissionGroup={confirmSetPermissionGroup}
          />
        </>
      )}
    </>
  );
};
