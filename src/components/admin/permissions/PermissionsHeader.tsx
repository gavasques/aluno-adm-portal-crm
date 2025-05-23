
import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface PermissionsHeaderProps {
  onAdd: () => void;
}

const PermissionsHeader: React.FC<PermissionsHeaderProps> = ({ onAdd }) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-portal-dark">Gestão de Permissões</h1>
      <Button onClick={onAdd}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Novo Grupo de Permissão
      </Button>
    </div>
  );
};

export default PermissionsHeader;
