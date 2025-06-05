
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Cog } from 'lucide-react';

const SoftwareTypes = () => {
  console.log('SoftwareTypes page component is rendering');

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tipos de Ferramentas</h1>
          <p className="text-gray-600 mt-1">Gerencie os tipos de ferramentas/softwares do sistema</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novo Tipo
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total de Tipos
            </CardTitle>
            <Cog className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-green-600">+3 este mês</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Tipos Ativos
            </CardTitle>
            <Cog className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">13</div>
            <p className="text-xs text-gray-600">87% do total</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Mais Popular
            </CardTitle>
            <Cog className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Produtividade</div>
            <p className="text-xs text-gray-600">45 ferramentas</p>
          </CardContent>
        </Card>
      </div>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Tipos de Ferramentas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Cog className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Módulo de Tipos de Ferramentas
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Este módulo está sendo desenvolvido. Em breve você poderá gerenciar todos os tipos de ferramentas aqui.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Debug Info */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="text-sm">Debug Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-gray-600">
            <p>Componente SoftwareTypes renderizado com sucesso</p>
            <p>Rota: /admin/tipos-softwares</p>
            <p>Timestamp: {new Date().toISOString()}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SoftwareTypes;
