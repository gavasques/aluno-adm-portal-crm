
import React, { useState } from "react";
import { 
  TableRow, 
  TableCell 
} from "@/components/ui/table";
import UserStatusBadge from "./UserStatusBadge";
import StoragePercentageBadge from "./StoragePercentageBadge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  User, 
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

interface UserTableRowProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    lastLogin: string;
    permission_group_id?: string | null;
    storage_used_mb?: number;
    storage_limit_mb?: number;
    is_mentor?: boolean;
  };
  onViewDetails: (user: any) => void;
  onResetPassword: (email: string) => void;
  onDeleteUser: (userId: string, email: string) => void;
  onToggleUserStatus: (userId: string, email: string, isActive: boolean) => void;
  onSetPermissionGroup?: (userId: string, email: string, permissionGroupId: string | null) => void;
}

// ID do grupo "Geral" (temporário) baseado nos logs
const GERAL_GROUP_ID = "564c55dc-0ab8-481e-a0bc-97ea7e484b88";

const UserTableRow: React.FC<UserTableRowProps> = ({ 
  user,
  onViewDetails,
  onResetPassword,
  onDeleteUser,
  onToggleUserStatus,
  onSetPermissionGroup
}) => {
  // Determinar se o usuário está ativo com base no status
  const normalizedStatus = typeof user.status === 'string' ? user.status.toLowerCase() : '';
  const isActive = normalizedStatus === "ativo" || normalizedStatus === "active";
  
  // Determinar se o usuário está no grupo temporário "Geral"
  const isTemporaryGroup = user.permission_group_id === GERAL_GROUP_ID && user.role !== "Admin";

  // Determinar se é um usuário admin
  const isAdminUser = user.role === "Admin";

  const getUserIcon = () => {
    if (isAdminUser) {
      return <Shield className="h-4 w-4 text-blue-600" />;
    }
    if (isTemporaryGroup) {
      return <Clock className="h-4 w-4 text-orange-600" />;
    }
    return <User className="h-4 w-4 text-gray-600" />;
  };

  const getRowClass = () => {
    if (isAdminUser) {
      return "bg-blue-50/30 border-l-4 border-l-blue-300";
    }
    if (isTemporaryGroup) {
      return "bg-orange-50/30 border-l-4 border-l-orange-300";
    }
    return "";
  };

  return (
    <TableRow className={getRowClass()}>
      <TableCell>
        <div className="flex items-center">
          <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-2 ${
            isAdminUser ? "bg-blue-100" : 
            isTemporaryGroup ? "bg-orange-100" : "bg-gray-100"
          }`}>
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
          isTemporaryGroup={isTemporaryGroup}
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
            <DropdownMenuItem onClick={() => onResetPassword(user.email)}>
              <KeyRound className="mr-2 h-4 w-4" />
              <span>Redefinir senha</span>
            </DropdownMenuItem>

            {onSetPermissionGroup && (
              <DropdownMenuItem onClick={() => onSetPermissionGroup(user.id, user.email, user.permission_group_id)}>
                <Lock className="mr-2 h-4 w-4" />
                <span>
                  {isTemporaryGroup ? "Atribuir grupo definitivo" : "Definir permissões"}
                </span>
              </DropdownMenuItem>
            )}
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem
              onClick={() => onToggleUserStatus(
                user.id, 
                user.email, 
                !isActive
              )}
            >
              {isActive ? (
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
              onClick={() => onDeleteUser(user.id, user.email)}
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

export default UserTableRow;
