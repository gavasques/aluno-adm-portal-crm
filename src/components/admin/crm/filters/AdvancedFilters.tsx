
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, Calendar, Clock, AlertTriangle, X, Tag, Users, Layers } from 'lucide-react';
import { CRMFilters, CRMPipelineColumn, CRMUser, CRMTag } from '@/types/crm.types';

interface AdvancedFiltersProps {
  filters: CRMFilters;
  updateFilter: (key: keyof CRMFilters, value: any) => void;
  pipelineColumns: CRMPipelineColumn[];
  users: CRMUser[];
  tags: CRMTag[];
  handleTagsChange: (tagIds: string[]) => void;
}

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  filters,
  updateFilter,
  pipelineColumns,
  users,
  tags,
  handleTagsChange
}) => {
  return (
    <div className="flex items-center gap-3">
      <Button variant="outline" size="sm" className="h-9 px-3 border-gray-300 text-gray-600">
        <Filter className="h-4 w-4 mr-2" />
        Filtros
      </Button>
    </div>
  );
};
