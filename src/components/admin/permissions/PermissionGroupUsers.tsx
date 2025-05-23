
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { usePermissionGroups } from "@/hooks/admin/usePermissionGroups";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User, UserX, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface PermissionGroupUsersProps {
  permissionGroup: any;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface UserWithPermission {
  id: string;
  name: string;
  email: string;
  role: string;
}

const PermissionGroupUsers: React.FC<PermissionGroupUsersProps> = ({
  permissionGroup,
  onOpenChange,
  onSuccess
}) => {
  const { getPermissionGroupUsers, removeUserFromGroup } = usePermissionGroups();
  const [users, setUsers] = useState<UserWithPermission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      if (!permissionGroup) return;
      
      try {
        setIsLoading(true);
        const groupUsers = await getPermissionGroupUsers(permissionGroup.id);
        setUsers(groupUsers);
      } catch (error) {
        console.error("Erro ao carregar usuários do grupo:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, [permissionGroup, getPermissionGroupUsers]);

  const handleRemoveUser = async (userId: string) => {
    try {
      setLoadingUserId(userId);
      await removeUserFromGroup(userId);
      
      // Atualizar a lista de usuários
      setUsers(users.filter(user => user.id !== userId));
      onSuccess();
    } catch (error) {
      console.error("Erro ao remover usuário do grupo:", error);
    } finally {
      setLoadingUserId(null);
    }
  };

  if (!permissionGroup) return null;

  return (
    <>
      <DialogHeader>
        <DialogTitle>Usuários do Grupo: {permissionGroup.name}</DialogTitle>
      </DialogHeader>

      <div className="mt-6">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            <span>Carregando usuários...</span>
          </div>
        ) : users.length > 0 ? (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name || "Sem nome"}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role || "-"}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleRemoveUser(user.id)}
                        disabled={loadingUserId === user.id}
                      >
                        {loadingUserId === user.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <UserX className="h-4 w-4" />
                        )}
                        <span className="ml-1">Remover</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center p-8 border rounded-md">
            <User className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-600">Nenhum usuário vinculado a este grupo.</p>
          </div>
        )}
      </div>

      <Separator className="my-6" />
      
      <div className="flex justify-end">
        <Button 
          type="button" 
          onClick={() => onOpenChange(false)}
        >
          Fechar
        </Button>
      </div>
    </>
  );
};

export default PermissionGroupUsers;
