
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
  onSetPermissionGroup: (user: User) => void;
  onBanUser?: (user: User) => void;
  permissionGroups?: Array<{ id: string; name: string; }>;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  isLoading,
  onViewDetails,
  onResetPassword,
  onDeleteUser,
  onSetPermissionGroup,
  onBanUser,
  permissionGroups = [],
}) => {
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
                onSetPermissionGroup={onSetPermissionGroup}
                onBanUser={onBanUser}
                permissionGroups={permissionGroups}
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
