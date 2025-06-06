
import React, { useState, useEffect } from "react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Users, Trash2, Mail } from "lucide-react";
import { usePermissionGroupOperations } from "@/hooks/admin/permissions/usePermissionGroupOperations";
import { toast } from "@/hooks/use-toast";
import type { PermissionGroup } from "@/types/permissions";

interface PermissionGroupUsersProps {
  permissionGroup: PermissionGroup;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const PermissionGroupUsers: React.FC<PermissionGroupUsersProps> = ({
  permissionGroup,
  onOpenChange,
  onSuccess,
}) => {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingUser, setRemovingUser] = useState<string | null>(null);
  
  const { getPermissionGroupUsers, removeUserFromGroup } = usePermissionGroupOperations();

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsLoading(true);
        const groupUsers = await getPermissionGroupUsers(permissionGroup.id);
        setUsers(groupUsers);
      } catch (error: any) {
        console.error("Erro ao carregar usuários:", error);
        toast({
          title: "Erro",
          description: "Erro ao carregar usuários do grupo",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, [permissionGroup.id, getPermissionGroupUsers]);

  const handleRemoveUser = async (userId: string, userEmail: string) => {
    try {
      setRemovingUser(userId);
      
      await removeUserFromGroup(userId);
      
      setUsers(prev => prev.filter(user => user.id !== userId));
      
      toast({
        title: "Sucesso",
        description: `Usuário ${userEmail} removido do grupo`,
      });
      
      onSuccess();
    } catch (error: any) {
      console.error("Erro ao remover usuário:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao remover usuário do grupo",
        variant: "destructive",
      });
    } finally {
      setRemovingUser(null);
    }
  };

  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Usuários do Grupo: {permissionGroup.name}
        </DialogTitle>
      </DialogHeader>

      {/* Informações do Grupo */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">{permissionGroup.name}</h3>
              {permissionGroup.description && (
                <p className="text-sm text-gray-600">{permissionGroup.description}</p>
              )}
            </div>
            <Badge variant={permissionGroup.is_admin ? "destructive" : "secondary"}>
              {permissionGroup.is_admin ? "Admin Total" : 
               permissionGroup.allow_admin_access ? "Admin Limitado" : "Usuário"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Usuários */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">
            Usuários ({isLoading ? "..." : users.length})
          </h4>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Carregando usuários...</span>
          </div>
        ) : users.length > 0 ? (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {users.map((user) => (
              <Card key={user.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Mail className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{user.name || "Nome não informado"}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        {user.role && (
                          <Badge variant="outline" className="text-xs mt-1">
                            {user.role}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveUser(user.id, user.email)}
                      disabled={removingUser === user.id}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      {removingUser === user.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum usuário encontrado
              </h3>
              <p className="text-gray-600">
                Este grupo ainda não possui usuários vinculados.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={() => onOpenChange(false)}>
          Fechar
        </Button>
      </div>
    </div>
  );
};

export default PermissionGroupUsers;
