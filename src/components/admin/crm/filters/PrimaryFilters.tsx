
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { CRMPipeline } from '@/types/crm.types';

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
    <>
      {/* Pipeline */}
      <Select value={pipelineId} onValueChange={onPipelineChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Selecionar pipeline" />
        </SelectTrigger>
        <SelectContent>
          {pipelines.map(pipeline => (
            <SelectItem key={pipeline.id} value={pipeline.id}>
              {pipeline.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Busca com debounce */}
      <div className="relative flex-1 min-w-[250px]">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar por nome ou email..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="pl-10"
        />
        {isDebouncing && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>
    </>
  );
};
