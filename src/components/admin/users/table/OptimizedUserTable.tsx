
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
  console.log('🔧 OptimizedUserTable handlers:', {
    onViewDetails: !!onViewDetails,
    onResetPassword: !!onResetPassword,
    onDeleteUser: !!onDeleteUser,
    onToggleUserStatus: !!onToggleUserStatus,
    onSetPermissionGroup: !!onSetPermissionGroup
  });

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
                onViewDetails={(user) => {
                  console.log('🔧 Table onViewDetails called for:', user.email);
                  onViewDetails(user);
                }}
                onResetPassword={(user) => {
                  console.log('🔧 Table onResetPassword called for:', user.email);
                  onResetPassword(user);
                }}
                onDeleteUser={(user) => {
                  console.log('🔧 Table onDeleteUser called for:', user.email);
                  onDeleteUser(user);
                }}
                onToggleUserStatus={(user) => {
                  console.log('🔧 Table onToggleUserStatus called for:', user.email);
                  onToggleUserStatus(user);
                }}
                onSetPermissionGroup={onSetPermissionGroup ? (user) => {
                  console.log('🔧 Table onSetPermissionGroup called for:', user.email);
                  onSetPermissionGroup(user);
                } : undefined}
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
