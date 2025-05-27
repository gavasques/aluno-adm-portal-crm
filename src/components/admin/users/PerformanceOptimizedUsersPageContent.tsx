
import React, { useState } from "react";
import { usePerformanceOptimizedUserContext } from "@/contexts/PerformanceOptimizedUserContext";
import { useSimplifiedUserOperations } from "@/hooks/users/useSimplifiedUserOperations";
import { useUserDropdownActions } from "@/hooks/users/useUserDropdownActions";
import UsersHeader from "./UsersHeader";
import UsersAlert from "./UsersAlert";
import { UserFilters } from "./filters/UserFilters";
import UserActionButtons from "./UserActionButtons";
import { OptimizedUserTable } from "./table/OptimizedUserTable";
import { ValidatedUserDialogs } from "./dialogs/ValidatedUserDialogs";
import { PerformanceOptimizedUserDialogs } from "./dialogs/PerformanceOptimizedUserDialogs";
import { PerformanceMonitor } from "./performance/PerformanceMonitor";
import { Badge } from "@/components/ui/badge";
import { Zap } from "lucide-react";

export const PerformanceOptimizedUsersPageContent: React.FC = () => {
  const [showPerformanceMonitor, setShowPerformanceMonitor] = useState(false);
  
  const {
    filteredUsers,
    stats,
    filters,
    isLoading,
    isRefreshing,
    error,
    setFilters,
    searchUsers,
    refreshUsers,
    performanceMetrics,
    smartInvalidate
  } = usePerformanceOptimizedUserContext();

  const {
    showAddDialog,
    setShowAddDialog,
    showInviteDialog,
    setShowInviteDialog,
    handleAddUser,
    handleInviteUser,
  } = useSimplifiedUserOperations();

  const {
    handleViewDetails,
    handleResetPassword,
    handleDeleteUser,
    handleToggleUserStatus,
    handleSetPermissionGroup
  } = useUserDropdownActions();

  return (
    <div className="space-y-6">
      {/* Header com indicador de performance */}
      <div className="flex items-center justify-between">
        <UsersHeader 
          refreshUsersList={refreshUsers} 
          isRefreshing={isRefreshing} 
        />
        
        <div className="flex items-center gap-2">
          <Badge 
            variant="outline" 
            className="bg-green-50 text-green-700 border-green-200"
          >
            <Zap className="w-3 h-3 mr-1" />
            Performance Otimizada
          </Badge>
          
          <Badge variant="secondary" className="text-xs">
            Hit Rate: {performanceMetrics.hitRate.toFixed(1)}%
          </Badge>
        </div>
      </div>

      <UsersAlert fetchError={error} />

      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex-1">
            <UserFilters
              filters={filters}
              stats={stats}
              onFiltersChange={setFilters}
              onSearch={searchUsers}
            />
          </div>
          <UserActionButtons onAddUser={handleAddUser} onInviteUser={handleInviteUser} />
        </div>

        <OptimizedUserTable
          users={filteredUsers}
          isLoading={isLoading}
          onViewDetails={handleViewDetails}
          onResetPassword={handleResetPassword}
          onDeleteUser={handleDeleteUser}
          onToggleUserStatus={handleToggleUserStatus}
          onSetPermissionGroup={handleSetPermissionGroup}
        />
      </div>

      <ValidatedUserDialogs
        showAddDialog={showAddDialog}
        setShowAddDialog={setShowAddDialog}
        showInviteDialog={showInviteDialog}
        setShowInviteDialog={setShowInviteDialog}
        onRefresh={refreshUsers}
      />

      <PerformanceOptimizedUserDialogs />

      {/* Monitor de Performance */}
      <PerformanceMonitor
        metrics={performanceMetrics}
        onClearCache={() => smartInvalidate()}
      />
    </div>
  );
};
