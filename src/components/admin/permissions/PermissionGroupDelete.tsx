
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { usePermissionGroups } from "@/hooks/admin/usePermissionGroups";
import { AlertTriangle, Loader2 } from "lucide-react";

interface PermissionGroupDeleteProps {
  permissionGroup: any;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const PermissionGroupDelete: React.FC<PermissionGroupDeleteProps> = ({
  permissionGroup,
  onOpenChange,
  onSuccess,
}) => {
  const { deletePermissionGroup } = usePermissionGroups();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!permissionGroup) return;
    
    try {
      setIsDeleting(true);
      await deletePermissionGroup(permissionGroup.id);
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao excluir grupo de permissão:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!permissionGroup) return null;

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-red-600">Excluir Grupo de Permissão</DialogTitle>
        <DialogDescription>
          Esta ação não pode ser desfeita. Isso excluirá permanentemente o grupo de permissão.
        </DialogDescription>
      </DialogHeader>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              Atenção: Os usuários vinculados a este grupo perderão suas permissões.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 bg-gray-50 p-4 rounded-md">
        <p className="font-medium">Informações do grupo:</p>
        <p className="mt-2"><span className="font-medium">Nome:</span> {permissionGroup.name}</p>
        <p className="mt-1"><span className="font-medium">Descrição:</span> {permissionGroup.description || "Sem descrição"}</p>
      </div>

      <div className="flex justify-end space-x-2 mt-8">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => onOpenChange(false)}
        >
          Cancelar
        </Button>
        <Button 
          type="button" 
          variant="destructive" 
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Confirmar Exclusão
        </Button>
      </div>
    </>
  );
};

export default PermissionGroupDelete;
