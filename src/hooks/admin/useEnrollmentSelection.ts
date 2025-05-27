
import { useState, useCallback, useMemo } from 'react';

export const useEnrollmentSelection = () => {
  const [selectedEnrollments, setSelectedEnrollments] = useState<string[]>([]);

  const toggleEnrollmentSelection = useCallback((id: string) => {
    setSelectedEnrollments(prev => 
      prev.includes(id) 
        ? prev.filter(enrollmentId => enrollmentId !== id)
        : [...prev, id]
    );
  }, []);

  const selectAll = useCallback((enrollmentIds: string[]) => {
    setSelectedEnrollments(enrollmentIds);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedEnrollments([]);
  }, []);

  const isSelected = useCallback((id: string) => {
    return selectedEnrollments.includes(id);
  }, [selectedEnrollments]);

  const selectedCount = useMemo(() => selectedEnrollments.length, [selectedEnrollments]);

  return {
    selectedEnrollments,
    toggleEnrollmentSelection,
    selectAll,
    clearSelection,
    isSelected,
    selectedCount
  };
};
