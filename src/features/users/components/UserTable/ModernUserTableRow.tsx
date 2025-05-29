
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { TableRow, TableCell } from '@/components/ui/table';
import { User } from '@/types/user.types';
import UserStatusBadge from '@/components/admin/users/UserStatusBadge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  GraduationCap,
  Mail,
  Settings,
  HardDrive,
  Activity,
  Link,
  Edit
} from 'lucide-react';

interface ModernUserTableRowProps {
  user: User;
  onViewDetails: (user: User) => void;
  onResetPassword: (user: User) => void;
  onChangePassword: (user: User) => void;
  onDeleteUser: (user: User) => void;
  onSetPermissionGroup: (user: User) => void;
  onStorageManagement: (user: User) => void;
  onActivityLogs: (user: User) => void;
  onSendMagicLink: (user: User) => void;
  onToggleMentor: (user: User) => void;
  permissionGroups?: Array<{ id: string; name: string; }>;
}

const GERAL_GROUP_ID = "564c55dc-0ab8-481e-a0bc-97ea7e484b88";

export const ModernUserTableRow = memo<ModernUserTableRowProps>(({ 
  user,
  onViewDetails,
  onResetPassword,
  onChangePassword,
  onDeleteUser,
  onSetPermissionGroup,
  onStorageManagement,
  onActivityLogs,
  onSendMagicLink,
  onToggleMentor,
}) => {
  const normalizedStatus = typeof user.status === 'string' ? user.status.toLowerCase() : '';
  const isActive = normalizedStatus === "ativo" || normalizedStatus === "active";
  const isTemporaryGroup = user.permission_group_id === GERAL_GROUP_ID && user.role !== "Admin";
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
    let baseClass = "group hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all duration-200 backdrop-blur-sm";
    
    if (isAdminUser) {
      return `${baseClass} bg-gradient-to-r from-blue-50/50 to-transparent border-l-4 border-l-blue-400`;
    }
    if (isTemporaryGroup) {
      return `${baseClass} bg-gradient-to-r from-orange-50/50 to-transparent border-l-4 border-l-orange-400`;
    }
    return baseClass;
  };

  return (
    <motion.tr
      className={getRowClass()}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.005 }}
    >
      <TableCell>
        <div className="flex items-center space-x-3">
          <motion.div 
            className={`h-10 w-10 rounded-full flex items-center justify-center backdrop-blur-sm border ${
              isAdminUser ? "bg-blue-100/80 border-blue-200" : 
              isTemporaryGroup ? "bg-orange-100/80 border-orange-200" : "bg-gray-100/80 border-gray-200"
            }`}
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {getUserIcon()}
          </motion.div>
          <div className="min-w-0 flex-1">
            <div className="font-medium text-gray-900 dark:text-white truncate">
              {user.name || "Sem nome"}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {user.email}
            </div>
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
          <span className="font-medium">{user.role || "Não definido"}</span>
          {user.is_mentor && (
            <motion.span 
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 dark:from-purple-900 dark:to-purple-800 dark:text-purple-200"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <GraduationCap className="h-3 w-3 mr-1" />
              Mentor
            </motion.span>
          )}
        </div>
      </TableCell>
      
      <TableCell className="text-sm text-gray-600 dark:text-gray-400">
        {user.lastLogin || "Nunca"}
      </TableCell>
      
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="ghost" 
                className="h-8 w-8 p-0 hover:bg-white/80 dark:hover:bg-slate-700/80 backdrop-blur-sm"
              >
                <span className="sr-only">Abrir menu</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </motion.div>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="w-56 backdrop-blur-xl bg-white/90 dark:bg-slate-800/90 border-white/20 shadow-xl"
          >
            <DropdownMenuItem onClick={() => onViewDetails(user)} className="group">
              <Eye className="mr-2 h-4 w-4 group-hover:text-blue-600 transition-colors" />
              <span>Ver detalhes</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => onResetPassword(user)} className="group">
              <KeyRound className="mr-2 h-4 w-4 group-hover:text-green-600 transition-colors" />
              <span>Redefinir senha</span>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => onChangePassword(user)} className="group">
              <Edit className="mr-2 h-4 w-4 group-hover:text-blue-600 transition-colors" />
              <span>Alterar senha</span>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => onSendMagicLink(user)} className="group">
              <Link className="mr-2 h-4 w-4 group-hover:text-purple-600 transition-colors" />
              <span>Enviar Magic Link</span>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => onSetPermissionGroup(user)} className="group">
              <Lock className="mr-2 h-4 w-4 group-hover:text-orange-600 transition-colors" />
              <span>
                {isTemporaryGroup ? "Atribuir grupo definitivo" : "Gerenciar permissões"}
              </span>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => onStorageManagement(user)} className="group">
              <HardDrive className="mr-2 h-4 w-4 group-hover:text-indigo-600 transition-colors" />
              <span>Gerenciar armazenamento</span>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => onActivityLogs(user)} className="group">
              <Activity className="mr-2 h-4 w-4 group-hover:text-gray-600 transition-colors" />
              <span>Logs de atividade</span>
            </DropdownMenuItem>

            {user.role === 'Student' && (
              <DropdownMenuItem onClick={() => onToggleMentor(user)} className="group">
                <GraduationCap className="mr-2 h-4 w-4 group-hover:text-purple-600 transition-colors" />
                <span>{user.is_mentor ? 'Remover como mentor' : 'Tornar mentor'}</span>
              </DropdownMenuItem>
            )}
            
            <DropdownMenuSeparator className="bg-white/20" />
            
            <DropdownMenuItem 
              onClick={() => onDeleteUser(user)} 
              className="text-red-600 focus:text-red-600 hover:text-red-600 group"
            >
              <UserX className="mr-2 h-4 w-4 group-hover:text-red-700 transition-colors" />
              <span>Excluir usuário</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </motion.tr>
  );
});

ModernUserTableRow.displayName = 'ModernUserTableRow';
