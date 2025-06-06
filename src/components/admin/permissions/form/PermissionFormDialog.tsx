
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import PermissionGroupForm from "./PermissionGroupForm";
import type { PermissionGroup } from "@/types/permissions";

interface PermissionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEdit: boolean;
  permissionGroup?: PermissionGroup;
  onSuccess: () => void;
}

const PermissionFormDialog: React.FC<PermissionFormDialogProps> = ({
  open,
  onOpenChange,
  isEdit,
  permissionGroup,
  onSuccess,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden">
        <div className="flex flex-col h-full">
          <React.Suspense
            fallback={
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Carregando formulário...</span>
              </div>
            }
          >
            <PermissionGroupForm
              isEdit={isEdit}
              permissionGroup={permissionGroup}
              onOpenChange={onOpenChange}
              onSuccess={onSuccess}
            />
          </React.Suspense>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PermissionFormDialog;
