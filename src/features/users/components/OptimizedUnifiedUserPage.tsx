
import React, { Suspense, lazy } from 'react';
import { useOptimizedUserContext } from '@/contexts/OptimizedUserContext';
import { UserFilters } from './UserFilters/UserFilters';
import { useUserDialogs } from '../hooks/useUserDialogs';
import { useUserFilters } from '../hooks/useUserFilters';
import { UserDialogManager } from './UserDialogs/UserDialogManager';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy loading para componentes pesados
const VirtualizedUserTable = lazy(() => 
  import('./UserTable/VirtualizedUserTable').then(module => ({
    default: module.VirtualizedUserTable
  }))
);

const TableSkeleton = () => (
  <Card className="shadow-sm">
    <CardContent className="p-6">
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
            <Skeleton className="h-8 w-8" />
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const OptimizedUnifiedUserPage: React.FC = () => {
  const {
    users,
    isLoading,
    refreshUsers,
    permissionGroups
  } = useOptimizedUserContext();

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
  } = useUserFilters(users, permissionGroups);

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestão de Usuários</h1>
        <p className="text-gray-600">Gerencie usuários, permissões e configurações do sistema</p>
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
        bannedUsers={stats.banned}
      />

      <Suspense fallback={<TableSkeleton />}>
        <VirtualizedUserTable
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
      </Suspense>

      <UserDialogManager
        dialogState={dialogState}
        onCloseDialog={closeDialog}
        onRefresh={refreshUsers}
      />
    </div>
  );
};

export default OptimizedUnifiedUserPage;
