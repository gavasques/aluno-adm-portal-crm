
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, Clock, DollarSign } from 'lucide-react';
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

  const handleAddExtension = () => {
    if (newExtension.months && newExtension.price && newExtension.description) {
      const extension: MentoringExtensionOption = {
        id: `ext-${Date.now()}`,
        months: newExtension.months,
        price: newExtension.price,
        description: newExtension.description
      };
      
      onExtensionsChange([...extensions, extension]);
      setNewExtension({ months: 1, price: 0, description: '' });
    }
  };

  const handleRemoveExtension = (id: string) => {
    onExtensionsChange(extensions.filter(ext => ext.id !== id));
  };

  const handleUpdateExtension = (id: string, field: keyof MentoringExtensionOption, value: any) => {
    onExtensionsChange(
      extensions.map(ext => 
        ext.id === id ? { ...ext, [field]: value } : ext
      )
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Plus className="h-5 w-5 text-blue-500" />
        <h3 className="text-lg font-semibold">Extensões Disponíveis</h3>
      </div>

      {/* Lista de Extensões Existentes */}
      {extensions.length > 0 && (
        <div className="space-y-3">
          {extensions.map((extension) => (
            <Card key={extension.id} className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                  <div className="space-y-2">
                    <Label htmlFor={`months-${extension.id}`}>Duração (meses)</Label>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <Input
                        id={`months-${extension.id}`}
                        type="number"
                        min="1"
                        value={extension.months}
                        onChange={(e) => handleUpdateExtension(extension.id, 'months', Number(e.target.value))}
                        className="h-8"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`price-${extension.id}`}>Preço (R$)</Label>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <Input
                        id={`price-${extension.id}`}
                        type="number"
                        min="0"
                        value={extension.price}
                        onChange={(e) => handleUpdateExtension(extension.id, 'price', Number(e.target.value))}
                        className="h-8"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveExtension(extension.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="mt-3 space-y-2">
                  <Label htmlFor={`description-${extension.id}`}>Descrição</Label>
                  <Textarea
                    id={`description-${extension.id}`}
                    value={extension.description}
                    onChange={(e) => handleUpdateExtension(extension.id, 'description', e.target.value)}
                    placeholder="Descreva os benefícios desta extensão..."
                    rows={2}
                    className="text-sm"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Separator className="my-4" />

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
              <Label htmlFor="new-months">Duração (meses)</Label>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <Input
                  id="new-months"
                  type="number"
                  min="1"
                  value={newExtension.months || ''}
                  onChange={(e) => setNewExtension({...newExtension, months: Number(e.target.value)})}
                  placeholder="Ex: 3"
                  className="h-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-price">Preço (R$)</Label>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-400" />
                <Input
                  id="new-price"
                  type="number"
                  min="0"
                  value={newExtension.price || ''}
                  onChange={(e) => setNewExtension({...newExtension, price: Number(e.target.value)})}
                  placeholder="Ex: 300"
                  className="h-8"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-description">Descrição</Label>
            <Textarea
              id="new-description"
              value={newExtension.description || ''}
              onChange={(e) => setNewExtension({...newExtension, description: e.target.value})}
              placeholder="Descreva os benefícios desta extensão..."
              rows={2}
              className="text-sm"
            />
          </div>

          <Button 
            onClick={handleAddExtension}
            disabled={!newExtension.months || !newExtension.price || !newExtension.description}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Extensão
          </Button>
        </CardContent>
      </Card>

      {extensions.length === 0 && (
        <div className="text-center py-6 text-gray-500">
          <Clock className="h-12 w-12 mx-auto mb-2 text-gray-300" />
          <p className="text-sm">Nenhuma extensão configurada ainda.</p>
          <p className="text-xs">Adicione extensões para oferecer aos alunos.</p>
        </div>
      )}
    </div>
  );
};

export default ExtensionsManager;
