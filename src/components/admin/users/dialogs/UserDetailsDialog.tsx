
import React from "react";
import { 
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

import UserDetailsHeader from "../details/UserDetailsHeader";
import UserDetailsContent from "../details/UserDetailsContent";
import UserDetailsFooter from "../details/UserDetailsFooter";

interface UserDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    lastLogin: string;
    storage_used_mb?: number;
    storage_limit_mb?: number;
    tasks?: any[];
    is_mentor?: boolean;
  } | null;
  onRefresh?: () => void;
}

export const UserDetailsDialog: React.FC<UserDetailsDialogProps> = ({ 
  open, 
  onOpenChange, 
  user,
  onRefresh
}) => {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <UserDetailsHeader />
        <UserDetailsContent user={user} onRefresh={onRefresh} />
        <UserDetailsFooter onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
};
