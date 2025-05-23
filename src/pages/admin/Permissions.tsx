
import React, { useState } from "react";
import { usePermissionGroups, PermissionGroup } from "@/hooks/admin/usePermissionGroups";
import PermissionsHeader from "@/components/admin/permissions/PermissionsHeader";
import PermissionsCard from "@/components/admin/permissions/PermissionsCard";
import PermissionsDialogs from "@/components/admin/permissions/PermissionsDialogs";
import FixPermissionsButton from "@/components/admin/permissions/FixPermissionsButton";

const Permissions = () => {
  const { 
    permissionGroups, 
    isLoading, 
    error, 
    refreshPermissionGroups 
  } = usePermissionGroups();

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<PermissionGroup | null>(null);
  const [showUsersDialog, setShowUsersDialog] = useState(false);

  const handleAdd = () => {
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

  return (
    <div className="container mx-auto py-6">
      <PermissionsHeader onAdd={handleAdd} />

      {error && (
        <>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
            <p className="text-sm mt-1">Verifique as políticas de acesso ao banco de dados.</p>
          </div>
          <FixPermissionsButton onSuccess={refreshPermissionGroups} />
        </>
      )}

      <PermissionsCard 
        permissionGroups={permissionGroups} 
        isLoading={isLoading} 
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
        onSuccess={refreshPermissionGroups}
      />
    </div>
  );
};

export default Permissions;
