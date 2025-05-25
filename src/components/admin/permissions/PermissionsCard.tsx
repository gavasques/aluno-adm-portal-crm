
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
import { Edit2, Trash2, Users, AlertTriangle, HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
  groupMenuCounts?: Record<string, number>;
}

const PermissionsCard: React.FC<PermissionsCardProps> = ({
  permissionGroups,
  isLoading,
  onEdit,
  onDelete,
  onViewUsers,
  groupMenuCounts = {},
}) => {
  const getMenuCountBadge = (groupId: string, isAdmin: boolean, allowAdminAccess: boolean) => {
    const count = groupMenuCounts[groupId] || 0;
    
    if (isAdmin) {
      return (
        <Badge variant="default" className="bg-purple-100 text-purple-800">
          Acesso Total
        </Badge>
      );
    }
    
    if (allowAdminAccess && count === 0) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          Sem menus
        </Badge>
      );
    }
    
    if (count === 0) {
      return (
        <Badge variant="outline" className="text-gray-500">
          Nenhum
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
    
    if (group.is_admin) {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          ✓ Configurado
        </Badge>
      );
    }
    
    if (group.allow_admin_access && menuCount === 0) {
      return (
        <Badge variant="destructive">
          ⚠ Sem Acesso
        </Badge>
      );
    }
    
    if (group.allow_admin_access && menuCount > 0) {
      return (
        <Badge variant="default" className="bg-blue-100 text-blue-800">
          ✓ Configurado
        </Badge>
      );
    }
    
    if (!group.allow_admin_access) {
      return (
        <Badge variant="outline" className="bg-gray-50 text-gray-600">
          Sem Acesso Admin
        </Badge>
      );
    }
    
    return (
      <Badge variant="secondary" className="bg-green-50 text-green-700">
        ✓ Configurado
      </Badge>
    );
  };

  return (
    <TooltipProvider>
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
                  <TableHead>Nome do Grupo</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="flex items-center gap-1">
                    Perfil do Usuário
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-3 w-3 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Define se é um administrador completo ou usuário padrão</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableHead>
                  <TableHead className="flex items-center gap-1">
                    Acesso à Área Admin
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-3 w-3 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Se o grupo pode acessar a área administrativa do sistema</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableHead>
                  <TableHead className="flex items-center gap-1">
                    Qtd. de Menus
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-3 w-3 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Quantidade de menus/seções que o grupo pode acessar</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableHead>
                  <TableHead className="flex items-center gap-1">
                    Situação do Grupo
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-3 w-3 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Status geral da configuração do grupo</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableHead>
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
                          <Badge variant="default">Administrador</Badge>
                        ) : (
                          <Badge variant="secondary">Usuário Padrão</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {group.allow_admin_access ? (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            Permitido
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-gray-600">
                            Negado
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {getMenuCountBadge(group.id, group.is_admin, group.allow_admin_access)}
                      </TableCell>
                      <TableCell>
                        {getGroupStatusBadge(group)}
                      </TableCell>
                      <TableCell className="text-right flex justify-end space-x-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => onViewUsers(group)}
                            >
                              <Users className="h-4 w-4" />
                              <span className="sr-only">Ver Usuários</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Ver usuários neste grupo</p>
                          </TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => onEdit(group)}
                            >
                              <Edit2 className="h-4 w-4" />
                              <span className="sr-only">Editar</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Editar grupo de permissão</p>
                          </TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
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
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{group.is_admin ? "Não é possível excluir admin" : "Excluir grupo"}</p>
                          </TooltipContent>
                        </Tooltip>
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
    </TooltipProvider>
  );
};

export default PermissionsCard;
