
import { useState, useMemo } from 'react';
import { StudentMentoringEnrollment, GroupEnrollment } from '@/types/mentoring.types';
import { mockGroupEnrollments } from '@/data/mockGroupEnrollments';

export const useMentoringEnrollmentsState = (enrollments: StudentMentoringEnrollment[]) => {
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');
  const [selectedEnrollments, setSelectedEnrollments] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('individual');

  // Mock groups data - in real implementation, this would come from a hook
  const [groups] = useState<GroupEnrollment[]>(mockGroupEnrollments);

  // Separate individual and group enrollments
  const { individualEnrollments, groupEnrollments } = useMemo(() => {
    const individual = enrollments.filter(e => !e.groupId);
    const group = enrollments.filter(e => e.groupId);
    
    return {
      individualEnrollments: individual,
      groupEnrollments: group
    };
  }, [enrollments]);

  // Filter individual enrollments
  const filteredIndividualEnrollments = useMemo(() => {
    return individualEnrollments.filter(enrollment => {
      const matchesSearch = !searchTerm || 
        enrollment.mentoring.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enrollment.responsibleMentor.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = !statusFilter || enrollment.status === statusFilter;
      const matchesType = !typeFilter || enrollment.mentoring.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [individualEnrollments, searchTerm, statusFilter, typeFilter]);

  // Filter groups
  const filteredGroups = useMemo(() => {
    return groups.filter(group => {
      const matchesSearch = !searchTerm || 
        group.groupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.responsibleMentor.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = !statusFilter || group.status === statusFilter;
      const matchesType = !typeFilter || group.mentoring.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [groups, searchTerm, statusFilter, typeFilter]);

  // Calculate statistics
  const statistics = useMemo(() => {
    const totalIndividual = individualEnrollments.length;
    const totalGroups = groups.length;
    const totalGroupParticipants = groups.reduce((sum, g) => sum + g.participants.length, 0);
    const total = totalIndividual + totalGroupParticipants;
    
    return {
      total,
      active: individualEnrollments.filter(e => e.status === 'ativa').length + 
              groups.filter(g => g.status === 'ativa').reduce((sum, g) => sum + g.participants.length, 0),
      completed: individualEnrollments.filter(e => e.status === 'concluida').length +
                 groups.filter(g => g.status === 'concluida').reduce((sum, g) => sum + g.participants.length, 0),
      paused: individualEnrollments.filter(e => e.status === 'pausada').length +
              groups.filter(g => g.status === 'pausada').reduce((sum, g) => sum + g.participants.length, 0),
    };
  }, [individualEnrollments, groups]);

  return {
    // State
    searchTerm,
    statusFilter,
    typeFilter,
    viewMode,
    selectedEnrollments,
    selectedGroups,
    activeTab,
    
    // Setters
    setSearchTerm,
    setStatusFilter,
    setTypeFilter,
    setViewMode,
    setSelectedEnrollments,
    setSelectedGroups,
    setActiveTab,
    
    // Data
    groups,
    filteredIndividualEnrollments,
    filteredGroups,
    statistics
  };
};
