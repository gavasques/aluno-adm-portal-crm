
import React from "react";
import { 
  TableRow, 
  TableCell 
} from "@/components/ui/table";
import StatusBadge from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
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
    is_mentor?: boolean;
  };
  onViewDetails: (user: any) => void;
  onResetPassword: (email: string) => void;
  onDeleteUser: (userId: string, email: string) => void;
  onToggleUserStatus: (userId: string, email: string, isActive: boolean) => void;
  onSetPermissionGroup?: (userId: string, email: string, permissionGroupId: string | null) => void;
  onToggleMentorStatus?: (userId: string, isMentor: boolean) => void;
}

const UserTableRow: React.FC<UserTableRowProps> = ({ 
  user,
  onViewDetails,
  onResetPassword,
  onDeleteUser,
  onToggleUserStatus,
  onSetPermissionGroup,
  onToggleMentorStatus
}) => {
  // Determinar se o usuário está ativo com base no status
  const isActive = user.status === "Ativo";

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-2">
            <User className="h-4 w-4 text-gray-600" />
          </div>
          <div>
            <div className="font-medium">{user.name || "Sem nome"}</div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <StatusBadge status={user.status} />
      </TableCell>
      <TableCell>{user.role || "Não definido"}</TableCell>
      <TableCell>
        {user.is_mentor ? (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <GraduationCap className="h-3 w-3 mr-1" />
            Mentor
          </Badge>
        ) : (
          <span className="text-gray-400">-</span>
        )}
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
                <span>Definir permissões</span>
              </DropdownMenuItem>
            )}

            {onToggleMentorStatus && (
              <DropdownMenuItem onClick={() => onToggleMentorStatus(user.id, !user.is_mentor)}>
                <GraduationCap className="mr-2 h-4 w-4" />
                <span>{user.is_mentor ? 'Remover mentor' : 'Tornar mentor'}</span>
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
