
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, RotateCcw, Key, Shield, Trash2, UserX, HardDrive } from "lucide-react";
import { User } from "@/types/user.types";
import StoragePercentageBadge from "@/components/admin/users/StoragePercentageBadge";

interface UserTableRowProps {
  user: User;
  onViewDetails: (user: User) => void;
  onResetPassword: (user: User) => void;
  onChangePassword: (user: User) => void;
  onDeleteUser: (user: User) => void;
  onSetPermissionGroup: (user: User) => void;
  onBanUser?: (user: User) => void;
  onStorageManagement: (user: User) => void;
  permissionGroups?: Array<{ id: string; name: string; }>;
}

export const UserTableRow: React.FC<UserTableRowProps> = ({
  user,
  onViewDetails,
  onResetPassword,
  onChangePassword,
  onDeleteUser,
  onSetPermissionGroup,
  onBanUser,
  onStorageManagement,
  permissionGroups = [],
}) => {
  const formatMB = (mb: number) => {
    if (mb >= 1024) {
      return `${(mb / 1024).toFixed(1)}GB`;
    }
    return `${mb}MB`;
  };

  const getStatusVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'ativo':
        return 'default';
      case 'inativo':
        return 'secondary';
      case 'pendente':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getRoleVariant = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'destructive';
      case 'mentor':
        return 'default';
      case 'student':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  // Verificar se o usuário está banido
  const isBanned = permissionGroups.find(g => g.id === user.permission_group_id)?.name?.toLowerCase() === "banido";

  return (
    <TableRow className="hover:bg-gray-50">
      <TableCell>
        <div className="space-y-1">
          <div className="font-medium">{user.name}</div>
          <div className="text-sm text-gray-500">{user.email}</div>
        </div>
      </TableCell>
      
      <TableCell>
        <div className="flex gap-2">
          <Badge variant={getRoleVariant(user.role)}>
            {user.role}
          </Badge>
          {isBanned && (
            <Badge variant="destructive">
              Banido
            </Badge>
          )}
        </div>
      </TableCell>
      
      <TableCell>
        <Badge variant={getStatusVariant(user.status)}>
          {user.status}
        </Badge>
      </TableCell>
      
      <TableCell>
        <div className="text-sm text-gray-600">
          {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('pt-BR') : 'Nunca'}
        </div>
      </TableCell>
      
      <TableCell>
        <div className="flex items-center gap-2">
          <span className="text-sm font-mono">
            {formatMB(user.storage_used_mb || 0)} / {formatMB(user.storage_limit_mb || 100)}
          </span>
          <StoragePercentageBadge 
            storageUsedMb={user.storage_used_mb || 0}
            storageLimitMb={user.storage_limit_mb || 100}
          />
        </div>
      </TableCell>
      
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => onViewDetails(user)}>
              <Eye className="mr-2 h-4 w-4" />
              Ver Detalhes
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => onStorageManagement(user)}>
              <HardDrive className="mr-2 h-4 w-4" />
              Gerenciar Armazenamento
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={() => onResetPassword(user)}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Resetar Senha
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => onChangePassword(user)}>
              <Key className="mr-2 h-4 w-4" />
              Alterar Senha
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => onSetPermissionGroup(user)}>
              <Shield className="mr-2 h-4 w-4" />
              Definir Permissões
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            {onBanUser && !isBanned && (
              <>
                <DropdownMenuItem 
                  onClick={() => onBanUser(user)}
                  className="text-orange-600 focus:text-orange-600"
                >
                  <UserX className="mr-2 h-4 w-4" />
                  Banir Usuário
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            
            <DropdownMenuItem 
              onClick={() => onDeleteUser(user)}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir Usuário
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};
