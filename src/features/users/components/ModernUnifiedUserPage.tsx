
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useUserDialogs } from '../hooks/useUserDialogs';
import { usePerformanceOptimizedUserContext } from '@/contexts/PerformanceOptimizedUserContext';
import { ModernUserTable } from './UserTable/ModernUserTable';
import { UserDialogManager } from './UserDialogs/UserDialogManager';
import { UserFilters } from './UserFilters/UserFilters';
import { UserPagination } from './UserPagination/UserPagination';
import { useUXFeedback } from '@/hooks/useUXFeedback';
import { PullToRefresh } from '@/components/ui/pull-to-refresh';
import { useUserFilters } from '../hooks/useUserFilters';
import { useUserPagination } from '../hooks/useUserPagination';
import { AddUserDialog } from './UserDialogs/AddUserDialog';
import { InviteUserDialog } from './UserDialogs/InviteUserDialog';

const ModernUnifiedUserPage: React.FC = () => {
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

  const {
    paginatedUsers,
    pageInfo,
    pageSize,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    changePageSize
  } = useUserPagination({ users: filteredUsers });

  const handleSearchChange = (query: string) => {
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
        'É Mentor': user.is_mentor ? 'Sim' : 'Não',
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
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-3"
          >
            <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Gestão de Usuários
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Gerencie usuários, permissões e acessos do sistema
              </p>
            </div>
          </motion.div>

          {/* Filters */}
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
              onAddUser={handleAddUser}
              onInviteUser={handleInviteUser}
              onRefresh={handleRefresh}
              onExport={handleExportUsers}
              isRefreshing={isRefreshing}
            />
          </motion.div>

          {/* Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <ModernUserTable
              users={paginatedUsers}
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
              onBanUser={(user) => openDialog('ban', user)}
              onUnbanUser={(user) => openDialog('unban', user)}
              permissionGroups={permissionGroups}
            />
          </motion.div>

          {/* Pagination */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <UserPagination
              currentPage={pageInfo.currentPage}
              totalPages={pageInfo.totalPages}
              totalItems={pageInfo.totalItems}
              pageSize={pageSize}
              startIndex={pageInfo.startIndex}
              endIndex={pageInfo.endIndex}
              onPageChange={goToPage}
              onPageSizeChange={changePageSize}
              onPreviousPage={goToPreviousPage}
              onNextPage={goToNextPage}
              hasNextPage={pageInfo.hasNextPage}
              hasPreviousPage={pageInfo.hasPreviousPage}
            />
          </motion.div>

          {/* Dialogs */}
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
