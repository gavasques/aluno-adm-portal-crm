
import { useState, useMemo } from 'react';
import { User } from '@/types/user.types';

export const useUserFilters = (users: User[]) => {
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

      // Status filter
      const matchesStatus = statusFilter === 'all' || 
        user.status?.toLowerCase() === statusFilter.toLowerCase();

      // Role filter
      const matchesRole = roleFilter === 'all' || 
        user.role?.toLowerCase() === roleFilter.toLowerCase();

      // Mentor filter
      const matchesMentor = mentorFilter === 'all' ||
        (mentorFilter === 'mentor' && user.is_mentor) ||
        (mentorFilter === 'notMentor' && !user.is_mentor);

      return matchesSearch && matchesStatus && matchesRole && matchesMentor;
    });
  }, [users, searchTerm, statusFilter, roleFilter, mentorFilter]);

  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter(user => user.status?.toLowerCase() === 'ativo').length;
    const inactive = users.filter(user => user.status?.toLowerCase() === 'inativo').length;
    const pending = users.filter(user => user.status?.toLowerCase() === 'pendente').length;

    return { total, active, inactive, pending };
  }, [users]);

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
