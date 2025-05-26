
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Save, X, BookOpen, Plus, User, Users, Calendar, DollarSign, Settings, Edit, Zap, Clock, Target, Link } from 'lucide-react';
import ExtensionsManager from './ExtensionsManager';
import { MentoringExtensionOption } from '@/types/mentoring.types';

interface MentoringCatalog {
  id: string;
  name: string;
  instructor: string;
  durationMonths: number;
  numberOfSessions: number;
  active: boolean;
  type: "Individual" | "Grupo";
  price: number;
  description: string;
  extensions?: MentoringExtensionOption[];
}

interface CatalogEditModalProps {
  catalog: MentoringCatalog | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedCatalog: MentoringCatalog) => void;
}

const CatalogEditModal: React.FC<CatalogEditModalProps> = ({
  catalog,
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<MentoringCatalog | null>(null);

  // Debug logs para verificar renderização
  console.log('🎨 CatalogEditModal renderizado:', { 
    isOpen, 
    catalogId: catalog?.id, 
    catalogName: catalog?.name 
  });

  useEffect(() => {
    console.log('🔄 CatalogEditModal - Effect triggered:', { isOpen, catalog });
    if (catalog) {
      setFormData({ 
        ...catalog,
        extensions: catalog.extensions || []
      });
      console.log('✅ CatalogEditModal - FormData setado:', catalog);
    }
  }, [catalog]);

  const handleInputChange = (field: keyof MentoringCatalog, value: any) => {
    if (formData) {
      setFormData({
        ...formData,
        [field]: value
      });
    }
  };

  const handleExtensionsChange = (extensions: MentoringExtensionOption[]) => {
    if (formData) {
      setFormData({
        ...formData,
        extensions
      });
    }
  };

  const handleSave = () => {
    console.log('💾 CatalogEditModal - Salvando:', formData);
    if (formData) {
      onSave(formData);
      onClose();
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Individual': return 'bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 border-purple-200';
      case 'Grupo': return 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (active: boolean) => {
    return active 
      ? "bg-gradient-to-r from-green-50 to-green-100 text-green-700 border-green-200"
      : "bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 border-gray-200";
  };

  if (!formData) {
    console.log('❌ CatalogEditModal - Sem formData, não renderizando');
    return null;
  }

  console.log('🎯 CatalogEditModal - Renderizando modal completo para:', formData.name);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto bg-white border-0 shadow-2xl">
        <DialogHeader className="pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl text-white shadow-md">
                <Edit className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-gray-900">
                  ✨ Editar Mentoria - DESIGN MODERNO ✨
                </DialogTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge size="sm" className={`text-xs px-2 py-1 border ${getTypeColor(formData.type)}`}>
                    {formData.type === 'Individual' ? (
                      <><User className="h-3 w-3 mr-1" />{formData.type}</>
                    ) : (
                      <><Users className="h-3 w-3 mr-1" />{formData.type}</>
                    )}
                  </Badge>
                  <Badge size="sm" className={`text-xs px-2 py-1 border ${getStatusColor(formData.active)}`}>
                    {formData.active ? 'Ativa' : 'Inativa'}
                  </Badge>
                  {formData.extensions && formData.extensions.length > 0 && (
                    <Badge variant="outline" size="sm" className="text-xs bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-blue-200">
                      <Plus className="h-3 w-3 mr-1" />
                      {formData.extensions.length} extensão(ões)
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-50 p-1 rounded-lg h-12">
            <TabsTrigger 
              value="basic" 
              className="flex items-center gap-2 text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 transition-all duration-200 h-10"
            >
              <Settings className="h-4 w-4" />
              Informações Básicas
            </TabsTrigger>
            <TabsTrigger 
              value="checkout" 
              className="flex items-center gap-2 text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 transition-all duration-200 h-10"
            >
              <Link className="h-4 w-4" />
              Checkout
            </TabsTrigger>
            <TabsTrigger 
              value="extensions" 
              className="flex items-center gap-2 text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 transition-all duration-200 h-10"
            >
              <Zap className="h-4 w-4" />
              Extensões ({formData.extensions?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 mt-6">
            {/* Card de Informações Básicas com design moderno */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 hover:shadow-xl transition-all duration-300 border-l-4 border-l-blue-500">
              <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-purple-50">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-500" />
                  📋 Dados da Mentoria
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <Target className="h-4 w-4 text-gray-500" />
                      Nome da Mentoria *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Nome da mentoria"
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 h-10 text-sm transition-all duration-200 shadow-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="instructor" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <User className="h-4 w-4 text-gray-500" />
                      Mentor *
                    </Label>
                    <Input
                      id="instructor"
                      value={formData.instructor}
                      onChange={(e) => handleInputChange('instructor', e.target.value)}
                      placeholder="Nome do mentor"
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 h-10 text-sm transition-all duration-200 shadow-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <Users className="h-4 w-4 text-gray-500" />
                      Tipo *
                    </Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: "Individual" | "Grupo") => handleInputChange('type', value)}
                    >
                      <SelectTrigger className="border-gray-200 focus:border-blue-500 h-10 text-sm transition-all duration-200 shadow-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-lg">
                        <SelectItem value="Individual">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Individual
                          </div>
                        </SelectItem>
                        <SelectItem value="Grupo">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Grupo
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="durationMonths" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      Duração (meses) *
                    </Label>
                    <Input
                      id="durationMonths"
                      type="number"
                      value={formData.durationMonths}
                      onChange={(e) => handleInputChange('durationMonths', Number(e.target.value))}
                      placeholder="3"
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 h-10 text-sm transition-all duration-200 shadow-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="numberOfSessions" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <Clock className="h-4 w-4 text-gray-500" />
                      Número de Sessões *
                    </Label>
                    <Input
                      id="numberOfSessions"
                      type="number"
                      value={formData.numberOfSessions}
                      onChange={(e) => handleInputChange('numberOfSessions', Number(e.target.value))}
                      placeholder="12"
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 h-10 text-sm transition-all duration-200 shadow-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      Preço (R$) *
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', Number(e.target.value))}
                      placeholder="299"
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 h-10 text-sm transition-all duration-200 shadow-sm"
                    />
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${formData.active ? 'bg-green-500' : 'bg-gray-400'} transition-colors duration-200`}></div>
                    <Label htmlFor="active" className="text-sm font-medium text-gray-700">
                      Status da Mentoria
                    </Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">{formData.active ? 'Ativa' : 'Inativa'}</span>
                    <Switch
                      id="active"
                      checked={formData.active}
                      onCheckedChange={(checked) => handleInputChange('active', checked)}
                      className="data-[state=checked]:bg-green-500"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card de Descrição com design moderno */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 hover:shadow-xl transition-all duration-300 border-l-4 border-l-purple-500">
              <CardHeader className="pb-4 bg-gradient-to-r from-purple-50 to-pink-50">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Edit className="h-5 w-5 text-purple-500" />
                  📝 Descrição da Mentoria
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Descreva os objetivos e conteúdo da mentoria..."
                  rows={4}
                  className="border-gray-200 focus:border-purple-500 focus:ring-purple-500 text-sm resize-none transition-all duration-200 shadow-sm"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="checkout" className="mt-6">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 hover:shadow-xl transition-all duration-300 border-l-4 border-l-green-600">
              <CardHeader className="pb-4 bg-gradient-to-r from-green-100 to-emerald-100">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Link className="h-5 w-5 text-green-600" />
                  🔗 Links de Checkout
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">Configure os links de pagamento para esta mentoria</p>
              </CardHeader>
              <CardContent className="text-center py-8">
                <div className="text-gray-500">
                  <Link className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-sm font-medium">🚧 Funcionalidade em desenvolvimento</p>
                  <p className="text-xs">Em breve você poderá configurar links de checkout</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="extensions" className="mt-6">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-xl transition-all duration-300 border-l-4 border-l-blue-600">
              <CardHeader className="pb-4 bg-gradient-to-r from-blue-100 to-indigo-100">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-600" />
                  ⚡ Gerenciar Extensões
                  {formData.extensions && formData.extensions.length > 0 && (
                    <Badge variant="outline" size="sm" className="ml-2 bg-blue-100 text-blue-700 border-blue-200">
                      {formData.extensions.length} ativa(s)
                    </Badge>
                  )}
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">Configure extensões adicionais para oferecer aos alunos</p>
              </CardHeader>
              <CardContent className="p-6">
                <ExtensionsManager
                  extensions={formData.extensions || []}
                  onExtensionsChange={handleExtensionsChange}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter className="pt-6 border-t border-gray-100 mt-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-b-lg -mx-6 px-6 pb-6">
          <div className="flex gap-3 w-full justify-end">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="bg-white hover:bg-gray-50 border-gray-200 text-gray-700 h-10 px-4 text-sm transition-all duration-200 hover:shadow-sm"
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button 
              onClick={handleSave}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-300 h-10 px-4 text-sm"
            >
              <Save className="h-4 w-4 mr-2" />
              💾 Salvar Alterações
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CatalogEditModal;
