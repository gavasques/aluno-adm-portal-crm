
import React, { useState } from "react";
import { usePermissionGroups, PermissionGroup } from "@/hooks/admin/usePermissionGroups";
import { useMenuCounts } from "@/hooks/admin/useMenuCounts";
import PermissionsHeader from "@/components/admin/permissions/PermissionsHeader";
import PermissionsCard from "@/components/admin/permissions/PermissionsCard";
import PermissionsDialogs from "@/components/admin/permissions/PermissionsDialogs";
import FixPermissionsButton from "@/components/admin/permissions/FixPermissionsButton";
import PerformanceOptimizedPermissions from "@/components/admin/permissions/PerformanceOptimizedPermissions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Zap, List } from "lucide-react";

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

  return (
    <div className="w-full">
      {error && (
        <>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
            <p className="text-sm mt-1">Verifique as políticas de acesso ao banco de dados.</p>
          </div>
          <FixPermissionsButton onSuccess={handleSuccess} />
        </>
      )}

      <Tabs defaultValue="optimized" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="optimized" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Versão Otimizada
            <Badge variant="secondary" className="ml-1">Nova</Badge>
          </TabsTrigger>
          <TabsTrigger value="standard" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            Versão Padrão
          </TabsTrigger>
        </TabsList>

        <TabsContent value="optimized" className="mt-6">
          <PerformanceOptimizedPermissions />
        </TabsContent>

        <TabsContent value="standard" className="mt-6">
          <PermissionsHeader onAdd={handleAdd} />

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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Permissions;
