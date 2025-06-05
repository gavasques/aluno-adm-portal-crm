
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Tag, ChevronDown } from 'lucide-react';
import { CRMTag } from '@/types/crm.types';

interface TagsDropdownFilterProps {
  selectedTags: string[];
  onTagsChange: (tagIds: string[]) => void;
  tags: CRMTag[];
}

export const TagsDropdownFilter: React.FC<TagsDropdownFilterProps> = ({
  selectedTags,
  onTagsChange,
  tags
}) => {
  const [open, setOpen] = useState(false);

  const toggleTag = (tagId: string) => {
    const newSelectedTags = selectedTags.includes(tagId)
      ? selectedTags.filter(id => id !== tagId)
      : [...selectedTags, tagId];
    
    onTagsChange(newSelectedTags);
  };

  const selectedTagsData = tags.filter(tag => selectedTags.includes(tag.id));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="min-w-[140px] justify-between border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-9 bg-white"
        >
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-gray-500" />
            {selectedTags.length === 0 ? (
              <span className="text-gray-500">Tags</span>
            ) : (
              <span className="text-gray-900">
                {selectedTags.length} tag{selectedTags.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0 bg-white border border-gray-200 shadow-lg" align="start">
        <div className="p-3">
          <div className="text-sm font-medium text-gray-700 mb-3">Selecionar Tags</div>
          
          {/* Tags selecionadas */}
          {selectedTagsData.length > 0 && (
            <div className="mb-3">
              <div className="text-xs text-gray-600 mb-2">Selecionadas:</div>
              <div className="flex flex-wrap gap-1">
                {selectedTagsData.map(tag => (
                  <Badge
                    key={tag.id}
                    variant="outline"
                    className="text-xs px-2 py-1"
                    style={{ 
                      backgroundColor: tag.color + '20', 
                      color: tag.color,
                      borderColor: tag.color + '40'
                    }}
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* Lista de todas as tags */}
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {tags.map(tag => (
              <div key={tag.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`tag-${tag.id}`}
                  checked={selectedTags.includes(tag.id)}
                  onCheckedChange={() => toggleTag(tag.id)}
                />
                <label
                  htmlFor={`tag-${tag.id}`}
                  className="flex items-center gap-2 text-sm cursor-pointer flex-1"
                >
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: tag.color }}
                  />
                  {tag.name}
                </label>
              </div>
            ))}
          </div>
          
          {tags.length === 0 && (
            <div className="text-sm text-gray-500 text-center py-4">
              Nenhuma tag disponível
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
