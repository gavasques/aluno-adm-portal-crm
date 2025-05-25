
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PermissionGroup } from "@/hooks/admin/usePermissionGroups";
import UnifiedPermissionForm from "./UnifiedPermissionForm";
import PermissionGroupDelete from "./PermissionGroupDelete";
import PermissionGroupUsers from "./PermissionGroupUsers";

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
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <UnifiedPermissionForm
            isEdit={false}
            onOpenChange={setShowAddDialog}
            onSuccess={onSuccess}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedGroup && (
            <UnifiedPermissionForm
              isEdit={true}
              permissionGroup={selectedGroup}
              onOpenChange={setShowEditDialog}
              onSuccess={onSuccess}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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
