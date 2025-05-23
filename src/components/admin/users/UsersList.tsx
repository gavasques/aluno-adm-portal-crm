
import React, { useState } from "react";
import { 
  Table, 
  TableBody
} from "@/components/ui/table";
import UserDetailsDialog from "./UserDetailsDialog";
import UserSearchBar from "./UserSearchBar";
import UserActionButtons from "./UserActionButtons";
import UsersTableHeader from "./UsersTableHeader";
import UserTableRow from "./UserTableRow";
import EmptyUsersList from "./EmptyUsersList";
import LoadingUsersList from "./LoadingUsersList";

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

  // Filtrar usuários de acordo com a pesquisa
  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setShowDetailsDialog(true);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <UserSearchBar searchQuery={searchQuery} onSearchChange={onSearchChange} />
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
