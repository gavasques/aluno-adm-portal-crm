
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BreadcrumbNav } from '@/components/ui/breadcrumb-nav';
import { CalendarDays, Plus } from 'lucide-react';

const AdminMentoringSessionsIndividual = () => {
  const breadcrumbItems = [
    { label: 'Admin', href: '/admin' },
    { label: 'Mentorias', href: '/admin/mentorias' },
    { label: 'Sessões Individuais' }
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <BreadcrumbNav items={breadcrumbItems} showBackButton={true} />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sessões Individuais</h1>
          <p className="text-gray-600 mt-1">Gerencie as sessões individuais de mentoria</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Sessão
        </Button>
      </div>

      <Card>
        <CardContent className="p-8 text-center">
          <CalendarDays className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma sessão individual encontrada</h3>
          <p className="text-gray-600 mb-4">
            Comece criando sua primeira sessão individual de mentoria.
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Criar Primeira Sessão
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMentoringSessionsIndividual;
