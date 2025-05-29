
import React from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import UserCreditsManagement from "../details/UserCreditsManagement";

interface UserCreditsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
}

export const UserCreditsDialog: React.FC<UserCreditsDialogProps> = ({ 
  open, 
  onOpenChange, 
  user
}) => {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Gestão de Créditos - {user.name}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-6">
          <UserCreditsManagement 
            userId={user.id} 
            userEmail={user.email} 
            userName={user.name} 
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
