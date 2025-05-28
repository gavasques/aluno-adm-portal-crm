
import React from 'react';
import { Table, TableBody } from '@/components/ui/table';
import { UserTableHeader } from './UserTableHeader';
import { UserTableRow } from './UserTableRow';
import { User } from '@/types/user.types';
import EmptyUsersList from '@/components/admin/users/EmptyUsersList';
import LoadingUsersList from '@/components/admin/users/LoadingUsersList';

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  onViewDetails: (user: User) => void;
  onResetPassword: (user: User) => void;
  onChangePassword: (user: User) => void;
  onDeleteUser: (user: User) => void;
  onSetPermissionGroup: (user: User) => void;
  onStorageManagement: (user: User) => void;
  onActivityLogs: (user: User) => void;
  onSendMagicLink: (user: User) => void;
  onToggleMentor: (user: User) => void;
  permissionGroups?: Array<{ id: string; name: string; }>;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  isLoading,
  onViewDetails,
  onResetPassword,
  onChangePassword,
  onDeleteUser,
  onSetPermissionGroup,
  onStorageManagement,
  onActivityLogs,
  onSendMagicLink,
  onToggleMentor,
  permissionGroups = [],
}) => {
  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <UserTableHeader />
          <TableBody>
            <LoadingUsersList />
          </TableBody>
        </Table>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="rounded-md border">
        <Table>
          <UserTableHeader />
          <TableBody>
            <EmptyUsersList />
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <UserTableHeader />
        <TableBody>
          {users.map((user) => (
            <UserTableRow
              key={user.id}
              user={user}
              onViewDetails={onViewDetails}
              onResetPassword={onResetPassword}
              onChangePassword={onChangePassword}
              onDeleteUser={onDeleteUser}
              onSetPermissionGroup={onSetPermissionGroup}
              onStorageManagement={onStorageManagement}
              onActivityLogs={onActivityLogs}
              onSendMagicLink={onSendMagicLink}
              onToggleMentor={onToggleMentor}
              permissionGroups={permissionGroups}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
