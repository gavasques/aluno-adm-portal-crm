
import React, { useState } from 'react';
import { usePermissionGroupsState } from '@/hooks/admin/permissions/usePermissionGroupsState';
import { PermissionGroup } from '@/types/permissions';
import PerformanceOptimizedPermissions from '@/components/admin/permissions/PerformanceOptimizedPermissions';
import PermissionsHeader from '@/components/admin/permissions/PermissionsHeader';
import PermissionsDialogs from '@/components/admin/permissions/PermissionsDialogs';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const AdminPermissions = () => {
  const { permissionGroups, isLoading, error, refreshPermissionGroups } = usePermissionGroupsState();
  
  // Dialog states
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showUsersDialog, setShowUsersDialog] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<PermissionGroup | null>(null);

  const handleAdd = () => {
    setSelectedGroup(null);
    setShowAddDialog(true);
  };

  const handleEdit = (group: PermissionGroup) => {
    setSelectedGroup(group);
    setShowEditDialog(true);
  };

  const handleDelete = (group: PermissionGroup) => {
    setSelectedGroup(group);
    setShowDeleteDialog(true);
  };

  const handleViewUsers = (group: PermissionGroup) => {
    setSelectedGroup(group);
    setShowUsersDialog(true);
  };

  const handleSuccess = () => {
    refreshPermissionGroups();
  };

  if (isLoading) {
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
      
      <PerformanceOptimizedPermissions
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
