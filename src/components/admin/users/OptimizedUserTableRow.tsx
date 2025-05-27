
import React from "react";
import { 
  TableRow, 
  TableCell 
} from "@/components/ui/table";
import { User } from "@/types/user.types";
import UserStatusBadge from "./UserStatusBadge";
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

interface OptimizedUserTableRowProps {
  user: User;
  onViewDetails: (user: User) => void;
  onResetPassword: (user: User) => void;
  onDeleteUser: (user: User) => void;
  onToggleUserStatus: (user: User) => void;
  onSetPermissionGroup?: (user: User) => void;
}

// ID do grupo "Geral" (temporário) baseado nos logs
const GERAL_GROUP_ID = "564c55dc-0ab8-481e-a0bc-97ea7e484b88";

export const OptimizedUserTableRow: React.FC<OptimizedUserTableRowProps> = ({ 
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
    return <UserIcon className="h-4 w-4 text-gray-600" />;
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

  const handleViewDetailsClick = () => {
    console.log('🎯 VIEW DETAILS CLICKED - Executando handler para:', user.email);
    onViewDetails(user);
  };

  const handleResetPasswordClick = () => {
    console.log('🔑 RESET PASSWORD CLICKED - Executando handler para:', user.email);
    onResetPassword(user);
  };

  const handleDeleteClick = () => {
    console.log('🗑️ DELETE USER CLICKED - Executando handler para:', user.email);
    onDeleteUser(user);
  };

  const handleToggleStatusClick = () => {
    console.log('🔄 TOGGLE STATUS CLICKED - Executando handler para:', user.email);
    onToggleUserStatus(user);
  };

  const handleSetPermissionGroupClick = () => {
    console.log('🔐 SET PERMISSION GROUP CLICKED - Executando handler para:', user.email);
    if (onSetPermissionGroup) {
      onSetPermissionGroup(user);
    }
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
            <Button 
              variant="ghost" 
              className="h-8 w-8 p-0"
              onClick={() => console.log('🔽 Dropdown trigger clicked for:', user.email)}
            >
              <span className="sr-only">Abrir menu</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={handleViewDetailsClick}>
              <Eye className="mr-2 h-4 w-4" />
              <span>Ver detalhes</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={handleResetPasswordClick}>
              <KeyRound className="mr-2 h-4 w-4" />
              <span>Redefinir senha</span>
            </DropdownMenuItem>

            {onSetPermissionGroup && (
              <DropdownMenuItem onClick={handleSetPermissionGroupClick}>
                <Lock className="mr-2 h-4 w-4" />
                <span>
                  {isTemporaryGroup ? "Atribuir grupo definitivo" : "Definir permissões"}
                </span>
              </DropdownMenuItem>
            )}
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={handleToggleStatusClick}>
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

            <DropdownMenuItem onClick={handleDeleteClick} className="text-red-600 focus:text-red-600 hover:text-red-600">
              <UserX className="mr-2 h-4 w-4" />
              <span>Excluir usuário</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};
