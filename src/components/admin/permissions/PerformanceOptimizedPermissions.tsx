
import React, { memo, useState } from "react";
import { useOptimizedPermissions } from "@/hooks/useOptimizedPermissions";
import { usePerformanceMonitor } from "@/hooks/usePerformanceMonitor";
import PermissionsHeader from "@/components/admin/permissions/PermissionsHeader";
import OptimizedPermissionsList from "./OptimizedPermissionsList";
import PermissionsDialogs from "@/components/admin/permissions/PermissionsDialogs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, Zap } from "lucide-react";
import type { PermissionGroup } from "@/hooks/admin/usePermissionGroups";

const PerformanceOptimizedPermissions = memo(() => {
  const { permissions, loading, refreshPermissions, cacheStats } = useOptimizedPermissions();
  const { getAverageRenderTime, getSlowRenders } = usePerformanceMonitor('PerformanceOptimizedPermissions');
  
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<PermissionGroup | null>(null);
  const [showUsersDialog, setShowUsersDialog] = useState(false);
  const [showPerformanceStats, setShowPerformanceStats] = useState(false);

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
    console.log("🔄 Performance Optimized: handleSuccess - refreshing with cache invalidation");
    refreshPermissions();
  };

  const averageRenderTime = getAverageRenderTime();
  const slowRenders = getSlowRenders();

  return (
    <div className="w-full space-y-6">
      <PermissionsHeader onAdd={handleAdd} />

      {/* Performance Stats Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="h-5 w-5 text-green-600" />
              Performance Dashboard
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPerformanceStats(!showPerformanceStats)}
            >
              <Activity className="h-4 w-4 mr-2" />
              {showPerformanceStats ? 'Ocultar' : 'Mostrar'} Stats
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {averageRenderTime.toFixed(1)}ms
              </div>
              <div className="text-sm text-gray-600">Tempo Médio de Render</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {cacheStats.totalEntries}
              </div>
              <div className="text-sm text-gray-600">Entradas em Cache</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {slowRenders.length}
              </div>
              <div className="text-sm text-gray-600">Renders Lentos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {permissions.allowedMenus.length}
              </div>
              <div className="text-sm text-gray-600">Menus Permitidos</div>
            </div>
          </div>

          {showPerformanceStats && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Cache Detalhado:</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                <Badge variant="outline">
                  Menu Access: {cacheStats.menuAccessSize}
                </Badge>
                <Badge variant="outline">
                  Admin Status: {cacheStats.adminStatusSize}
                </Badge>
                <Badge variant="outline">
                  User Permissions: {cacheStats.userPermissionsSize}
                </Badge>
              </div>
              {slowRenders.length > 0 && (
                <div className="mt-2">
                  <span className="text-sm text-orange-600">
                    ⚠️ {slowRenders.length} renders detectados acima de 16ms
                  </span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lista otimizada */}
      <OptimizedPermissionsList
        onEdit={handleEdit}
        onDelete={handleDelete}
        onViewUsers={handleViewUsers}
      />

      {/* Dialogs */}
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
});

PerformanceOptimizedPermissions.displayName = 'PerformanceOptimizedPermissions';

export default PerformanceOptimizedPermissions;
