
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Plus, X, Tag } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { CRMTag } from '@/types/crm.types';
import { toast } from 'sonner';

interface SimpleCRMTagsSelectorProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

const SimpleCRMTagsSelector = ({ selectedTags, onTagsChange }: SimpleCRMTagsSelectorProps) => {
  const [tags, setTags] = useState<CRMTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTagName, setNewTagName] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('crm_tags')
        .select('*')
        .order('name');

      if (error) {
        console.error('Erro ao carregar tags:', error);
        toast.error('Erro ao carregar tags');
        return;
      }

      setTags(data || []);
    } catch (error) {
      console.error('Erro ao carregar tags:', error);
      toast.error('Erro ao carregar tags');
    } finally {
      setLoading(false);
    }
  };

  const createTag = async () => {
    if (!newTagName.trim()) return;

    setCreating(true);
    try {
      const { data, error } = await supabase
        .from('crm_tags')
        .insert({ 
          name: newTagName.trim(), 
          color: '#3b82f6' 
        })
        .select()
        .single();

      if (error) throw error;

      setTags(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
      onTagsChange([...selectedTags, data.id]);
      setNewTagName('');
      toast.success('Tag criada com sucesso!');
    } catch (error) {
      console.error('Erro ao criar tag:', error);
      toast.error('Erro ao criar tag');
    } finally {
      setCreating(false);
    }
  };

  const toggleTag = (tagId: string) => {
    const newSelectedTags = selectedTags.includes(tagId)
      ? selectedTags.filter(id => id !== tagId)
      : [...selectedTags, tagId];
    
    onTagsChange(newSelectedTags);
  };

  const removeTag = (tagId: string) => {
    onTagsChange(selectedTags.filter(id => id !== tagId));
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-8 bg-gray-200 rounded"></div>
      </div>
    );
  }

  const selectedTagsData = tags.filter(tag => selectedTags.includes(tag.id));
  const availableTags = tags.filter(tag => !selectedTags.includes(tag.id));

  return (
    <div className="space-y-3">
      {/* Tags selecionadas */}
      {selectedTagsData.length > 0 && (
        <div className="space-y-1">
          <Label className="text-xs">Tags Selecionadas</Label>
          <div className="flex flex-wrap gap-1">
            {selectedTagsData.map(tag => (
              <Badge
                key={tag.id}
                variant="outline"
                className="px-2 py-0.5 text-xs"
                style={{ 
                  backgroundColor: tag.color + '15', 
                  color: tag.color,
                  borderColor: tag.color + '30'
                }}
              >
                {tag.name}
                <button
                  onClick={() => removeTag(tag.id)}
                  className="ml-1 hover:text-red-500 transition-colors"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Adicionar nova tag */}
      <div className="space-y-2">
        <Label className="text-xs">Adicionar Tags</Label>
        
        {/* Campo para criar nova tag */}
        <div className="flex gap-2">
          <Input
            placeholder="Nome da nova tag"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            className="h-7 text-xs"
            onKeyPress={(e) => e.key === 'Enter' && createTag()}
          />
          <Button
            type="button"
            size="sm"
            onClick={createTag}
            disabled={!newTagName.trim() || creating}
            className="h-7 px-2"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>

        {/* Tags disponíveis */}
        {availableTags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {availableTags.slice(0, 10).map(tag => (
              <Button
                key={tag.id}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => toggleTag(tag.id)}
                className="h-6 text-xs px-2"
                style={{ 
                  backgroundColor: tag.color + '10',
                  borderColor: tag.color + '30'
                }}
              >
                <Tag className="h-2.5 w-2.5 mr-1" style={{ color: tag.color }} />
                {tag.name}
              </Button>
            ))}
            {availableTags.length > 10 && (
              <span className="text-xs text-muted-foreground self-center">
                +{availableTags.length - 10} mais...
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleCRMTagsSelector;
