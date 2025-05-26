
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BreadcrumbNav } from '@/components/ui/breadcrumb-nav';
import { BookOpen, Plus, Search } from 'lucide-react';

interface CatalogHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onCreateCatalog: () => void;
  loading: boolean;
}

export const CatalogHeader: React.FC<CatalogHeaderProps> = ({
  searchTerm,
  onSearchChange,
  onCreateCatalog,
  loading
}) => {
  const breadcrumbItems = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Mentorias', href: '/admin/mentorias' },
    { label: 'Catálogo' }
  ];

  return (
    <>
      {/* Breadcrumb Navigation */}
      <BreadcrumbNav 
        items={breadcrumbItems} 
        showBackButton={true}
        backHref="/admin/mentorias"
        className="mb-4"
      />

      {/* Header compacto */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white">
              <BookOpen className="h-4 w-4 lg:h-5 w-5" />
            </div>
            Catálogo de Mentorias
          </h2>
          <p className="text-gray-600 text-xs lg:text-sm">Gerencie o catálogo de mentorias disponíveis</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3" />
            <Input
              placeholder="Buscar mentorias..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-8 w-full sm:w-56 h-8 border border-gray-200 focus:border-blue-500 rounded-lg text-sm"
            />
          </div>
          <Button 
            onClick={onCreateCatalog}
            disabled={loading}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 py-1 h-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-sm"
          >
            <Plus className="h-3 w-3 mr-1" />
            Nova Mentoria
          </Button>
        </div>
      </div>
    </>
  );
};
