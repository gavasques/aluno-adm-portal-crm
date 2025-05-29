
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Shield, GraduationCap, User } from 'lucide-react';
import { User as UserType } from '@/types/user.types';

interface UserBadgesProps {
  user: UserType;
  permissionGroups?: Array<{ id: string; name: string; }>;
}

export const UserBadges: React.FC<UserBadgesProps> = ({ user, permissionGroups = [] }) => {
  const userPermissionGroup = permissionGroups.find(group => group.id === user.permission_group_id);
  const isBanned = userPermissionGroup?.name?.toLowerCase() === "banido";
  const isAdmin = user.role === 'Admin' || userPermissionGroup?.name?.toLowerCase().includes('admin');

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Badge ADM */}
      {isAdmin && (
        <Badge 
          variant="destructive" 
          className="text-xs flex items-center gap-1 bg-red-600 hover:bg-red-700"
        >
          <Shield className="h-3 w-3" />
          ADM
        </Badge>
      )}

      {/* Badge Mentor */}
      {user.is_mentor && !isAdmin && (
        <Badge 
          variant="secondary" 
          className="text-xs flex items-center gap-1 bg-purple-100 text-purple-700 hover:bg-purple-200"
        >
          <GraduationCap className="h-3 w-3" />
          Mentor
        </Badge>
      )}

      {/* Badge Banido */}
      {isBanned && (
        <Badge 
          variant="destructive" 
          className="text-xs flex items-center gap-1 bg-gray-600 hover:bg-gray-700"
        >
          <User className="h-3 w-3" />
          Banido
        </Badge>
      )}

      {/* Badge Status */}
      <Badge 
        variant={user.status === 'Ativo' ? 'default' : 'outline'}
        className={`text-xs ${
          user.status === 'Ativo' 
            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
            : 'bg-gray-100 text-gray-600'
        }`}
      >
        {user.status}
      </Badge>
    </div>
  );
};
