
import { useState, useCallback } from 'react';

export const useMentoringEnrollmentSelection = () => {
  const [selectedEnrollments, setSelectedEnrollments] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

  const toggleEnrollmentSelection = useCallback((id: string) => {
    setSelectedEnrollments(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  }, []);

  const toggleGroupSelection = useCallback((id: string) => {
    setSelectedGroups(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  }, []);

  const selectAllIndividual = useCallback((filteredEnrollments: any[]) => {
    setSelectedEnrollments(
      selectedEnrollments.length === filteredEnrollments.length 
        ? [] 
        : filteredEnrollments.map(e => e.id)
    );
  }, [selectedEnrollments]);

  const clearSelection = useCallback(() => {
    setSelectedEnrollments([]);
    setSelectedGroups([]);
  }, []);

  return {
    selectedEnrollments,
    selectedGroups,
    toggleEnrollmentSelection,
    toggleGroupSelection,
    selectAllIndividual,
    clearSelection,
    setSelectedEnrollments,
    setSelectedGroups
  };
};
