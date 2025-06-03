
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminGroups = () => {
  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Grupos</h1>
          <p className="text-gray-600 mt-1">Gerencie grupos de mentoria</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Novo Grupo
        </Button>
      </div>

      <Card>
        <CardContent className="p-8 text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum grupo encontrado</h3>
          <p className="text-gray-600 mb-4">
            Comece criando seu primeiro grupo de mentoria.
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Criar Primeiro Grupo
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminGroups;
