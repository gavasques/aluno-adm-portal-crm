
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, Plus } from 'lucide-react';

interface PermissionsHeaderProps {
  onAdd?: () => void;
}

const PermissionsHeader: React.FC<PermissionsHeaderProps> = ({ onAdd }) => {
  const navigate = useNavigate();

  const handleAddClick = () => {
    if (onAdd) {
      onAdd();
    } else {
      navigate('/admin/permissoes/criar');
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Shield className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sistema de Permissões</h1>
          <p className="text-gray-600">Gerencie grupos de permissão e controle de acesso</p>
        </div>
      </div>
      
      <Button onClick={handleAddClick} className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Novo Grupo
      </Button>
    </div>
  );
};

export default PermissionsHeader;
