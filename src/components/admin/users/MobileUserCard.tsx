
import React from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, Mail, Shield, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SwipeableTableRow } from '@/components/ui/swipeable-table-row';
import { UserStatusBadge } from './UserStatusBadge';
import { StoragePercentageBadge } from './StoragePercentageBadge';

interface User {
  id: string;
  email: string;
  name?: string;
  status: 'active' | 'inactive' | 'pending';
  storage_used: number;
  storage_limit: number;
  is_mentor?: boolean;
}

interface MobileUserCardProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onSendEmail: (user: User) => void;
}

export const MobileUserCard: React.FC<MobileUserCardProps> = ({
  user,
  onEdit,
  onDelete,
  onSendEmail
}) => {
  const swipeActions = {
    leftActions: [
      {
        id: 'edit',
        label: 'Editar',
        icon: <Edit className="h-4 w-4" />,
        color: '#3b82f6',
        onAction: () => onEdit(user)
      }
    ],
    rightActions: [
      {
        id: 'email',
        label: 'Email',
        icon: <Mail className="h-4 w-4" />,
        color: '#10b981',
        onAction: () => onSendEmail(user)
      },
      {
        id: 'delete',
        label: 'Excluir',
        icon: <Trash2 className="h-4 w-4" />,
        color: '#ef4444',
        onAction: () => onDelete(user)
      }
    ]
  };

  return (
    <SwipeableTableRow
      leftActions={swipeActions.leftActions}
      rightActions={swipeActions.rightActions}
      className="mb-3"
    >
      <motion.div
        className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 text-sm">
                {user.name || 'Sem nome'}
              </h3>
              <p className="text-xs text-gray-500 truncate max-w-[200px]">
                {user.email}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-1">
            <UserStatusBadge status={user.status} />
            {user.is_mentor && (
              <Badge variant="secondary" className="text-xs">
                <Shield className="h-3 w-3 mr-1" />
                Mentor
              </Badge>
            )}
          </div>
        </div>

        {/* Storage Info */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Armazenamento</span>
            <StoragePercentageBadge 
              used={user.storage_used} 
              limit={user.storage_limit} 
            />
          </div>
          
          {/* Storage Bar */}
          <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
            <motion.div
              className="bg-blue-500 h-1.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ 
                width: `${Math.min((user.storage_used / user.storage_limit) * 100, 100)}%`
              }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-400">
              {(user.storage_used / (1024 * 1024)).toFixed(1)} MB
            </span>
            <span className="text-xs text-gray-400">
              {(user.storage_limit / (1024 * 1024)).toFixed(0)} MB
            </span>
          </div>
        </div>
      </motion.div>
    </SwipeableTableRow>
  );
};
