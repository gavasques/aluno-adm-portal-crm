
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

      // Status filter (including banned)
      let matchesStatus = true;
      if (statusFilter !== 'all') {
        if (statusFilter === 'banido') {
          matchesStatus = isBanned;
        } else {
          matchesStatus = user.status?.toLowerCase() === statusFilter.toLowerCase() && !isBanned;
        }
      }

      // Role filter
      const matchesRole = roleFilter === 'all' || 
        user.role?.toLowerCase() === roleFilter.toLowerCase();

      // Mentor filter
      const matchesMentor = mentorFilter === 'all' ||
        (mentorFilter === 'mentor' && user.is_mentor) ||
        (mentorFilter === 'notMentor' && !user.is_mentor);

      return matchesSearch && matchesStatus && matchesRole && matchesMentor;
    });
  }, [users, searchTerm, statusFilter, roleFilter, mentorFilter, permissionGroups]);

  const stats = useMemo(() => {
    const total = users.length;
    
    // Count banned users
    const bannedUsers = users.filter(user => {
      const userPermissionGroup = permissionGroups.find(group => group.id === user.permission_group_id);
      return userPermissionGroup?.name?.toLowerCase() === "banido";
    }).length;
    
    // Count other statuses (excluding banned users)
    const nonBannedUsers = users.filter(user => {
      const userPermissionGroup = permissionGroups.find(group => group.id === user.permission_group_id);
      return userPermissionGroup?.name?.toLowerCase() !== "banido";
    });
    
    const active = nonBannedUsers.filter(user => user.status?.toLowerCase() === 'ativo').length;
    const inactive = nonBannedUsers.filter(user => user.status?.toLowerCase() === 'inativo').length;
    const pending = nonBannedUsers.filter(user => user.status?.toLowerCase() === 'pendente').length;

    return { total, active, inactive, pending, banned: bannedUsers };
  }, [users, permissionGroups]);

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
