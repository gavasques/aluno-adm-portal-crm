
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
import { MoreHorizontal, Eye, RotateCcw, Key, Shield, Trash2, UserX, HardDrive, Activity, Mail, GraduationCap, User } from "lucide-react";
import { User as UserType } from "@/types/user.types";

interface UserTableRowProps {
  user: UserType;
  onViewDetails: (user: UserType) => void;
  onResetPassword: (user: UserType) => void;
  onChangePassword: (user: UserType) => void;
  onDeleteUser: (user: UserType) => void;
  onSetPermissionGroup: (user: UserType) => void;
  onBanUser?: (user: UserType) => void;
  onStorageManagement: (user: UserType) => void;
  onActivityLogs: (user: UserType) => void;
  onSendMagicLink: (user: UserType) => void;
  onToggleMentor: (user: UserType) => void;
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
  onActivityLogs,
  onSendMagicLink,
  onToggleMentor,
  permissionGroups = [],
}) => {
  const formatLastLogin = (lastLogin: string) => {
    if (!lastLogin || lastLogin === 'Nunca') {
      return 'Nunca';
    }
    
    try {
      // Verifica se já está em formato brasileiro
      if (lastLogin.includes('/')) {
        return lastLogin;
      }
      
      // Tenta converter de ISO string para formato brasileiro
      const date = new Date(lastLogin);
      if (isNaN(date.getTime())) {
        return 'Data inválida';
      }
      
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return 'Data inválida';
    }
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
    <TableRow className="hover:bg-gray-50/80 transition-colors">
      <TableCell>
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-medium text-gray-900 truncate">{user.name}</div>
            <div className="text-sm text-gray-500 truncate">{user.email}</div>
          </div>
        </div>
      </TableCell>
      
      <TableCell>
        <div className="flex flex-col gap-1.5">
          <Badge 
            variant={getStatusVariant(user.status)}
            size="sm"
            className="w-fit"
          >
            {user.status}
          </Badge>
          
          <div className="flex flex-wrap gap-1">
            <Badge 
              variant={getRoleVariant(user.role)}
              size="sm"
              className="text-xs"
            >
              {user.role}
            </Badge>
            
            {user.is_mentor && (
              <Badge 
                variant="default" 
                size="sm"
                className="bg-purple-100 text-purple-800 hover:bg-purple-200 text-xs"
              >
                <GraduationCap className="h-3 w-3 mr-1" />
                Mentor
              </Badge>
            )}
            
            {isBanned && (
              <Badge 
                variant="destructive"
                size="sm" 
                className="text-xs"
              >
                Banido
              </Badge>
            )}
          </div>
        </div>
      </TableCell>
      
      <TableCell>
        <span className="text-sm font-medium text-gray-900">{user.role}</span>
      </TableCell>
      
      <TableCell>
        <div className="text-sm text-gray-600">
          {formatLastLogin(user.lastLogin)}
        </div>
      </TableCell>
      
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100">
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

            <DropdownMenuItem onClick={() => onActivityLogs(user)}>
              <Activity className="mr-2 h-4 w-4" />
              Logs de Atividade
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

            <DropdownMenuItem onClick={() => onSendMagicLink(user)}>
              <Mail className="mr-2 h-4 w-4" />
              Enviar Magic Link
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => onSetPermissionGroup(user)}>
              <Shield className="mr-2 h-4 w-4" />
              Definir Permissões
            </DropdownMenuItem>

            {user.role === 'Student' && (
              <DropdownMenuItem onClick={() => onToggleMentor(user)}>
                <GraduationCap className="mr-2 h-4 w-4" />
                {user.is_mentor ? 'Remover Mentor' : 'Tornar Mentor'}
              </DropdownMenuItem>
            )}
            
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
