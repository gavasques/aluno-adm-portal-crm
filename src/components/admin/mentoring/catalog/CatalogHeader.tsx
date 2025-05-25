
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/admin/mentorias')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Catálogo de Mentorias</h1>
          <p className="text-gray-600 mt-1">
            {totalCatalogs} mentorias cadastradas • {activeCatalogs} ativas
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Exportar
        </Button>
        
        <Button onClick={onCreateCatalog} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nova Mentoria
        </Button>
      </div>
    </div>
  );
};

export default CatalogHeader;
