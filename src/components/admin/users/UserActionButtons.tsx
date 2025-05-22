
import React from "react";
import { Button } from "@/components/ui/button";
import { Mail, UserPlus } from "lucide-react";

interface UserActionButtonsProps {
  onAddUser: () => void;
  onInviteUser: () => void;
}

const UserActionButtons: React.FC<UserActionButtonsProps> = ({
  onAddUser,
  onInviteUser,
}) => {
  return (
    <div className="flex gap-2">
      <Button onClick={onInviteUser} variant="outline" className="gap-2">
        <Mail className="h-4 w-4" /> Convidar Usuário
      </Button>
      <Button onClick={onAddUser} className="gap-2">
        <UserPlus className="h-4 w-4" /> Adicionar Usuário
      </Button>
    </div>
  );
};

export default UserActionButtons;
