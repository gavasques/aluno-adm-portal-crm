
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
import { Edit2, Trash2, Users, Menu, AlertTriangle } from "lucide-react";
import LoadingPermissions from "./LoadingPermissions";
import EmptyPermissions from "./EmptyPermissions";
import { Badge } from "@/components/ui/badge";
import { PermissionGroup } from "@/hooks/admin/usePermissionGroups";

interface PermissionsCardProps {
  permissionGroups: PermissionGroup[];
  isLoading: boolean;
  onEdit: (group: PermissionGroup) => void;
  onDelete: (group: PermissionGroup) => void;
  onViewUsers: (group: PermissionGroup) => void;
  onManageMenus?: (group: PermissionGroup) => void;
  groupMenuCounts?: Record<string, number>;
}

const PermissionsCard: React.FC<PermissionsCardProps> = ({
  permissionGroups,
  isLoading,
  onEdit,
  onDelete,
  onViewUsers,
  onManageMenus,
  groupMenuCounts = {},
}) => {
  const getMenuCountBadge = (groupId: string, isAdmin: boolean) => {
    const count = groupMenuCounts[groupId] || 0;
    
    if (isAdmin) {
      return (
        <Badge variant="default" className="bg-purple-100 text-purple-800">
          Admin Total
        </Badge>
      );
    }
    
    if (count === 0) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          Sem menus
        </Badge>
      );
    }
    
    if (count <= 3) {
      return (
        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
          {count} menus
        </Badge>
      );
    }
    
    return (
      <Badge variant="secondary" className="bg-green-50 text-green-700">
        {count} menus
      </Badge>
    );
  };

  const getGroupStatusBadge = (group: PermissionGroup) => {
    const menuCount = groupMenuCounts[group.id] || 0;
    
    if (group.is_admin || group.allow_admin_access) {
      return (
        <Badge variant="default" className="bg-blue-100 text-blue-800">
          ✓ Configurado
        </Badge>
      );
    }
    
    if (menuCount === 0) {
      return (
        <Badge variant="destructive">
          ⚠ Sem acesso
        </Badge>
      );
    }
    
    if (menuCount <= 3) {
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          ⚡ Limitado
        </Badge>
      );
    }
    
    return (
      <Badge variant="secondary" className="bg-green-50 text-green-700">
        ✓ Completo
      </Badge>
    );
  };

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
                <TableHead>Acesso</TableHead>
                <TableHead>Menus</TableHead>
                <TableHead>Status</TableHead>
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
                    <TableCell>
                      {getMenuCountBadge(group.id, group.is_admin || group.allow_admin_access)}
                    </TableCell>
                    <TableCell>
                      {getGroupStatusBadge(group)}
                    </TableCell>
                    <TableCell className="text-right flex justify-end space-x-2">
                      {onManageMenus && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onManageMenus(group)}
                          title="Gerenciar Menus"
                          className={
                            !group.is_admin && !group.allow_admin_access && (groupMenuCounts[group.id] || 0) === 0
                              ? "border-orange-300 text-orange-600 hover:bg-orange-50"
                              : ""
                          }
                        >
                          <Menu className="h-4 w-4" />
                          <span className="sr-only">Gerenciar Menus</span>
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onViewUsers(group)}
                        title="Ver Usuários"
                      >
                        <Users className="h-4 w-4" />
                        <span className="sr-only">Ver Usuários</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onEdit(group)}
                        title="Editar"
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
                        title="Excluir"
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
