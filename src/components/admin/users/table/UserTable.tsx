
import React, { useState } from "react";
import { 
  Table, 
  TableBody
} from "@/components/ui/table";
import { User } from "@/types/user.types";
import { UserTableHeader } from "./UserTableHeader";
import { UserTableRow } from "./UserTableRow";
import { EmptyUsersList } from "../EmptyUsersList";
import { LoadingUsersList } from "../LoadingUsersList";

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  onViewDetails: (user: User) => void;
  onResetPassword: (email: string) => void;
  onDeleteUser: (userId: string, email: string) => void;
  onToggleUserStatus: (userId: string, email: string, isActive: boolean) => void;
  onSetPermissionGroup?: (userId: string, email: string, permissionGroupId: string | null) => void;
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
