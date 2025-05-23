
import React from "react";
import ModularPermissionForm from "./ModularPermissionForm";
import PermissionGroupDelete from "./PermissionGroupDelete";
import PermissionGroupUsers from "./PermissionGroupUsers";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface PermissionsDialogsProps {
  showAddDialog: boolean;
  setShowAddDialog: (show: boolean) => void;
  showEditDialog: boolean;
  setShowEditDialog: (show: boolean) => void;
  showDeleteDialog: boolean;
  setShowDeleteDialog: (show: boolean) => void;
  showUsersDialog: boolean;
  setShowUsersDialog: (show: boolean) => void;
  selectedGroup: any;
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
      {/* Diálogo para adicionar grupo */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
          <ModularPermissionForm
            isEdit={false}
            onOpenChange={setShowAddDialog}
            onSuccess={onSuccess}
          />
        </DialogContent>
      </Dialog>

      {/* Diálogo para editar grupo */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
          <ModularPermissionForm
            isEdit={true}
            permissionGroup={selectedGroup}
            onOpenChange={setShowEditDialog}
            onSuccess={onSuccess}
          />
        </DialogContent>
      </Dialog>

      {/* Diálogo para excluir grupo */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[450px]">
          <PermissionGroupDelete
            permissionGroup={selectedGroup}
            onOpenChange={setShowDeleteDialog}
            onSuccess={onSuccess}
          />
        </DialogContent>
      </Dialog>

      {/* Diálogo para visualizar usuários do grupo */}
      <Dialog open={showUsersDialog} onOpenChange={setShowUsersDialog}>
        <DialogContent className="sm:max-w-[700px]">
          <PermissionGroupUsers
            permissionGroup={selectedGroup}
            onOpenChange={setShowUsersDialog}
            onSuccess={onSuccess}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PermissionsDialogs;
