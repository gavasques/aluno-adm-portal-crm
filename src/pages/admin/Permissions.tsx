
import React, { useState, useCallback } from 'react';
import { useOptimizedPermissions } from '@/hooks/admin/permissions/useOptimizedPermissions';
import { PermissionGroup } from '@/types/permissions';
import OptimizedPermissionsList from '@/components/admin/permissions/OptimizedPermissionsList';
import PermissionsHeader from '@/components/admin/permissions/PermissionsHeader';
import PermissionsDialogs from '@/components/admin/permissions/PermissionsDialogs';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const AdminPermissions = () => {
  const {
    permissionGroups,
    filteredGroups,
    menuCounts,
    isLoading,
    error,
    searchTerm,
    isSearching,
    setSearchTerm,
    clearSearch,
    refreshPermissionGroups,
  } = useOptimizedPermissions();
  
  // Dialog states
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showUsersDialog, setShowUsersDialog] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<PermissionGroup | null>(null);

  const handleAdd = useCallback(() => {
    setSelectedGroup(null);
    setShowAddDialog(true);
  }, []);

  const handleEdit = useCallback((group: PermissionGroup) => {
    setSelectedGroup(group);
    setShowEditDialog(true);
  }, []);

  const handleDelete = useCallback((group: PermissionGroup) => {
    setSelectedGroup(group);
    setShowDeleteDialog(true);
  }, []);

  const handleViewUsers = useCallback((group: PermissionGroup) => {
    setSelectedGroup(group);
    setShowUsersDialog(true);
  }, []);

  const handleSuccess = useCallback(() => {
    refreshPermissionGroups();
  }, [refreshPermissionGroups]);

  if (isLoading && permissionGroups.length === 0) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="flex items-center justify-center p-12">
            <div className="flex items-center gap-3">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              <span className="text-gray-600">Carregando sistema de permissões...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-red-600 mb-2">Erro ao carregar permissões</div>
            <p className="text-gray-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <PermissionsHeader onAdd={handleAdd} />
      
      <OptimizedPermissionsList
        groups={permissionGroups}
        filteredGroups={filteredGroups}
        menuCounts={menuCounts}
        searchTerm={searchTerm}
        isSearching={isSearching}
        isLoading={isLoading}
        onSearchChange={setSearchTerm}
        onClearSearch={clearSearch}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onViewUsers={handleViewUsers}
      />

      <PermissionsDialogs
        showAddDialog={showAddDialog}
        setShowAddDialog={setShowAddDialog}
        showEditDialog={showEditDialog}
        setShowEditDialog={setShowEditDialog}
        showDeleteDialog={showDeleteDialog}
        setShowDeleteDialog={setShowDeleteDialog}
        showUsersDialog={showUsersDialog}
        setShowUsersDialog={setShowUsersDialog}
        selectedGroup={selectedGroup}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default AdminPermissions;
