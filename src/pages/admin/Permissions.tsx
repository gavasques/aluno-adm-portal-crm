
import React, { useState, useEffect } from "react";
import { usePermissionGroups, PermissionGroup } from "@/hooks/admin/usePermissionGroups";
import { useMenuCounts } from "@/hooks/admin/useMenuCounts";
import PermissionsHeader from "@/components/admin/permissions/PermissionsHeader";
import PermissionsCard from "@/components/admin/permissions/PermissionsCard";
import PermissionsDialogs from "@/components/admin/permissions/PermissionsDialogs";
import PermissionGroupMenusManager from "@/components/admin/permissions/PermissionGroupMenusManager";
import FixPermissionsButton from "@/components/admin/permissions/FixPermissionsButton";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const Permissions = () => {
  console.log("DEBUG - Permissions: Componente renderizando");
  
  const { 
    permissionGroups, 
    isLoading, 
    error, 
    refreshPermissionGroups 
  } = usePermissionGroups();

  const groupIds = permissionGroups.map(g => g.id);
  const { menuCounts } = useMenuCounts(groupIds);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<PermissionGroup | null>(null);
  const [showUsersDialog, setShowUsersDialog] = useState(false);
  const [showMenusDialog, setShowMenusDialog] = useState(false);

  useEffect(() => {
    console.log("DEBUG - Permissions: Grupos carregados:", permissionGroups.length);
  }, [permissionGroups.length]);

  useEffect(() => {
    console.log("DEBUG - Permissions: Contagens de menu:", Object.keys(menuCounts).length);
  }, [menuCounts]);

  const handleAdd = () => {
    console.log("DEBUG - Permissions: Abrindo diálogo de adicionar");
    setShowAddDialog(true);
  };

  const handleEdit = (group: PermissionGroup) => {
    console.log("DEBUG - Permissions: Editando grupo", group.id);
    setSelectedGroup(group);
    setShowEditDialog(true);
  };

  const handleDelete = (group: PermissionGroup) => {
    console.log("DEBUG - Permissions: Deletando grupo", group.id);
    setSelectedGroup(group);
    setShowDeleteDialog(true);
  };

  const handleViewUsers = (group: PermissionGroup) => {
    console.log("DEBUG - Permissions: Visualizando usuários do grupo", group.id);
    setSelectedGroup(group);
    setShowUsersDialog(true);
  };

  const handleManageMenus = (group: PermissionGroup) => {
    console.log("DEBUG - Permissions: Gerenciando menus do grupo", group.id);
    setSelectedGroup(group);
    setShowMenusDialog(true);
  };

  const handleSuccess = () => {
    console.log("DEBUG - Permissions: Refresh após sucesso");
    refreshPermissionGroups();
  };

  const handleCloseMenusDialog = () => {
    console.log("DEBUG - Permissions: Fechando diálogo de menus");
    setShowMenusDialog(false);
    setSelectedGroup(null);
    refreshPermissionGroups(); // Refresh para atualizar contadores
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
        onManageMenus={handleManageMenus}
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

      <Dialog open={showMenusDialog} onOpenChange={setShowMenusDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedGroup && (
            <PermissionGroupMenusManager
              groupId={selectedGroup.id}
              groupName={selectedGroup.name}
              onClose={handleCloseMenusDialog}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Permissions;
