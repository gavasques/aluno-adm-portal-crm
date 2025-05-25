
import React, { useState, useEffect } from "react";
import { usePermissionGroups, PermissionGroup } from "@/hooks/admin/usePermissionGroups";
import { useMenuCounts } from "@/hooks/admin/useMenuCounts";
import PermissionsHeader from "@/components/admin/permissions/PermissionsHeader";
import PermissionsCard from "@/components/admin/permissions/PermissionsCard";
import PermissionsDialogs from "@/components/admin/permissions/PermissionsDialogs";
import FixPermissionsButton from "@/components/admin/permissions/FixPermissionsButton";
import { AlertTriangle } from "lucide-react";

const Permissions = () => {
  const { 
    permissionGroups, 
    isLoading, 
    error, 
    refreshPermissionGroups 
  } = usePermissionGroups();

  const groupIds = permissionGroups.map(g => g.id);
  const { menuCounts, refreshMenuCounts } = useMenuCounts(groupIds);

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

  const handleSuccess = () => {
    console.log("DEBUG - Permissions: handleSuccess called - refreshing data");
    refreshPermissionGroups();
    refreshMenuCounts();
  };

  const handleRecoverySuccess = () => {
    console.log("DEBUG - Permissions: handleRecoverySuccess called - refreshing data");
    refreshPermissionGroups();
    refreshMenuCounts();
  };

  return (
    <div className="w-full">
      <PermissionsHeader onAdd={handleAdd} onRecoverySuccess={handleRecoverySuccess} />

      {error && (
        <>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
            <p className="text-sm mt-1">Verifique as políticas de acesso ao banco de dados.</p>
          </div>
          <FixPermissionsButton onSuccess={handleSuccess} />
        </>
      )}

      {/* Show recovery notice for Mentor group */}
      <div className="bg-orange-100 border border-orange-400 text-orange-700 px-4 py-3 rounded mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          <span className="font-medium">Atenção:</span>
        </div>
        <p className="text-sm mt-1">
          Se o grupo "Mentor" estiver sem menus, use o botão "Recuperar Grupo Mentor" acima para restaurá-los automaticamente.
        </p>
      </div>

      <PermissionsCard 
        permissionGroups={permissionGroups} 
        isLoading={isLoading} 
        onEdit={handleEdit}
        onDelete={handleDelete}
        onViewUsers={handleViewUsers}
        groupMenuCounts={menuCounts}
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

export default Permissions;
