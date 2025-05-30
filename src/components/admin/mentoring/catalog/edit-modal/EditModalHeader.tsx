
import React from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Edit, User, Users, Plus } from 'lucide-react';
import { MentoringCatalog } from '@/types/mentoring.types';

interface EditModalHeaderProps {
  catalog: MentoringCatalog;
}

const EditModalHeader: React.FC<EditModalHeaderProps> = ({ catalog }) => {
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

  return (
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
              <Badge className={`text-xs px-2 py-1 border ${getTypeColor(catalog.type)}`}>
                {catalog.type === 'Individual' ? (
                  <><User className="h-3 w-3 mr-1" />{catalog.type}</>
                ) : (
                  <><Users className="h-3 w-3 mr-1" />{catalog.type}</>
                )}
              </Badge>
              <Badge className={`text-xs px-2 py-1 border ${getStatusColor(catalog.active)}`}>
                {catalog.active ? 'Ativa' : 'Inativa'}
              </Badge>
              {catalog.extensions && catalog.extensions.length > 0 && (
                <Badge variant="outline" className="text-xs bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-blue-200">
                  <Plus className="h-3 w-3 mr-1" />
                  {catalog.extensions.length} extensão(ões)
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    </DialogHeader>
  );
};

export default EditModalHeader;
