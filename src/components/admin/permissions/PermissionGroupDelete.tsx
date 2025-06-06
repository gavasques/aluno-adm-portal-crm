
import React, { useState } from "react";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertTriangle } from "lucide-react";
import { usePermissionGroupCrud } from "@/hooks/admin/permissions/usePermissionGroupCrud";
import { toast } from "@/hooks/use-toast";
import type { PermissionGroup } from "@/types/permissions";

interface PermissionGroupDeleteProps {
  permissionGroup: PermissionGroup;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const PermissionGroupDelete: React.FC<PermissionGroupDeleteProps> = ({
  permissionGroup,
  onOpenChange,
  onSuccess,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { deletePermissionGroup } = usePermissionGroupCrud();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      
      const result = await deletePermissionGroup(permissionGroup.id);
      
      if (result.success) {
        toast({
          title: "Sucesso",
          description: "Grupo de permissão removido com sucesso",
        });
        onSuccess();
        onOpenChange(false);
      } else {
        toast({
          title: "Erro",
          description: result.error || "Erro ao remover grupo de permissão",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Erro ao deletar grupo:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro inesperado ao remover grupo",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-red-600">
          <AlertTriangle className="h-5 w-5" />
          Confirmar Exclusão
        </DialogTitle>
        <DialogDescription>
          Esta ação não pode ser desfeita. O grupo será permanentemente removido.
        </DialogDescription>
      </DialogHeader>

      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <strong>Atenção:</strong> Você está prestes a excluir o grupo "{permissionGroup.name}".
          Esta ação é irreversível e pode afetar usuários que dependem dessas permissões.
        </AlertDescription>
      </Alert>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Detalhes do grupo:</h4>
        <div className="space-y-1 text-sm text-gray-600">
          <p><strong>Nome:</strong> {permissionGroup.name}</p>
          {permissionGroup.description && (
            <p><strong>Descrição:</strong> {permissionGroup.description}</p>
          )}
          <p><strong>Tipo:</strong> {
            permissionGroup.is_admin ? "Administrador Total" : 
            permissionGroup.allow_admin_access ? "Admin Limitado" : "Usuário"
          }</p>
          <p><strong>Criado em:</strong> {new Date(permissionGroup.created_at).toLocaleDateString('pt-BR')}</p>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={isDeleting}
        >
          Cancelar
        </Button>
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Removendo...
            </>
          ) : (
            "Confirmar Exclusão"
          )}
        </Button>
      </div>
    </div>
  );
};

export default PermissionGroupDelete;
