
import React, { lazy, Suspense } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import PermissionGroupDelete from "./PermissionGroupDelete";
import PermissionGroupUsers from "./PermissionGroupUsers";
import type { PermissionGroup } from "@/types/permissions";

// Lazy load do formulário para melhor performance
const OptimizedPermissionForm = lazy(() => import("./OptimizedPermissionForm"));

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

const FormSuspenseFallback = () => (
  <div className="flex items-center justify-center p-8">
    <div className="flex flex-col items-center gap-3">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      <p className="text-gray-600">Carregando formulário...</p>
    </div>
  </div>
);

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
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden">
          <Suspense fallback={<FormSuspenseFallback />}>
            <OptimizedPermissionForm
              isEdit={false}
              onOpenChange={setShowAddDialog}
              onSuccess={onSuccess}
            />
          </Suspense>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden">
          <Suspense fallback={<FormSuspenseFallback />}>
            <OptimizedPermissionForm
              isEdit={true}
              permissionGroup={selectedGroup}
              onOpenChange={setShowEditDialog}
              onSuccess={onSuccess}
            />
          </Suspense>
        </DialogContent>
      </Dialog>

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
