
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, Clock, DollarSign, Edit } from 'lucide-react';
import { MentoringExtensionOption } from '@/types/mentoring.types';

interface ExtensionsManagerProps {
  extensions: MentoringExtensionOption[];
  onExtensionsChange: (extensions: MentoringExtensionOption[]) => void;
}

const ExtensionsManager: React.FC<ExtensionsManagerProps> = ({
  extensions,
  onExtensionsChange
}) => {
  const [newExtension, setNewExtension] = useState<Partial<MentoringExtensionOption>>({
    months: 1,
    price: 0,
    description: ''
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAddExtension = () => {
    if (newExtension.months && newExtension.price !== undefined && newExtension.description) {
      const extension: MentoringExtensionOption = {
        id: `ext-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        months: newExtension.months,
        price: newExtension.price,
        description: newExtension.description.trim()
      };
      
      console.log('➕ Adicionando nova extensão:', extension);
      const updatedExtensions = [...extensions, extension];
      onExtensionsChange(updatedExtensions);
      
      // Resetar formulário
      setNewExtension({ months: 1, price: 0, description: '' });
    }
  };

  const handleRemoveExtension = (id: string) => {
    console.log('🗑️ Removendo extensão:', id);
    const updatedExtensions = extensions.filter(ext => ext.id !== id);
    onExtensionsChange(updatedExtensions);
  };

  const handleUpdateExtension = (id: string, field: keyof MentoringExtensionOption, value: any) => {
    console.log('✏️ Atualizando extensão:', { id, field, value });
    const updatedExtensions = extensions.map(ext => 
      ext.id === id ? { ...ext, [field]: value } : ext
    );
    onExtensionsChange(updatedExtensions);
  };

  const handleEditToggle = (id: string) => {
    setEditingId(editingId === id ? null : id);
  };

  // Validar se pode adicionar extensão
  const canAddExtension = newExtension.months && 
                         newExtension.months > 0 && 
                         newExtension.price !== undefined && 
                         newExtension.price >= 0 && 
                         newExtension.description && 
                         newExtension.description.trim().length > 0;

  return (
    <div className="space-y-6">
      {/* Lista de Extensões Existentes */}
      {extensions.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-500" />
            <h4 className="text-base font-semibold">Extensões Configuradas</h4>
          </div>
          
          {extensions.map((extension) => (
            <Card key={extension.id} className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span className="font-semibold text-blue-900">
                          {extension.months} {extension.months === 1 ? 'mês' : 'meses'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="font-semibold text-green-700">
                          R$ {extension.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    
                    {editingId === extension.id ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label className="text-xs">Duração (meses)</Label>
                            <Input
                              type="number"
                              min="1"
                              value={extension.months}
                              onChange={(e) => handleUpdateExtension(extension.id, 'months', Number(e.target.value))}
                              className="h-8"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Preço (R$)</Label>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={extension.price}
                              onChange={(e) => handleUpdateExtension(extension.id, 'price', Number(e.target.value))}
                              className="h-8"
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Descrição</Label>
                          <Textarea
                            value={extension.description}
                            onChange={(e) => handleUpdateExtension(extension.id, 'description', e.target.value)}
                            rows={2}
                            className="text-sm"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-600">
                        {extension.description}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-1 ml-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditToggle(extension.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveExtension(extension.id)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Separator />

      {/* Formulário para Nova Extensão */}
      <Card className="border-dashed border-2 border-gray-300 hover:border-blue-400 transition-colors">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Adicionar Nova Extensão
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="new-months" className="text-sm font-medium">
                Duração (meses) *
              </Label>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <Input
                  id="new-months"
                  type="number"
                  min="1"
                  max="24"
                  value={newExtension.months || ''}
                  onChange={(e) => setNewExtension({...newExtension, months: Number(e.target.value)})}
                  placeholder="Ex: 3"
                  className="h-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-price" className="text-sm font-medium">
                Preço (R$) *
              </Label>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-400" />
                <Input
                  id="new-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={newExtension.price || ''}
                  onChange={(e) => setNewExtension({...newExtension, price: Number(e.target.value)})}
                  placeholder="Ex: 300.00"
                  className="h-9"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-description" className="text-sm font-medium">
              Descrição *
            </Label>
            <Textarea
              id="new-description"
              value={newExtension.description || ''}
              onChange={(e) => setNewExtension({...newExtension, description: e.target.value})}
              placeholder="Descreva os benefícios desta extensão..."
              rows={3}
              className="text-sm"
            />
          </div>

          <Button 
            onClick={handleAddExtension}
            disabled={!canAddExtension}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Extensão
          </Button>
          
          {!canAddExtension && (
            <p className="text-xs text-gray-500 text-center">
              Preencha todos os campos obrigatórios para adicionar a extensão
            </p>
          )}
        </CardContent>
      </Card>

      {/* Estado Vazio */}
      {extensions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Clock className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <h3 className="text-lg font-medium mb-2">Nenhuma extensão configurada</h3>
          <p className="text-sm">
            Adicione extensões para oferecer opções de prolongamento aos clientes.
          </p>
          <p className="text-xs mt-1">
            Por exemplo: +1 mês, +3 meses, +6 meses, etc.
          </p>
        </div>
      )}
    </div>
  );
};

export default ExtensionsManager;
