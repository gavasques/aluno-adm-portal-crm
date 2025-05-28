
import React, { useState, useMemo } from "react";
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
  onChangePassword: (user: User) => void;
  onDeleteUser: (user: User) => void;
  onSetPermissionGroup: (user: User) => void;
  onBanUser?: (user: User) => void;
  onStorageManagement: (user: User) => void;
  onActivityLogs: (user: User) => void;
  onSendMagicLink: (user: User) => void;
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
  onBanUser,
  onStorageManagement,
  onActivityLogs,
  onSendMagicLink,
  permissionGroups = [],
}) => {
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedUsers = useMemo(() => {
    if (!sortField) return users;

    return [...users].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'name':
          aValue = a.name?.toLowerCase() || '';
          bValue = b.name?.toLowerCase() || '';
          break;
        case 'status':
          aValue = a.status?.toLowerCase() || '';
          bValue = b.status?.toLowerCase() || '';
          break;
        case 'role':
          aValue = a.role?.toLowerCase() || '';
          bValue = b.role?.toLowerCase() || '';
          break;
        case 'lastLogin':
          // Tratamento especial para datas
          if (a.lastLogin === 'Nunca') aValue = new Date(0);
          else aValue = new Date(a.lastLogin || 0);
          
          if (b.lastLogin === 'Nunca') bValue = new Date(0);
          else bValue = new Date(b.lastLogin || 0);
          break;
        case 'storage':
          aValue = a.storage_used_mb || 0;
          bValue = b.storage_used_mb || 0;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [users, sortField, sortDirection]);

  return (
    <div className="rounded-md border">
      <Table>
        <UserTableHeader 
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
        <TableBody>
          {isLoading ? (
            <LoadingUsersList />
          ) : sortedUsers.length > 0 ? (
            sortedUsers.map((user) => (
              <UserTableRow 
                key={user.id}
                user={user}
                onViewDetails={onViewDetails}
                onResetPassword={onResetPassword}
                onChangePassword={onChangePassword}
                onDeleteUser={onDeleteUser}
                onSetPermissionGroup={onSetPermissionGroup}
                onBanUser={onBanUser}
                onStorageManagement={onStorageManagement}
                onActivityLogs={onActivityLogs}
                onSendMagicLink={onSendMagicLink}
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
