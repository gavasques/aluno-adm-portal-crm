
import React from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HardDrive, X } from "lucide-react";
import UserStorageDetails from "../details/UserStorageDetails";

interface UserStorageManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: {
    id: string;
    name: string;
    email: string;
    storage_used_mb?: number;
    storage_limit_mb?: number;
  } | null;
}

const UserStorageManagementDialog: React.FC<UserStorageManagementDialogProps> = ({
  open,
  onOpenChange,
  user
}) => {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HardDrive className="h-5 w-5" />
              <DialogTitle>Gerenciamento de Armazenamento</DialogTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription>
            Gerencie o armazenamento de <strong>{user.name}</strong> ({user.email})
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <UserStorageDetails user={user} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserStorageManagementDialog;
