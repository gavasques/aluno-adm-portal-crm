
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Building2 } from 'lucide-react';
import { CRMPipeline } from '@/types/crm.types';
import { Label } from '@/components/ui/label';

interface PrimaryFiltersProps {
  pipelineId: string;
  onPipelineChange: (pipelineId: string) => void;
  pipelines: CRMPipeline[];
  searchValue: string;
  setSearchValue: (value: string) => void;
  isDebouncing: boolean;
}

export const PrimaryFilters: React.FC<PrimaryFiltersProps> = ({
  pipelineId,
  onPipelineChange,
  pipelines,
  searchValue,
  setSearchValue,
  isDebouncing
}) => {
  return (
    <div className="flex items-center gap-4 flex-1">
      {/* Pipeline Selection */}
      <div className="flex items-center gap-2 min-w-[220px]">
        <Building2 className="h-4 w-4 text-gray-500" />
        <Select value={pipelineId} onValueChange={onPipelineChange}>
          <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
            <SelectValue placeholder="Selecionar pipeline" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg">
            {pipelines.map(pipeline => (
              <SelectItem key={pipeline.id} value={pipeline.id}>
                {pipeline.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar por nome ou email..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        />
        {isDebouncing && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>
    </div>
  );
};
