
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { TableRow, TableCell } from '@/components/ui/table';
import { User } from '@/types/user.types';
import UserStatusBadge from '@/components/admin/users/UserStatusBadge';
import { ModernUserActions } from './ModernUserActions';
import { 
  User as UserIcon, 
  Shield,
  Clock,
  GraduationCap
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
      whileHover={{ scale: 1.002 }}
    >
      {/* Coluna Usuário */}
      <TableCell className="w-[300px] py-4">
        <div className="flex items-center space-x-3">
          <motion.div 
            className={`h-10 w-10 rounded-full flex items-center justify-center backdrop-blur-sm border flex-shrink-0 ${
              isAdminUser ? "bg-blue-100/80 border-blue-200" : 
              isTemporaryGroup ? "bg-orange-100/80 border-orange-200" : "bg-gray-100/80 border-gray-200"
            }`}
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {getUserIcon()}
          </motion.div>
          <div className="min-w-0 flex-1">
            <div className="font-medium text-gray-900 dark:text-white truncate text-sm">
              {user.name || "Sem nome"}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user.email}
            </div>
          </div>
        </div>
      </TableCell>
      
      {/* Coluna Status & Badges */}
      <TableCell className="w-[200px] py-4">
        <div className="flex items-center justify-start space-x-2">
          <UserStatusBadge 
            status={user.status} 
            permissionGroupId={user.permission_group_id}
            isTemporaryGroup={isTemporaryGroup}
          />
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
      
      {/* Coluna Função */}
      <TableCell className="w-[150px] py-4">
        <div className="flex items-center">
          <span className="font-medium text-sm">{user.role || "Não definido"}</span>
        </div>
      </TableCell>
      
      {/* Coluna Último Acesso */}
      <TableCell className="w-[150px] py-4">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {user.lastLogin || "Nunca"}
        </span>
      </TableCell>
      
      {/* Coluna Ações */}
      <TableCell className="w-[80px] py-4">
        <div className="flex justify-center">
          <ModernUserActions
            user={user}
            onViewDetails={onViewDetails}
            onResetPassword={onResetPassword}
            onChangePassword={onChangePassword}
            onDeleteUser={onDeleteUser}
            onSetPermissionGroup={onSetPermissionGroup}
            onStorageManagement={onStorageManagement}
            onActivityLogs={onActivityLogs}
            onSendMagicLink={onSendMagicLink}
            onToggleMentor={onToggleMentor}
          />
        </div>
      </TableCell>
    </motion.tr>
  );
});

ModernUserTableRow.displayName = 'ModernUserTableRow';
