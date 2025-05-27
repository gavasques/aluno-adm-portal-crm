
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  User as UserIcon, 
  MoreVertical, 
  Eye, 
  KeyRound,
  UserX,
  UserCheck,
  UserMinus,
  Lock,
  Clock,
  Shield,
  GraduationCap
} from "lucide-react";
import { User } from "@/types/user.types";
import { useUserStatusLogic } from "@/hooks/users/useUserStatusLogic";
import UserStatusBadge from "./UserStatusBadge";

interface OptimizedUserTableRowProps {
  user: User;
  onViewDetails: (user: User) => void;
  onResetPassword: (user: User) => void;
  onDeleteUser: (user: User) => void;
  onToggleUserStatus: (user: User) => void;
  onSetPermissionGroup?: (user: User) => void;
}

export const OptimizedUserTableRow: React.FC<OptimizedUserTableRowProps> = ({ 
  user,
  onViewDetails,
  onResetPassword,
  onDeleteUser,
  onToggleUserStatus,
  onSetPermissionGroup
}) => {
  const { 
    isActive, 
    isTemporaryGroup, 
    isAdminUser, 
    getUserRowClass 
  } = useUserStatusLogic();

  const isUserActive = isActive(user.status);
  const isTemporary = isTemporaryGroup(user.permission_group_id, user.role);
  const isAdmin = isAdminUser(user.role);

  const getUserIcon = () => {
    if (isAdmin) return <Shield className="h-4 w-4 text-blue-600" />;
    if (isTemporary) return <Clock className="h-4 w-4 text-orange-600" />;
    return <UserIcon className="h-4 w-4 text-gray-600" />;
  };

  const getIconBgClass = () => {
    if (isAdmin) return "bg-blue-100";
    if (isTemporary) return "bg-orange-100";
    return "bg-gray-100";
  };

  return (
    <TableRow className={getUserRowClass(user.role, isTemporary)}>
      <TableCell>
        <div className="flex items-center">
          <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-2 ${getIconBgClass()}`}>
            {getUserIcon()}
          </div>
          <div>
            <div className="font-medium">{user.name || "Sem nome"}</div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <UserStatusBadge 
          status={user.status} 
          permissionGroupId={user.permission_group_id}
          isTemporaryGroup={isTemporary}
        />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <span>{user.role || "Não definido"}</span>
          {user.is_mentor && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              <GraduationCap className="h-3 w-3 mr-1" />
              Mentor
            </span>
          )}
        </div>
      </TableCell>
      <TableCell>{user.lastLogin || "Nunca"}</TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menu</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onViewDetails(user)}>
              <Eye className="mr-2 h-4 w-4" />
              <span>Ver detalhes</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onResetPassword(user)}>
              <KeyRound className="mr-2 h-4 w-4" />
              <span>Redefinir senha</span>
            </DropdownMenuItem>

            {onSetPermissionGroup && (
              <DropdownMenuItem onClick={() => onSetPermissionGroup(user)}>
                <Lock className="mr-2 h-4 w-4" />
                <span>
                  {isTemporary ? "Atribuir grupo definitivo" : "Definir permissões"}
                </span>
              </DropdownMenuItem>
            )}
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={() => onToggleUserStatus(user)}>
              {isUserActive ? (
                <>
                  <UserMinus className="mr-2 h-4 w-4" />
                  <span>Desativar usuário</span>
                </>
              ) : (
                <>
                  <UserCheck className="mr-2 h-4 w-4" />
                  <span>Ativar usuário</span>
                </>
              )}
            </DropdownMenuItem>

            <DropdownMenuItem 
              className="text-red-600" 
              onClick={() => onDeleteUser(user)}
            >
              <UserX className="mr-2 h-4 w-4" />
              <span>Excluir usuário</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};
