
import React, { memo, useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import { Table } from '@/components/ui/table';
import { User } from '@/types/user.types';
import { UserTableHeader } from './UserTableHeader';
import { OptimizedUserTableRow } from './OptimizedUserTableRow';
import EmptyUsersList from '@/components/admin/users/EmptyUsersList';
import LoadingUsersList from '@/components/admin/users/LoadingUsersList';
import { Card, CardContent } from '@/components/ui/card';

interface VirtualizedUserTableProps {
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

const ROW_HEIGHT = 72;
const TABLE_HEIGHT = 600;

interface RowRendererProps {
  index: number;
  style: any;
  data: {
    users: User[];
    handlers: {
      onViewDetails: (user: User) => void;
      onResetPassword: (user: User) => void;
      onChangePassword: (user: User) => void;
      onDeleteUser: (user: User) => void;
      onSetPermissionGroup: (user: User) => void;
      onStorageManagement: (user: User) => void;
      onActivityLogs: (user: User) => void;
      onSendMagicLink: (user: User) => void;
      onToggleMentor: (user: User) => void;
    };
    permissionGroups?: Array<{ id: string; name: string; }>;
  };
}

const RowRenderer = memo<RowRendererProps>(({ index, style, data }) => {
  const user = data.users[index];
  
  return (
    <div style={style}>
      <OptimizedUserTableRow
        user={user}
        {...data.handlers}
        permissionGroups={data.permissionGroups}
      />
    </div>
  );
});

RowRenderer.displayName = 'RowRenderer';

export const VirtualizedUserTable = memo<VirtualizedUserTableProps>(({
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
  const handlers = useMemo(() => ({
    onViewDetails,
    onResetPassword,
    onChangePassword,
    onDeleteUser,
    onSetPermissionGroup,
    onStorageManagement,
    onActivityLogs,
    onSendMagicLink,
    onToggleMentor,
  }), [
    onViewDetails,
    onResetPassword,
    onChangePassword,
    onDeleteUser,
    onSetPermissionGroup,
    onStorageManagement,
    onActivityLogs,
    onSendMagicLink,
    onToggleMentor,
  ]);

  const itemData = useMemo(() => ({
    users,
    handlers,
    permissionGroups,
  }), [users, handlers, permissionGroups]);

  if (isLoading) {
    return (
      <Card className="shadow-sm">
        <CardContent className="p-0">
          <Table>
            <UserTableHeader />
            <LoadingUsersList />
          </Table>
        </CardContent>
      </Card>
    );
  }

  if (users.length === 0) {
    return (
      <Card className="shadow-sm">
        <CardContent className="p-0">
          <Table>
            <UserTableHeader />
            <EmptyUsersList />
          </Table>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardContent className="p-0">
        <Table>
          <UserTableHeader />
        </Table>
        <div className="border-t">
          <List
            height={Math.min(TABLE_HEIGHT, users.length * ROW_HEIGHT)}
            itemCount={users.length}
            itemSize={ROW_HEIGHT}
            itemData={itemData}
            overscanCount={5}
          >
            {RowRenderer}
          </List>
        </div>
      </CardContent>
    </Card>
  );
});

VirtualizedUserTable.displayName = 'VirtualizedUserTable';
