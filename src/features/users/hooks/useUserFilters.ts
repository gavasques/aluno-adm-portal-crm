
import { useState, useMemo } from 'react';
import { User } from '@/types/user.types';

export const useUserFilters = (users: User[], permissionGroups: Array<{ id: string; name: string; }> = []) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [mentorFilter, setMentorFilter] = useState('all');

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      // Search filter
      const matchesSearch = !searchTerm || 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase());

      // Check if user is banned
      const userPermissionGroup = permissionGroups.find(group => group.id === user.permission_group_id);
      const isBanned = userPermissionGroup?.name?.toLowerCase() === "banido";
      const isAdmin = user.role === 'Admin' || userPermissionGroup?.name?.toLowerCase().includes('admin');

      // Status filter (including banned)
      let matchesStatus = true;
      if (statusFilter !== 'all') {
        if (statusFilter === 'banido') {
          matchesStatus = isBanned;
        } else {
          matchesStatus = user.status?.toLowerCase() === statusFilter.toLowerCase() && !isBanned;
        }
      }

      // Role filter - agora inclui admin
      let matchesRole = true;
      if (roleFilter !== 'all') {
        if (roleFilter === 'admin') {
          matchesRole = isAdmin;
        } else {
          matchesRole = user.role?.toLowerCase() === roleFilter.toLowerCase() && !isAdmin;
        }
      }

      // Mentor filter - corrigido para verificar is_mentor
      let matchesMentor = true;
      if (mentorFilter !== 'all') {
        if (mentorFilter === 'mentor') {
          matchesMentor = user.is_mentor === true;
        } else if (mentorFilter === 'notMentor') {
          matchesMentor = user.is_mentor !== true;
        }
      }

      return matchesSearch && matchesStatus && matchesRole && matchesMentor;
    });
  }, [users, searchTerm, statusFilter, roleFilter, mentorFilter, permissionGroups]);

  const stats = useMemo(() => {
    const total = filteredUsers.length;
    
    // Count banned users
    const bannedUsers = filteredUsers.filter(user => {
      const userPermissionGroup = permissionGroups.find(group => group.id === user.permission_group_id);
      return userPermissionGroup?.name?.toLowerCase() === "banido";
    }).length;
    
    // Count other statuses (excluding banned users)
    const nonBannedUsers = filteredUsers.filter(user => {
      const userPermissionGroup = permissionGroups.find(group => group.id === user.permission_group_id);
      return userPermissionGroup?.name?.toLowerCase() !== "banido";
    });
    
    const active = nonBannedUsers.filter(user => user.status?.toLowerCase() === 'ativo').length;
    const inactive = nonBannedUsers.filter(user => user.status?.toLowerCase() === 'inativo').length;
    const pending = nonBannedUsers.filter(user => user.status?.toLowerCase() === 'pendente').length;

    return { total, active, inactive, pending, banned: bannedUsers };
  }, [filteredUsers, permissionGroups]);

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    roleFilter,
    setRoleFilter,
    mentorFilter,
    setMentorFilter,
    filteredUsers,
    stats
  };
};
