
import React from 'react';
import { motion } from 'framer-motion';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { User } from '@/types/user.types';
import { ModernUserTableRow } from './ModernUserTableRow';
import { Card } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface ModernUserTableProps {
  users: User[];
  isLoading: boolean;
  onViewDetails: (user: User) => void;
  onResetPassword: (user: User) => void;
  onChangePassword: (user: User) => void;
  onDeleteUser: (user: User) => void;
  onSetPermissionGroup: (user: User) => void;
  onStorageManagement: (user: User) => void;
  onActivityLogs: (user: User) => void;
  onSendMagicLink: (user: User) => void;
  onToggleMentor: (user: User) => void;
  onBanUser: (user: User) => void;
  onUnbanUser: (user: User) => void;
  onCreditsManagement?: (user: User) => void;
  permissionGroups?: Array<{ id: string; name: string; }>;
}

export const ModernUserTable: React.FC<ModernUserTableProps> = ({
  users,
  isLoading,
  onViewDetails,
  onResetPassword,
  onChangePassword,
  onDeleteUser,
  onSetPermissionGroup,
  onStorageManagement,
  onActivityLogs,
  onSendMagicLink,
  onToggleMentor,
  onBanUser,
  onUnbanUser,
  onCreditsManagement,
  permissionGroups = [],
}) => {
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      </Card>
    );
  }

  if (users.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            Nenhum usuário encontrado com os filtros aplicados.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border-white/20 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-white/10">
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold w-[35%] min-w-[280px]">
                  Usuário
                </TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold w-[25%] min-w-[200px]">
                  Status & Permissões
                </TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold text-center w-[15%] min-w-[120px]">
                  Armazenamento
                </TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold text-center w-[15%] min-w-[120px]">
                  Último Acesso
                </TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold text-center w-[10%] min-w-[80px]">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user, index) => (
                <ModernUserTableRow
                  key={user.id}
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
                  onBanUser={onBanUser}
                  onUnbanUser={onUnbanUser}
                  onCreditsManagement={onCreditsManagement}
                  permissionGroups={permissionGroups}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </motion.div>
  );
};
