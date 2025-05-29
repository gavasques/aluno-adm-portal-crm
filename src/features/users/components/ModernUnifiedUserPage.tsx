
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useUserDialogs } from '../hooks/useUserDialogs';
import { usePerformanceOptimizedUserContext } from '@/contexts/PerformanceOptimizedUserContext';
import { ModernUsersHeader } from './ModernUsersHeader';
import { ModernUserTable } from './UserTable/ModernUserTable';
import { UserDialogManager } from './UserDialogs/UserDialogManager';
import { UserFilters } from './UserFilters/UserFilters';
import { useUXFeedback } from '@/hooks/useUXFeedback';
import { PullToRefresh } from '@/components/ui/pull-to-refresh';

const ModernUnifiedUserPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { showSuccessToast, showErrorToast, showInfoToast } = useUXFeedback();

  const {
    users,
    stats,
    isLoading,
    isRefreshing,
    refreshUsers,
    searchUsers,
  } = usePerformanceOptimizedUserContext();

  const {
    dialogState,
    openDialog,
    closeDialog,
  } = useUserDialogs();

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    searchUsers(query);
  };

  const handleRefresh = async () => {
    try {
      await refreshUsers();
      showSuccessToast('Lista de usuários atualizada!');
    } catch (error) {
      showErrorToast('Erro ao atualizar lista de usuários');
    }
  };

  const handleAddUser = () => {
    showInfoToast('Funcionalidade em desenvolvimento');
  };

  const handleInviteUser = () => {
    showInfoToast('Funcionalidade de convite em desenvolvimento');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-900 dark:via-slate-800/30 dark:to-slate-900">
      <PullToRefresh onRefresh={handleRefresh}>
        <motion.div
          className="container mx-auto p-6 space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <ModernUsersHeader
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onAddUser={handleAddUser}
            onInviteUser={handleInviteUser}
            onRefresh={handleRefresh}
            totalUsers={stats.total}
            isRefreshing={isRefreshing}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <ModernUserTable
              users={users}
              isLoading={isLoading}
              onViewDetails={(user) => openDialog('view', user)}
              onResetPassword={(user) => openDialog('reset', user)}
              onChangePassword={(user) => openDialog('changePassword', user)}
              onDeleteUser={(user) => openDialog('delete', user)}
              onSetPermissionGroup={(user) => openDialog('permissions', user)}
              onStorageManagement={(user) => openDialog('storage', user)}
              onActivityLogs={(user) => openDialog('activity', user)}
              onSendMagicLink={(user) => openDialog('sendMagicLink', user)}
              onToggleMentor={(user) => openDialog('mentor', user)}
            />
          </motion.div>

          <UserDialogManager
            dialogState={dialogState}
            onCloseDialog={closeDialog}
            onRefresh={handleRefresh}
          />
        </motion.div>
      </PullToRefresh>
    </div>
  );
};

export default ModernUnifiedUserPage;
