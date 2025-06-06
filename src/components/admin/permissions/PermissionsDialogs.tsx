
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import PermissionFormDialog from "./form/PermissionFormDialog";
import PermissionGroupDelete from "./PermissionGroupDelete";
import PermissionGroupUsers from "./PermissionGroupUsers";
import type { PermissionGroup } from "@/types/permissions";

interface PermissionsDialogsProps {
  showAddDialog: boolean;
  setShowAddDialog: (show: boolean) => void;
  showEditDialog: boolean;
  setShowEditDialog: (show: boolean) => void;
  showDeleteDialog: boolean;
  setShowDeleteDialog: (show: boolean) => void;
  showUsersDialog: boolean;
  setShowUsersDialog: (show: boolean) => void;
  selectedGroup: PermissionGroup | null;
  onSuccess: () => void;
}

const PermissionsDialogs: React.FC<PermissionsDialogsProps> = ({
  showAddDialog,
  setShowAddDialog,
  showEditDialog,
  setShowEditDialog,
  showDeleteDialog,
  setShowDeleteDialog,
  showUsersDialog,
  setShowUsersDialog,
  selectedGroup,
  onSuccess,
}) => {
  return (
    <>
      {/* Add Dialog */}
      <PermissionFormDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        isEdit={false}
        onSuccess={onSuccess}
      />

      {/* Edit Dialog */}
      <PermissionFormDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        isEdit={true}
        permissionGroup={selectedGroup}
        onSuccess={onSuccess}
      />

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[500px]">
          {selectedGroup && (
            <PermissionGroupDelete
              permissionGroup={selectedGroup}
              onOpenChange={setShowDeleteDialog}
              onSuccess={onSuccess}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Users Dialog */}
      <Dialog open={showUsersDialog} onOpenChange={setShowUsersDialog}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-hidden">
          {selectedGroup && (
            <PermissionGroupUsers
              permissionGroup={selectedGroup}
              onOpenChange={setShowUsersDialog}
              onSuccess={onSuccess}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PermissionsDialogs;
