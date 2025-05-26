
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Clock, DollarSign, Edit, Calculator, Link as LinkIcon, Info } from 'lucide-react';
import { MentoringExtensionOption, CheckoutLinks } from '@/types/mentoring.types';

interface ExtensionsManagerProps {
  extensions: MentoringExtensionOption[];
  onExtensionsChange: (extensions: MentoringExtensionOption[]) => void;
  baseDurationMonths?: number;
  basePrice?: number;
}

const ExtensionsManager: React.FC<ExtensionsManagerProps> = ({
  extensions,
  onExtensionsChange,
  baseDurationMonths = 0,
  basePrice = 0
}) => {
  const [newExtension, setNewExtension] = useState<Partial<MentoringExtensionOption>>({
    months: 1,
    price: basePrice,
    description: '',
    checkoutLinks: {
      mercadoPago: '',
      hubla: '',
      hotmart: ''
    }
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  const calculateTotalDuration = (extensionMonths: number) => {
    return baseDurationMonths + extensionMonths;
  };

  const handleAddExtension = () => {
    if (newExtension.months && newExtension.price !== undefined) {
      const extension: MentoringExtensionOption = {
        id: `ext-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        months: newExtension.months,
        price: newExtension.price,
        description: newExtension.description?.trim() || undefined,
        checkoutLinks: newExtension.checkoutLinks
      };
      
      console.log('➕ Adicionando nova extensão:', extension);
      const updatedExtensions = [...extensions, extension];
      onExtensionsChange(updatedExtensions);
      
      // Resetar formulário
      setNewExtension({ 
        months: 1, 
        price: basePrice, 
        description: '',
        checkoutLinks: {
          mercadoPago: '',
          hubla: '',
          hotmart: ''
        }
      });
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

  const handleUpdateCheckoutLink = (id: string, platform: keyof CheckoutLinks, value: string) => {
    const updatedExtensions = extensions.map(ext => 
      ext.id === id ? { 
        ...ext, 
        checkoutLinks: { 
          ...ext.checkoutLinks, 
          [platform]: value 
        } 
      } : ext
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
                         newExtension.price >= 0;

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
                          +{extension.months} {extension.months === 1 ? 'mês' : 'meses'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calculator className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-green-700">
                          Total: {calculateTotalDuration(extension.months)} {calculateTotalDuration(extension.months) === 1 ? 'mês' : 'meses'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="font-semibold text-green-700">
                          R$ {extension.price.toFixed(2)} (Total)
                        </span>
                      </div>
                    </div>
                    
                    {editingId === extension.id ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label className="text-xs">Extensão (meses)</Label>
                            <Input
                              type="number"
                              min="1"
                              value={extension.months}
                              onChange={(e) => handleUpdateExtension(extension.id, 'months', Number(e.target.value))}
                              className="h-8"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Preço Total (R$)</Label>
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
                          <Label className="text-xs">Descrição (opcional)</Label>
                          <Textarea
                            value={extension.description || ''}
                            onChange={(e) => handleUpdateExtension(extension.id, 'description', e.target.value)}
                            rows={2}
                            className="text-sm"
                            placeholder="Descrição opcional da extensão..."
                          />
                        </div>
                        
                        {/* Links de Checkout */}
                        <div className="space-y-2">
                          <Label className="text-xs font-medium">Links de Checkout</Label>
                          <div className="grid grid-cols-1 gap-2">
                            <div className="flex items-center gap-2">
                              <Label className="text-xs w-20">Mercado Pago:</Label>
                              <Input
                                placeholder="https://..."
                                value={extension.checkoutLinks?.mercadoPago || ''}
                                onChange={(e) => handleUpdateCheckoutLink(extension.id, 'mercadoPago', e.target.value)}
                                className="h-8 text-xs"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <Label className="text-xs w-20">Hubla:</Label>
                              <Input
                                placeholder="https://..."
                                value={extension.checkoutLinks?.hubla || ''}
                                onChange={(e) => handleUpdateCheckoutLink(extension.id, 'hubla', e.target.value)}
                                className="h-8 text-xs"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <Label className="text-xs w-20">Hotmart:</Label>
                              <Input
                                placeholder="https://..."
                                value={extension.checkoutLinks?.hotmart || ''}
                                onChange={(e) => handleUpdateCheckoutLink(extension.id, 'hotmart', e.target.value)}
                                className="h-8 text-xs"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {extension.description && (
                          <div className="text-sm text-gray-600">
                            {extension.description}
                          </div>
                        )}
                        
                        {/* Links de Checkout Existentes */}
                        {(extension.checkoutLinks?.mercadoPago || extension.checkoutLinks?.hubla || extension.checkoutLinks?.hotmart) && (
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <LinkIcon className="h-3 w-3" />
                            <span>Links de checkout configurados</span>
                          </div>
                        )}
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
                Tempo a Adicionar (meses) *
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
              {newExtension.months && baseDurationMonths > 0 && (
                <p className="text-xs text-green-600">
                  <Calculator className="h-3 w-3 inline mr-1" />
                  Total após extensão: {calculateTotalDuration(newExtension.months)} {calculateTotalDuration(newExtension.months) === 1 ? 'mês' : 'meses'}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-price" className="text-sm font-medium">
                Preço Total (R$) *
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
                  placeholder="Ex: 500.00"
                  className="h-9"
                />
              </div>
              <div className="flex items-start gap-1 text-xs text-blue-600">
                <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
                <span>Valor total que o cliente pagará (mentoria + extensão)</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-description" className="text-sm font-medium">
              Descrição (opcional)
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

          {/* Links de Checkout */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Links de Checkout (opcional)</Label>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-2">
                <Label className="text-sm w-24">Mercado Pago:</Label>
                <Input
                  placeholder="https://..."
                  value={newExtension.checkoutLinks?.mercadoPago || ''}
                  onChange={(e) => setNewExtension({
                    ...newExtension, 
                    checkoutLinks: { 
                      ...newExtension.checkoutLinks, 
                      mercadoPago: e.target.value 
                    }
                  })}
                  className="h-9"
                />
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-sm w-24">Hubla:</Label>
                <Input
                  placeholder="https://..."
                  value={newExtension.checkoutLinks?.hubla || ''}
                  onChange={(e) => setNewExtension({
                    ...newExtension, 
                    checkoutLinks: { 
                      ...newExtension.checkoutLinks, 
                      hubla: e.target.value 
                    }
                  })}
                  className="h-9"
                />
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-sm w-24">Hotmart:</Label>
                <Input
                  placeholder="https://..."
                  value={newExtension.checkoutLinks?.hotmart || ''}
                  onChange={(e) => setNewExtension({
                    ...newExtension, 
                    checkoutLinks: { 
                      ...newExtension.checkoutLinks, 
                      hotmart: e.target.value 
                    }
                  })}
                  className="h-9"
                />
              </div>
            </div>
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
              Preencha os campos obrigatórios para adicionar a extensão
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
          {baseDurationMonths > 0 && (
            <p className="text-xs mt-1 text-blue-600">
              Duração base: {baseDurationMonths} {baseDurationMonths === 1 ? 'mês' : 'meses'}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ExtensionsManager;
