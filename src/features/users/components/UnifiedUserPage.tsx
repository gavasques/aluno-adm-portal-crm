
import React from 'react';
import { usePerformanceOptimizedUserContext } from '@/contexts/PerformanceOptimizedUserContext';
import { UserTable } from './UserTable/UserTable';
import { UserFilters } from './UserFilters/UserFilters';
import { useUserDialogs } from '../hooks/useUserDialogs';
import { useUserFilters } from '../hooks/useUserFilters';
import { UserDialogManager } from './UserDialogs/UserDialogManager';

const UnifiedUserPage: React.FC = () => {
  const {
    users,
    isLoading,
    refreshUsers,
    permissionGroups
  } = usePerformanceOptimizedUserContext();

  const { dialogState, openDialog, closeDialog } = useUserDialogs();
  
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
    stats
  } = useUserFilters(users);

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestão de Usuários</h1>
        <p className="text-gray-600 mt-2">Gerencie usuários, permissões e configurações do sistema</p>
      </div>

      <UserFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
        mentorFilter={mentorFilter}
        onMentorFilterChange={setMentorFilter}
        totalUsers={stats.total}
        activeUsers={stats.active}
        inactiveUsers={stats.inactive}
        pendingUsers={stats.pending}
      />

      <UserTable
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
        permissionGroups={permissionGroups}
      />

      <UserDialogManager
        dialogState={dialogState}
        onCloseDialog={closeDialog}
        onRefresh={refreshUsers}
      />
    </div>
  );
};

export default UnifiedUserPage;
