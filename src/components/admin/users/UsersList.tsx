
import React, { useState } from "react";
import { 
  Table, 
  TableBody
} from "@/components/ui/table";
import UserDetailsDialog from "./UserDetailsDialog";
import UserActionButtons from "./UserActionButtons";
import UsersTableHeader from "./UsersTableHeader";
import UserTableRow from "./UserTableRow";
import EmptyUsersList from "./EmptyUsersList";
import LoadingUsersList from "./LoadingUsersList";
import UsersFilter from "./UsersFilter";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
  tasks: any[];
  permission_group_id?: string | null;
}

interface UsersListProps {
  users: User[];
  isLoading: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onResetPassword: (email: string) => void;
  onAddUser: () => void;
  onInviteUser: () => void;
  onDeleteUser: (userId: string, email: string) => void;
  onToggleUserStatus: (userId: string, email: string, isActive: boolean) => void;
  onSetPermissionGroup?: (userId: string, email: string, permissionGroupId: string | null) => void;
}

const UsersList: React.FC<UsersListProps> = ({
  users,
  isLoading,
  searchQuery,
  onSearchChange,
  onResetPassword,
  onAddUser,
  onInviteUser,
  onDeleteUser,
  onToggleUserStatus,
  onSetPermissionGroup,
}) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [groupFilter, setGroupFilter] = useState("all");

  // Contar usuários pendentes (aproximação - verificar se não é Admin e tem permission_group_id)
  const pendingCount = users.filter(user => 
    user.permission_group_id && user.role !== "Admin"
  ).length;

  // Filtrar usuários de acordo com os filtros aplicados
  const filteredUsers = users.filter(user => {
    // Filtro de busca
    const matchesSearch = user.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filtro de status
    const matchesStatus = statusFilter === "all" || 
                         user.status.toLowerCase().includes(statusFilter.toLowerCase());
    
    // Filtro de grupo
    let matchesGroup = true;
    if (groupFilter === "pending") {
      matchesGroup = user.permission_group_id && user.role !== "Admin";
    } else if (groupFilter === "assigned") {
      matchesGroup = !user.permission_group_id || user.role === "Admin";
    }
    
    return matchesSearch && matchesStatus && matchesGroup;
  });

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setShowDetailsDialog(true);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex-1">
          <UsersFilter
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            groupFilter={groupFilter}
            onGroupFilterChange={setGroupFilter}
            pendingCount={pendingCount}
            totalCount={users.length}
          />
        </div>
        <UserActionButtons onAddUser={onAddUser} onInviteUser={onInviteUser} />
      </div>

      <div className="rounded-md border">
        <Table>
          <UsersTableHeader />
          <TableBody>
            {isLoading ? (
              <LoadingUsersList />
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <UserTableRow 
                  key={user.id}
                  user={user}
                  onViewDetails={handleViewDetails}
                  onResetPassword={onResetPassword}
                  onDeleteUser={onDeleteUser}
                  onToggleUserStatus={onToggleUserStatus}
                  onSetPermissionGroup={onSetPermissionGroup}
                />
              ))
            ) : (
              <EmptyUsersList />
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog de detalhes do usuário */}
      <UserDetailsDialog
        open={showDetailsDialog}
        onOpenChange={setShowDetailsDialog}
        user={selectedUser}
      />
    </div>
  );
};

export default UsersList;
