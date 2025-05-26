
import React from "react";
import { usePermissionGroups } from "@/hooks/admin/usePermissionGroups";
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav";
import PermissionsHeader from "@/components/admin/permissions/PermissionsHeader";
import PermissionsDialogs from "@/components/admin/permissions/PermissionsDialogs";
import FixPermissionsButton from "@/components/admin/permissions/FixPermissionsButton";
import PerformanceOptimizedPermissions from "@/components/admin/permissions/PerformanceOptimizedPermissions";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useState } from "react";
import { PermissionGroup } from "@/hooks/admin/usePermissionGroups";

const PermissionsContent = () => {
  const { 
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

  const handleSuccess = () => {
    console.log("DEBUG - Permissions: handleSuccess called - refreshing data");
    refreshPermissionGroups();
  };

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Gestão de Permissões' }
  ];

  return (
    <div className="w-full space-y-6">
      <BreadcrumbNav 
        items={breadcrumbItems} 
        showBackButton={true}
        backHref="/admin"
        className="mb-6"
      />

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

const Permissions = () => {
  return (
    <ErrorBoundary>
      <PermissionsContent />
    </ErrorBoundary>
  );
};

export default Permissions;
