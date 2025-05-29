
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
import { useUserFilters } from '../hooks/useUserFilters';
import { AddUserDialog } from './UserDialogs/AddUserDialog';
import { InviteUserDialog } from './UserDialogs/InviteUserDialog';

const ModernUnifiedUserPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const { showSuccessToast, showErrorToast, showInfoToast } = useUXFeedback();

  const {
    users,
    stats,
    isLoading,
    isRefreshing,
    refreshUsers,
    searchUsers,
    permissionGroups,
  } = usePerformanceOptimizedUserContext();

  const {
    dialogState,
    openDialog,
    closeDialog,
  } = useUserDialogs();

  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    roleFilter,
    setRoleFilter,
    mentorFilter,
    setMentorFilter,
    filteredUsers,
    stats: filterStats
  } = useUserFilters(users, permissionGroups);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setSearchTerm(query);
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
    setShowAddUserDialog(true);
  };

  const handleInviteUser = () => {
    setShowInviteDialog(true);
  };

  const handleExportUsers = () => {
    try {
      const csvData = filteredUsers.map(user => ({
        Nome: user.name || '',
        Email: user.email || '',
        Status: user.status || '',
        Função: user.role || '',
        'Criado em': user.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR') : '',
        'Último acesso': user.lastLogin || 'Nunca'
      }));

      const csvContent = [
        Object.keys(csvData[0]).join(','),
        ...csvData.map(row => Object.values(row).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `usuarios_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();

      showSuccessToast('Lista de usuários exportada com sucesso!');
    } catch (error) {
      showErrorToast('Erro ao exportar lista de usuários');
    }
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
            onExport={handleExportUsers}
            totalUsers={filterStats.total}
            isRefreshing={isRefreshing}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <UserFilters
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              roleFilter={roleFilter}
              onRoleFilterChange={setRoleFilter}
              mentorFilter={mentorFilter}
              onMentorFilterChange={setMentorFilter}
              totalUsers={filterStats.total}
              activeUsers={filterStats.active}
              inactiveUsers={filterStats.inactive}
              pendingUsers={filterStats.pending}
              bannedUsers={filterStats.banned}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <ModernUserTable
              users={filteredUsers}
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

          <AddUserDialog
            open={showAddUserDialog}
            onOpenChange={setShowAddUserDialog}
            onSuccess={handleRefresh}
          />

          <InviteUserDialog
            open={showInviteDialog}
            onOpenChange={setShowInviteDialog}
            onSuccess={handleRefresh}
          />
        </motion.div>
      </PullToRefresh>
    </div>
  );
};

export default ModernUnifiedUserPage;
