
import React from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "@/components/ui/table";
import { Edit2, Trash2, Users } from "lucide-react";
import LoadingPermissions from "./LoadingPermissions";
import EmptyPermissions from "./EmptyPermissions";
import { Badge } from "@/components/ui/badge";

interface PermissionGroup {
  id: string;
  name: string;
  description: string | null;
  is_admin: boolean;
  allow_admin_access: boolean;
  created_at: string;
}

interface PermissionsCardProps {
  permissionGroups: PermissionGroup[];
  isLoading: boolean;
  onEdit: (group: PermissionGroup) => void;
  onDelete: (group: PermissionGroup) => void;
  onViewUsers: (group: PermissionGroup) => void;
}

const PermissionsCard: React.FC<PermissionsCardProps> = ({
  permissionGroups,
  isLoading,
  onEdit,
  onDelete,
  onViewUsers,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Grupos de Permissão</CardTitle>
        <CardDescription>
          Gerencie os grupos de permissão do sistema. Cada grupo define quais áreas do sistema os usuários podem acessar.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Acesso Admin</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <LoadingPermissions />
              ) : permissionGroups.length > 0 ? (
                permissionGroups.map((group) => (
                  <TableRow key={group.id}>
                    <TableCell className="font-medium">{group.name}</TableCell>
                    <TableCell>{group.description || "-"}</TableCell>
                    <TableCell>
                      {group.is_admin ? (
                        <Badge variant="default">Admin</Badge>
                      ) : (
                        <Badge variant="secondary">Padrão</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {group.allow_admin_access ? (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          Permitido
                        </Badge>
                      ) : (
                        <Badge variant="outline">
                          Negado
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onViewUsers(group)}
                      >
                        <Users className="h-4 w-4" />
                        <span className="sr-only">Ver Usuários</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onEdit(group)}
                      >
                        <Edit2 className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-red-600 hover:text-red-700" 
                        onClick={() => onDelete(group)}
                        disabled={group.is_admin}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Excluir</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <EmptyPermissions />
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default PermissionsCard;
