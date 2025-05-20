
import React from "react";
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  isEditing: boolean;
}

const FormActions: React.FC<FormActionsProps> = ({ isEditing }) => {
  return (
    <div className="flex justify-end pt-4">
      <Button type="submit">
        {isEditing ? "Atualizar Fornecedor" : "Adicionar Fornecedor"}
      </Button>
    </div>
  );
};

export default FormActions;
