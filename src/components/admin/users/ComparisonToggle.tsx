
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Users, ArrowRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export const ComparisonToggle: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isUnified = location.pathname === '/admin/usuarios-unificado';
  
  const toggleVersion = () => {
    if (isUnified) {
      navigate('/admin/usuarios');
    } else {
      navigate('/admin/usuarios-unificado');
    }
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-center gap-2">
        {isUnified ? (
          <Zap className="h-4 w-4 text-green-600" />
        ) : (
          <Users className="h-4 w-4 text-blue-600" />
        )}
        <span className="text-sm font-medium">
          {isUnified ? 'Versão Unificada' : 'Versão Atual'}
        </span>
        <Badge variant={isUnified ? 'default' : 'secondary'} className="text-xs">
          {isUnified ? 'NOVO' : 'LEGADO'}
        </Badge>
      </div>
      
      <ArrowRight className="h-4 w-4 text-gray-400" />
      
      <Button 
        onClick={toggleVersion} 
        variant="outline" 
        size="sm"
        className="text-xs"
      >
        {isUnified ? 'Ver Versão Atual' : 'Testar Nova Versão'}
      </Button>
      
      {!isUnified && (
        <span className="text-xs text-gray-600">
          Compare as funcionalidades entre as versões
        </span>
      )}
    </div>
  );
};
