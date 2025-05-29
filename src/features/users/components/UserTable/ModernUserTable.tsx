import React from 'react';
import { motion } from 'framer-motion';
import { Table, TableBody } from '@/components/ui/table';
import { ModernUserTableHeader } from './ModernUserTableHeader';
import { ModernUserTableRow } from './ModernUserTableRow';
import { User } from '@/types/user.types';
import EmptyUsersList from '@/components/admin/users/EmptyUsersList';
import LoadingUsersList from '@/components/admin/users/LoadingUsersList';
import { Card, CardContent } from '@/components/ui/card';

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
  onCreditsManagement,
  permissionGroups = [],
}) => {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="backdrop-blur-xl bg-white/70 dark:bg-slate-800/70 border-white/20 shadow-xl">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table className="w-full table-fixed">
                <ModernUserTableHeader />
                <TableBody>
                  <LoadingUsersList />
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (users.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="backdrop-blur-xl bg-white/70 dark:bg-slate-800/70 border-white/20 shadow-xl">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table className="w-full table-fixed">
                <ModernUserTableHeader />
                <TableBody>
                  <EmptyUsersList />
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      {/* Glassmorphism background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30 rounded-xl" />
      
      <Card className="relative backdrop-blur-xl bg-white/70 dark:bg-slate-800/70 border-white/20 shadow-xl overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table className="w-full table-fixed min-w-[800px]">
              <ModernUserTableHeader />
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
                    onCreditsManagement={onCreditsManagement}
                    permissionGroups={permissionGroups}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
