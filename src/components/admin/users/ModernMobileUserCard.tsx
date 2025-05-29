
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Edit, 
  Trash2, 
  Mail, 
  Shield, 
  User, 
  MoreVertical,
  Eye,
  KeyRound,
  Lock,
  HardDrive,
  Activity,
  Link,
  GraduationCap
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import UserStatusBadge from './UserStatusBadge';
import { User as UserType } from '@/types/user.types';

interface ModernMobileUserCardProps {
  user: UserType;
  onViewDetails: (user: UserType) => void;
  onResetPassword: (user: UserType) => void;
  onChangePassword: (user: UserType) => void;
  onDeleteUser: (user: UserType) => void;
  onSetPermissionGroup: (user: UserType) => void;
  onStorageManagement: (user: UserType) => void;
  onActivityLogs: (user: UserType) => void;
  onSendMagicLink: (user: UserType) => void;
  onToggleMentor: (user: UserType) => void;
}

const GERAL_GROUP_ID = "564c55dc-0ab8-481e-a0bc-97ea7e484b88";

export const ModernMobileUserCard: React.FC<ModernMobileUserCardProps> = ({
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
  const isAdminUser = user.role === "Admin";
  const isTemporaryGroup = user.permission_group_id === GERAL_GROUP_ID && user.role !== "Admin";

  const getCardClass = () => {
    let baseClass = "backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border border-white/20 shadow-lg rounded-2xl p-4";
    
    if (isAdminUser) {
      return `${baseClass} bg-gradient-to-br from-blue-50/80 to-blue-100/40`;
    }
    if (isTemporaryGroup) {
      return `${baseClass} bg-gradient-to-br from-orange-50/80 to-orange-100/40`;
    }
    return baseClass;
  };

  return (
    <motion.div
      className={getCardClass()}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <motion.div 
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isAdminUser ? "bg-blue-500" : 
              isTemporaryGroup ? "bg-orange-500" : "bg-gray-500"
            }`}
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {isAdminUser ? (
              <Shield className="h-6 w-6 text-white" />
            ) : (
              <User className="h-6 w-6 text-white" />
            )}
          </motion.div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
              {user.name || 'Sem nome'}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {user.email}
            </p>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="ghost" 
                size="sm"
                className="h-8 w-8 p-0 hover:bg-white/50"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </motion.div>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="w-48 backdrop-blur-xl bg-white/90 border-white/20"
          >
            <DropdownMenuItem onClick={() => onViewDetails(user)}>
              <Eye className="mr-2 h-4 w-4" />
              <span>Ver detalhes</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => onResetPassword(user)}>
              <KeyRound className="mr-2 h-4 w-4" />
              <span>Redefinir senha</span>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => onChangePassword(user)}>
              <Edit className="mr-2 h-4 w-4" />
              <span>Alterar senha</span>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => onSendMagicLink(user)}>
              <Link className="mr-2 h-4 w-4" />
              <span>Enviar Magic Link</span>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => onSetPermissionGroup(user)}>
              <Lock className="mr-2 h-4 w-4" />
              <span>Gerenciar permissões</span>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => onStorageManagement(user)}>
              <HardDrive className="mr-2 h-4 w-4" />
              <span>Gerenciar armazenamento</span>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => onActivityLogs(user)}>
              <Activity className="mr-2 h-4 w-4" />
              <span>Logs de atividade</span>
            </DropdownMenuItem>

            {user.role === 'Student' && (
              <DropdownMenuItem onClick={() => onToggleMentor(user)}>
                <GraduationCap className="mr-2 h-4 w-4" />
                <span>{user.is_mentor ? 'Remover mentor' : 'Tornar mentor'}</span>
              </DropdownMenuItem>
            )}
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem 
              onClick={() => onDeleteUser(user)}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Excluir usuário</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Status e Role */}
      <div className="flex items-center justify-between mb-3">
        <UserStatusBadge 
          status={user.status} 
          permissionGroupId={user.permission_group_id}
          isTemporaryGroup={isTemporaryGroup}
        />
        
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {user.role || "Não definido"}
          </Badge>
          {user.is_mentor && (
            <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-800">
              <GraduationCap className="h-3 w-3 mr-1" />
              Mentor
            </Badge>
          )}
        </div>
      </div>

      {/* Storage Info */}
      {user.storage_used_mb !== undefined && user.storage_limit_mb !== undefined && (
        <div className="mt-3 pt-3 border-t border-white/20">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>Armazenamento</span>
            <span>
              {user.storage_used_mb.toFixed(1)} / {user.storage_limit_mb} MB
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-1.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ 
                width: `${Math.min((user.storage_used_mb / user.storage_limit_mb) * 100, 100)}%`
              }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
      )}

      {/* Last Login */}
      <div className="mt-3 text-xs text-gray-500">
        Último acesso: {user.lastLogin || "Nunca"}
      </div>
    </motion.div>
  );
};
