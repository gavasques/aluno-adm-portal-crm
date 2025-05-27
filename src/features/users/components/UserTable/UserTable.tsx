
import React from "react";
import { 
  Table, 
  TableBody
} from "@/components/ui/table";
import { User } from "@/types/user.types";
import { UserTableHeader } from "./UserTableHeader";
import { UserTableRow } from "./UserTableRow";
import EmptyUsersList from "@/components/admin/users/EmptyUsersList";
import LoadingUsersList from "@/components/admin/users/LoadingUsersList";

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  onViewDetails: (user: User) => void;
  onResetPassword: (user: User) => void;
  onDeleteUser: (user: User) => void;
  onToggleUserStatus: (user: User) => void;
  onSetPermissionGroup: (user: User) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  isLoading,
  onViewDetails,
  onResetPassword,
  onDeleteUser,
  onToggleUserStatus,
  onSetPermissionGroup,
}) => {
  console.log('🔧 UserTable: Rendering with', users.length, 'users');

  return (
    <div className="rounded-md border">
      <Table>
        <UserTableHeader />
        <TableBody>
          {isLoading ? (
            <LoadingUsersList />
          ) : users.length > 0 ? (
            users.map((user) => (
              <UserTableRow 
                key={user.id}
                user={user}
                onViewDetails={onViewDetails}
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
  );
};
