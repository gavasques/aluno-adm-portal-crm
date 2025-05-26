
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Calculator } from 'lucide-react';
import { MentoringExtensionOption } from '@/types/mentoring.types';
import { calculateSessionsFromFrequency } from '@/utils/mentoringCalculations';

interface ExtensionsManagerProps {
  extensions: MentoringExtensionOption[];
  onExtensionsChange: (extensions: MentoringExtensionOption[]) => void;
  baseDurationMonths: number;
  basePrice: number;
  frequency?: 'Semanal' | 'Quinzenal' | 'Mensal';
}

const ExtensionsManager: React.FC<ExtensionsManagerProps> = ({
  extensions,
  onExtensionsChange,
  baseDurationMonths,
  basePrice,
  frequency = 'Semanal'
}) => {
  const [localExtensions, setLocalExtensions] = useState<MentoringExtensionOption[]>(extensions);

  useEffect(() => {
    setLocalExtensions(extensions);
  }, [extensions]);

  const addExtension = () => {
    const defaultMonths = 3;
    const calculatedSessions = calculateSessionsFromFrequency(defaultMonths, frequency);
    
    const newExtension: MentoringExtensionOption = {
      id: `temp-${Date.now()}`,
      months: defaultMonths,
      price: basePrice * 0.3,
      totalSessions: calculatedSessions,
      description: `Extensão de ${defaultMonths} meses`,
      checkoutLinks: {
        mercadoPago: '',
        hubla: '',
        hotmart: ''
      }
    };

    const updatedExtensions = [...localExtensions, newExtension];
    setLocalExtensions(updatedExtensions);
    onExtensionsChange(updatedExtensions);
  };

  const updateExtension = (index: number, field: keyof MentoringExtensionOption, value: any) => {
    const updatedExtensions = [...localExtensions];
    
    if (field === 'months') {
      // Recalcular sessões quando os meses mudarem
      const calculatedSessions = calculateSessionsFromFrequency(Number(value), frequency);
      updatedExtensions[index] = {
        ...updatedExtensions[index],
        [field]: Number(value),
        totalSessions: calculatedSessions
      };
    } else {
      updatedExtensions[index] = {
        ...updatedExtensions[index],
        [field]: value
      };
    }
    
    setLocalExtensions(updatedExtensions);
    onExtensionsChange(updatedExtensions);
  };

  const removeExtension = (index: number) => {
    const updatedExtensions = localExtensions.filter((_, i) => i !== index);
    setLocalExtensions(updatedExtensions);
    onExtensionsChange(updatedExtensions);
  };

  const updateCheckoutLink = (extensionIndex: number, platform: string, value: string) => {
    const updatedExtensions = [...localExtensions];
    updatedExtensions[extensionIndex] = {
      ...updatedExtensions[extensionIndex],
      checkoutLinks: {
        ...updatedExtensions[extensionIndex].checkoutLinks,
        [platform]: value
      }
    };
    setLocalExtensions(updatedExtensions);
    onExtensionsChange(updatedExtensions);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="font-medium">Extensões Disponíveis</h4>
          <p className="text-sm text-gray-500">
            Configure opções de extensão com cálculo automático de sessões
          </p>
          {frequency && (
            <p className="text-xs text-blue-600 mt-1">
              Periodicidade base: {frequency}
            </p>
          )}
        </div>
        <Button onClick={addExtension} size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Adicionar Extensão
        </Button>
      </div>

      {localExtensions.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <div className="text-gray-500">
            <Calculator className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="font-medium">Nenhuma extensão configurada</p>
            <p className="text-sm">Adicione opções de extensão para esta mentoria</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {localExtensions.map((extension, index) => (
            <Card key={extension.id} className="border border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-base">
                  <span className="flex items-center gap-2">
                    <Calculator className="h-4 w-4" />
                    Extensão #{index + 1}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeExtension(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Duração (meses)</Label>
                    <Input
                      type="number"
                      min="1"
                      max="12"
                      value={extension.months}
                      onChange={(e) => updateExtension(index, 'months', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Calculator className="h-3 w-3" />
                      Sessões Calculadas
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        value={extension.totalSessions || 0}
                        disabled
                        className="bg-gray-50"
                      />
                      <span className="text-xs text-gray-500">auto</span>
                    </div>
                    <p className="text-xs text-blue-600">
                      {extension.months} meses × {frequency?.toLowerCase()}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Preço (R$)</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={extension.price}
                      onChange={(e) => updateExtension(index, 'price', Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Descrição</Label>
                  <Textarea
                    value={extension.description || ''}
                    onChange={(e) => updateExtension(index, 'description', e.target.value)}
                    placeholder="Descrição da extensão..."
                    className="min-h-16"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">Links de Checkout da Extensão</Label>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-600">Mercado Pago</Label>
                      <Input
                        placeholder="https://..."
                        value={extension.checkoutLinks?.mercadoPago || ''}
                        onChange={(e) => updateCheckoutLink(index, 'mercadoPago', e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-600">Hubla</Label>
                      <Input
                        placeholder="https://..."
                        value={extension.checkoutLinks?.hubla || ''}
                        onChange={(e) => updateCheckoutLink(index, 'hubla', e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-600">Hotmart</Label>
                      <Input
                        placeholder="https://..."
                        value={extension.checkoutLinks?.hotmart || ''}
                        onChange={(e) => updateCheckoutLink(index, 'hotmart', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Resumo da extensão */}
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">Total da extensão:</span> {extension.months} meses, {extension.totalSessions} sessões por R$ {extension.price?.toFixed(2)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExtensionsManager;
