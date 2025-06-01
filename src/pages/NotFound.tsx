
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();
  
  // Detectar se é uma tentativa de acessar um lead
  const isLeadRoute = location.pathname.includes('/lead/');
  const leadId = isLeadRoute ? location.pathname.split('/lead/')[1] : null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto px-6">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Página não encontrada</h2>
        
        {isLeadRoute && leadId ? (
          <div className="mb-8">
            <p className="text-gray-600 mb-4">
              O lead que você está procurando não foi encontrado ou a URL está incorreta.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Lead ID: {leadId}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/admin/crm">
                <Button variant="outline" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Voltar ao CRM
                </Button>
              </Link>
              <Link to="/admin">
                <Button className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="mb-8">
            <p className="text-gray-600 mb-6">A página que você está procurando não existe.</p>
            <Link to="/admin">
              <Button className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Voltar ao início
              </Button>
            </Link>
          </div>
        )}
        
        <div className="text-xs text-gray-400 mt-8">
          Rota tentada: {location.pathname}
        </div>
      </div>
    </div>
  );
};

export default NotFound;
