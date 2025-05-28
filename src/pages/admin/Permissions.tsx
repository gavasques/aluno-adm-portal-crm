
import React, { useState } from 'react';
import { PermissionGroup } from '@/hooks/admin/usePermissionGroups';
import PermissionsHeader from '@/components/admin/permissions/PermissionsHeader';
import PerformanceOptimizedPermissions from '@/components/admin/permissions/PerformanceOptimizedPermissions';
import PermissionsDialogs from '@/components/admin/permissions/PermissionsDialogs';

const AdminPermissions = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showUsersDialog, setShowUsersDialog] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<PermissionGroup | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAddGroup = () => {
    setShowAddDialog(true);
  };

  const handleEditGroup = (group: PermissionGroup) => {
    setSelectedGroup(group);
    setShowEditDialog(true);
  };

  const handleDeleteGroup = (group: PermissionGroup) => {
    setSelectedGroup(group);
    setShowDeleteDialog(true);
  };

  const handleViewUsers = (group: PermissionGroup) => {
    setSelectedGroup(group);
    setShowUsersDialog(true);
  };

  const handleSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <PermissionsHeader onAdd={handleAddGroup} />
      
      <PerformanceOptimizedPermissions
        onEdit={handleEditGroup}
        onDelete={handleDeleteGroup}
        onViewUsers={handleViewUsers}
        key={refreshTrigger}
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
