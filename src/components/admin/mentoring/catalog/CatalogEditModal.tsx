
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Link, Zap } from 'lucide-react';
import { MentoringCatalog, MentoringExtensionOption } from '@/types/mentoring.types';
import EditModalHeader from './edit-modal/EditModalHeader';
import BasicInfoTab from './edit-modal/BasicInfoTab';
import CheckoutTab from './edit-modal/CheckoutTab';
import ExtensionsTab from './edit-modal/ExtensionsTab';
import EditModalFooter from './edit-modal/EditModalFooter';

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

  console.log('🎨 CatalogEditModal renderizado:', { 
    isOpen, 
    catalogId: catalog?.id, 
    catalogName: catalog?.name 
  });

  useEffect(() => {
    console.log('🔄 CatalogEditModal - Effect triggered:', { isOpen, catalog });
    if (catalog) {
      // Garantir que todas as propriedades obrigatórias estejam presentes
      const completeFormData: MentoringCatalog = {
        ...catalog,
        extensions: catalog.extensions || [],
        totalSessions: catalog.totalSessions || catalog.numberOfSessions,
        tags: catalog.tags || [],
        status: catalog.status || 'Ativa',
        createdAt: catalog.createdAt || new Date().toISOString(),
        updatedAt: catalog.updatedAt || new Date().toISOString()
      };
      setFormData(completeFormData);
      console.log('✅ CatalogEditModal - FormData setado:', completeFormData);
    }
  }, [catalog]);

  const handleInputChange = (field: keyof MentoringCatalog, value: any) => {
    if (formData) {
      setFormData({
        ...formData,
        [field]: value,
        updatedAt: new Date().toISOString()
      });
    }
  };

  const handleExtensionsChange = (extensions: MentoringExtensionOption[]) => {
    if (formData) {
      setFormData({
        ...formData,
        extensions,
        updatedAt: new Date().toISOString()
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

  if (!formData) {
    console.log('❌ CatalogEditModal - Sem formData, não renderizando');
    return null;
  }

  console.log('🎯 CatalogEditModal - Renderizando modal completo para:', formData.name);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto bg-white border-0 shadow-2xl">
        <EditModalHeader catalog={formData} />

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
            <BasicInfoTab formData={formData} onInputChange={handleInputChange} />
          </TabsContent>

          <TabsContent value="checkout" className="mt-6">
            <CheckoutTab />
          </TabsContent>

          <TabsContent value="extensions" className="mt-6">
            <ExtensionsTab 
              extensions={formData.extensions || []}
              onExtensionsChange={handleExtensionsChange}
            />
          </TabsContent>
        </Tabs>

        <EditModalFooter onSave={handleSave} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
};

export default CatalogEditModal;
