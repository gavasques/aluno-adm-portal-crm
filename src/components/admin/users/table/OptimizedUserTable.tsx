
import React from "react";
import { 
  Table, 
  TableBody
} from "@/components/ui/table";
import { User } from "@/types/user.types";
import { UserTableHeader } from "./UserTableHeader";
import { OptimizedUserTableRow } from "../OptimizedUserTableRow";
import EmptyUsersList from "../EmptyUsersList";
import LoadingUsersList from "../LoadingUsersList";

interface OptimizedUserTableProps {
  users: User[];
  isLoading: boolean;
  onViewDetails: (user: User) => void;
  onResetPassword: (user: User) => void;
  onDeleteUser: (user: User) => void;
  onToggleUserStatus: (user: User) => void;
  onSetPermissionGroup?: (user: User) => void;
}

export const OptimizedUserTable: React.FC<OptimizedUserTableProps> = ({
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
              <OptimizedUserTableRow 
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
