
import React from "react";
import { 
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

import UserDetailsHeader from "./details/UserDetailsHeader";
import UserDetailsContent from "./details/UserDetailsContent";
import UserDetailsFooter from "./details/UserDetailsFooter";

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
    tasks?: any[];
  } | null;
}

const UserDetailsDialog: React.FC<UserDetailsDialogProps> = ({ 
  open, 
  onOpenChange, 
  user 
}) => {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <UserDetailsHeader />
        <UserDetailsContent user={user} />
        <UserDetailsFooter onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsDialog;
