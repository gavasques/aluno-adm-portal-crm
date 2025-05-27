
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, BookOpen } from 'lucide-react';

interface CatalogHeaderProps {
  onCreateCatalog: () => void;
  totalCatalogs: number;
  activeCatalogs: number;
}

const CatalogHeader: React.FC<CatalogHeaderProps> = ({
  onCreateCatalog,
  totalCatalogs,
  activeCatalogs
}) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white">
            <BookOpen className="h-5 w-5" />
          </div>
          Catálogo de Mentorias
        </h2>
        <p className="text-gray-600">
          Gerencie o catálogo de mentorias disponíveis na plataforma
        </p>
        {totalCatalogs > 0 && (
          <p className="text-sm text-blue-600">
            {totalCatalogs} {totalCatalogs === 1 ? 'mentoria cadastrada' : 'mentorias cadastradas'} • {activeCatalogs} ativas
          </p>
        )}
      </div>
      
      <Button 
        onClick={onCreateCatalog}
        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
      >
        <Plus className="h-4 w-4 mr-2" />
        Nova Mentoria
      </Button>
    </div>
  );
};

export default CatalogHeader;
