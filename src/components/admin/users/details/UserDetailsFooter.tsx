
import React from "react";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface UserDetailsFooterProps {
  onClose: () => void;
}

const UserDetailsFooter: React.FC<UserDetailsFooterProps> = ({ onClose }) => {
  return (
    <DialogFooter className="gap-2 sm:gap-0">
      <Button variant="outline" onClick={onClose}>
        Fechar
      </Button>
    </DialogFooter>
  );
};

export default UserDetailsFooter;
