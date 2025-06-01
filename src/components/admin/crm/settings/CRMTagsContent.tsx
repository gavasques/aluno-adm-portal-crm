
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Tags, Search } from 'lucide-react';
import { useCRMTags } from '@/hooks/crm/useCRMTags';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export const CRMTagsContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#3B82F6');
  const [editingTag, setEditingTag] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);

  const { tags, loading, createTag, updateTag, deleteTag } = useCRMTags();

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;
    
    try {
      await createTag({
        name: newTagName.trim(),
        color: newTagColor,
        is_active: true
      });
      setNewTagName('');
      setNewTagColor('#3B82F6');
      setIsCreating(false);
      toast.success('Tag criada com sucesso!');
    } catch (error) {
      toast.error('Erro ao criar tag');
    }
  };

  const handleUpdateTag = async (tagId: string, data: any) => {
    try {
      await updateTag(tagId, data);
      setEditingTag(null);
      toast.success('Tag atualizada com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar tag');
    }
  };

  const handleDeleteTag = async (tagId: string) => {
    if (confirm('Tem certeza que deseja excluir esta tag?')) {
      try {
        await deleteTag(tagId);
        toast.success('Tag excluída com sucesso!');
      } catch (error) {
        toast.error('Erro ao excluir tag');
      }
    }
  };

  const predefinedColors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Tags className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-600" />
          <p className="text-gray-600">Carregando tags...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            Tags do CRM ({tags.length})
          </h3>
          <p className="text-gray-600 text-sm">
            Gerencie as tags para organizar e categorizar seus leads
          </p>
        </div>
        <Button 
          onClick={() => setIsCreating(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Tag
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Buscar tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Create New Tag */}
      {isCreating && (
        <Card className="border-dashed border-blue-300 bg-blue-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Criar Nova Tag</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="Nome da tag"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && handleCreateTag()}
              />
              <div className="flex items-center gap-1">
                {predefinedColors.map((color) => (
                  <button
                    key={color}
                    className={`w-6 h-6 rounded-full border-2 ${
                      newTagColor === color ? 'border-gray-600' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setNewTagColor(color)}
                  />
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreateTag} size="sm">
                Criar Tag
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setIsCreating(false);
                  setNewTagName('');
                  setNewTagColor('#3B82F6');
                }}
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tags List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <AnimatePresence>
          {filteredTags.map((tag) => (
            <motion.div
              key={tag.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              layout
            >
              <Card className="hover:shadow-md transition-all duration-300 group">
                <CardContent className="p-3">
                  {editingTag?.id === tag.id ? (
                    <div className="space-y-2">
                      <Input
                        value={editingTag.name}
                        onChange={(e) => setEditingTag({...editingTag, name: e.target.value})}
                        className="text-sm"
                      />
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1">
                          {predefinedColors.map((color) => (
                            <button
                              key={color}
                              className={`w-5 h-5 rounded-full border ${
                                editingTag.color === color ? 'border-gray-600' : 'border-gray-300'
                              }`}
                              style={{ backgroundColor: color }}
                              onClick={() => setEditingTag({...editingTag, color})}
                            />
                          ))}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            onClick={() => handleUpdateTag(tag.id, editingTag)}
                            className="h-6 px-2 text-xs"
                          >
                            Salvar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingTag(null)}
                            className="h-6 px-2 text-xs"
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-1">
                        <div 
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: tag.color }}
                        />
                        <span className="font-medium text-sm truncate">{tag.name}</span>
                        {!tag.is_active && (
                          <Badge variant="secondary" className="text-xs">Inativa</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingTag(tag)}
                          className="h-6 w-6 p-0 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTag(tag.id)}
                          className="h-6 w-6 p-0 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredTags.length === 0 && (
        <div className="text-center py-12">
          <Tags className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'Nenhuma tag encontrada' : 'Nenhuma tag criada'}
          </h3>
          <p className="text-gray-600 text-sm">
            {searchTerm 
              ? 'Tente ajustar sua busca ou criar uma nova tag.'
              : 'Crie sua primeira tag para organizar seus leads.'
            }
          </p>
        </div>
      )}
    </div>
  );
};
