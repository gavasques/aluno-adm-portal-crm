
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Book, Users, Settings } from 'lucide-react';

const AdminRegisters = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cadastros do Sistema</h1>
        <p className="text-muted-foreground">
          Gerencie os cadastros básicos e configurações
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Book className="h-5 w-5 mr-2" />
              Cursos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Cursos cadastrados
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Mentorias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              Tipos de mentoria
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Bônus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">
              Bônus disponíveis
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 mr-2" />
              Categorias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25</div>
            <p className="text-xs text-muted-foreground">
              Categorias ativas
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Cadastros Principais</CardTitle>
            <CardDescription>
              Links para os principais cadastros do sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="flex items-center space-x-3">
                <Book className="h-5 w-5 text-blue-600" />
                <span>Cadastro de Cursos</span>
              </div>
              <span className="text-sm text-gray-500">→</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-green-600" />
                <span>Cadastro de Mentorias</span>
              </div>
              <span className="text-sm text-gray-500">→</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="flex items-center space-x-3">
                <Settings className="h-5 w-5 text-purple-600" />
                <span>Cadastro de Bônus</span>
              </div>
              <span className="text-sm text-gray-500">→</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Configurações</CardTitle>
            <CardDescription>
              Configurações auxiliares do sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="flex items-center space-x-3">
                <Database className="h-5 w-5 text-orange-600" />
                <span>Categorias</span>
              </div>
              <span className="text-sm text-gray-500">→</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="flex items-center space-x-3">
                <Settings className="h-5 w-5 text-gray-600" />
                <span>Tipos de Software</span>
              </div>
              <span className="text-sm text-gray-500">→</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-pink-600" />
                <span>Tipos de Parceiro</span>
              </div>
              <span className="text-sm text-gray-500">→</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminRegisters;
