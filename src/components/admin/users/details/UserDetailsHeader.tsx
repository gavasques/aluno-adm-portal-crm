
import React from "react";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User } from "lucide-react";

const UserDetailsHeader: React.FC = () => {
  return (
    <DialogHeader>
      <DialogTitle className="flex items-center">
        <User className="mr-2 h-5 w-5" />
        Detalhes do Usuário
      </DialogTitle>
      <DialogDescription>
        Informações detalhadas sobre o usuário selecionado.
      </DialogDescription>
    </DialogHeader>
  );
};

export default UserDetailsHeader;
