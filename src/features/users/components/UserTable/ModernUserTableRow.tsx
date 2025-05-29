
import React from 'react';
import { motion } from 'framer-motion';
import { TableCell, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from '@/types/user.types';
import { ModernUserActions } from './ModernUserActions';
import { UserBadges } from '../UserBadges/UserBadges';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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

export const ModernUserTableRow: React.FC<ModernUserTableRowProps> = ({
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
  permissionGroups = [],
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const getStoragePercentage = () => {
    const used = user.storage_used_mb || 0;
    const limit = user.storage_limit_mb || 100;
    return Math.round((used / limit) * 100);
  };

  const getStorageColor = () => {
    const percentage = getStoragePercentage();
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const formatLastLogin = (lastLogin: string) => {
    if (!lastLogin || lastLogin === 'Nunca') return 'Nunca';
    try {
      const date = new Date(lastLogin);
      return formatDistanceToNow(date, { addSuffix: true, locale: ptBR });
    } catch {
      return 'Nunca';
    }
  };

  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="group border-b border-white/5 hover:bg-white/5 dark:hover:bg-slate-700/50"
      asChild
    >
      <TableRow>
        {/* User Info */}
        <TableCell className="py-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-white/20">
              <AvatarImage src={user.avatar_url || ''} alt={user.name || ''} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-medium">
                {getInitials(user.name || user.email)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="font-medium text-gray-900 dark:text-white truncate">
                {user.name || 'Nome não informado'}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {user.email}
              </div>
            </div>
          </div>
        </TableCell>

        {/* Badges */}
        <TableCell className="py-4">
          <UserBadges user={user} permissionGroups={permissionGroups} />
        </TableCell>

        {/* Storage */}
        <TableCell className="py-4 text-center">
          <div className="flex flex-col items-center gap-1">
            <div className="w-full max-w-[80px] h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${getStorageColor()}`}
                style={{ width: `${Math.min(getStoragePercentage(), 100)}%` }}
              />
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {user.storage_used_mb || 0}MB / {user.storage_limit_mb || 100}MB
            </div>
          </div>
        </TableCell>

        {/* Last Login */}
        <TableCell className="py-4 text-center text-sm text-gray-600 dark:text-gray-400">
          {formatLastLogin(user.lastLogin)}
        </TableCell>

        {/* Actions */}
        <TableCell className="py-4 text-center">
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
        </TableCell>
      </TableRow>
    </motion.tr>
  );
};
