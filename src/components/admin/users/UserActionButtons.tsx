
import React from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, Mail } from "lucide-react";

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
      <Button 
        onClick={onInviteUser} 
        variant="outline"
        className="flex items-center gap-2"
      >
        <Mail className="w-4 h-4" />
        Convidar Usuário
      </Button>
      <Button 
        onClick={onAddUser}
        className="flex items-center gap-2"
      >
        <UserPlus className="w-4 h-4" />
        Adicionar Usuário
      </Button>
    </div>
  );
};

export default UserActionButtons;
