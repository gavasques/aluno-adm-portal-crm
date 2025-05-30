
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, X, Tag, Search } from 'lucide-react';
import { useCRMTags } from '@/hooks/crm/useCRMTags';
import { toast } from 'sonner';

interface CRMTagsSelectorProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

const CRMTagsSelector = ({ selectedTags, onTagsChange }: CRMTagsSelectorProps) => {
  const { tags, loading, createTag } = useCRMTags();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#3b82f6');
  const [creating, setCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const predefinedColors = [
    '#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6',
    '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'
  ];

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;

    setCreating(true);
    try {
      const newTag = await createTag(newTagName.trim(), newTagColor);
      
      // Adicionar a nova tag automaticamente à seleção
      onTagsChange([...selectedTags, newTag.id]);
      
      setNewTagName('');
      setNewTagColor('#3b82f6');
      setShowCreateDialog(false);
      toast.success('Tag criada e adicionada com sucesso!');
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
    const newSelectedTags = selectedTags.filter(id => id !== tagId);
    onTagsChange(newSelectedTags);
  };

  if (loading) {
    return <div className="animate-pulse h-8 bg-gray-200 rounded"></div>;
  }

  const selectedTagsData = tags.filter(tag => selectedTags.includes(tag.id));
  const availableTags = tags.filter(tag => 
    !selectedTags.includes(tag.id) && 
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Tags selecionadas */}
      {selectedTagsData.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Tags Selecionadas</Label>
          <div className="flex flex-wrap gap-2">
            {selectedTagsData.map(tag => (
              <Badge
                key={tag.id}
                variant="outline"
                className="px-2 py-1"
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
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Busca e seleção de tags */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Adicionar Tags</Label>
        
        {/* Campo de busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Tags disponíveis */}
        <div className="flex flex-wrap gap-2">
          {availableTags.map(tag => (
            <Button
              key={tag.id}
              variant="outline"
              size="sm"
              onClick={() => toggleTag(tag.id)}
              className="h-8 text-xs"
              style={{ 
                backgroundColor: tag.color + '10',
                borderColor: tag.color + '30'
              }}
            >
              <Tag className="h-3 w-3 mr-1" style={{ color: tag.color }} />
              {tag.name}
            </Button>
          ))}

          {/* Botão para criar nova tag */}
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 text-xs">
                <Plus className="h-3 w-3 mr-1" />
                Nova Tag
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Criar Nova Tag</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tag-name">Nome da Tag</Label>
                  <Input
                    id="tag-name"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    placeholder="Nome da tag"
                    onKeyPress={(e) => e.key === 'Enter' && handleCreateTag()}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Cor da Tag</Label>
                  <div className="flex flex-wrap gap-2">
                    {predefinedColors.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setNewTagColor(color)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          newTagColor === color ? 'border-gray-900 scale-110' : 'border-gray-300 hover:scale-105'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <Input
                    type="color"
                    value={newTagColor}
                    onChange={(e) => setNewTagColor(e.target.value)}
                    className="w-20 h-8"
                  />
                </div>

                {/* Preview da nova tag */}
                {newTagName && (
                  <div className="space-y-2">
                    <Label>Preview</Label>
                    <div>
                      <Badge
                        variant="outline"
                        style={{ 
                          backgroundColor: newTagColor + '15', 
                          color: newTagColor,
                          borderColor: newTagColor + '30'
                        }}
                      >
                        {newTagName}
                      </Badge>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateDialog(false)}
                    disabled={creating}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleCreateTag}
                    disabled={!newTagName.trim() || creating}
                  >
                    {creating ? 'Criando...' : 'Criar e Adicionar'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {availableTags.length === 0 && searchTerm && (
          <p className="text-sm text-muted-foreground text-center py-2">
            Nenhuma tag encontrada para "{searchTerm}"
          </p>
        )}
      </div>
    </div>
  );
};

export default CRMTagsSelector;
