
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Users,
  DollarSign,
  Calendar,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { useMentoring } from '@/hooks/useMentoring';

const AdminMentoringCatalog = () => {
  const { catalogs } = useMentoring();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCatalog, setEditingCatalog] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Individual': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Grupo': return 'bg-green-100 text-green-800 border-green-200';
      case 'Premium': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredCatalogs = catalogs.filter(catalog => {
    const matchesSearch = !searchTerm || 
      catalog.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      catalog.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = !typeFilter || catalog.type === typeFilter;
    const matchesStatus = !statusFilter || 
      (statusFilter === 'active' && catalog.active) ||
      (statusFilter === 'inactive' && !catalog.active);
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleCreateCatalog = (data: any) => {
    console.log('Creating catalog:', data);
    setShowForm(false);
  };

  const handleEditCatalog = (data: any) => {
    console.log('Editing catalog:', data);
    setEditingCatalog(null);
  };

  const handleDeleteCatalog = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta mentoria?')) {
      console.log('Deleting catalog:', id);
    }
  };

  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    console.log(`Toggling status for ${id} to ${!currentStatus}`);
  };

  const CatalogCard = ({ catalog }: { catalog: any }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{catalog.name}</CardTitle>
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getTypeColor(catalog.type)}>
                {catalog.type}
              </Badge>
              <Badge variant={catalog.active ? 'default' : 'secondary'}>
                {catalog.active ? 'Ativo' : 'Inativo'}
              </Badge>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleToggleStatus(catalog.id, catalog.active)}
          >
            {catalog.active ? (
              <ToggleRight className="h-5 w-5 text-green-600" />
            ) : (
              <ToggleLeft className="h-5 w-5 text-gray-400" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-sm text-gray-600 line-clamp-2">{catalog.description}</p>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-400" />
              <span>{catalog.instructor}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-gray-400" />
              <span>R$ {catalog.price.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span>{catalog.durationWeeks} semanas</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-gray-400" />
              <span>{catalog.numberOfSessions} sessões</span>
            </div>
          </div>
          
          <div className="flex gap-1 pt-2">
            <Button variant="ghost" size="sm">
              <Eye className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setEditingCatalog(catalog)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => handleDeleteCatalog(catalog.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Catálogo de Mentorias</h1>
          <p className="text-gray-600 mt-1">Gerencie os produtos de mentoria disponíveis</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Mentoria
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Mentorias</p>
                <p className="text-2xl font-bold text-gray-900">{catalogs.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Mentorias Ativas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {catalogs.filter(c => c.active).length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <ToggleRight className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Valor Médio</p>
                <p className="text-2xl font-bold text-gray-900">
                  R$ {Math.round(catalogs.reduce((acc, c) => acc + c.price, 0) / catalogs.length).toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tipos Diferentes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(catalogs.map(c => c.type)).size}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por nome, instrutor..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os tipos</SelectItem>
                <SelectItem value="Individual">Individual</SelectItem>
                <SelectItem value="Grupo">Grupo</SelectItem>
                <SelectItem value="Premium">Premium</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline"
              onClick={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}
            >
              {viewMode === 'grid' ? 'Tabela' : 'Grade'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Catalog Content */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCatalogs.map((catalog) => (
            <CatalogCard key={catalog.id} catalog={catalog} />
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Mentorias ({filteredCatalogs.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Nome</th>
                    <th className="text-left py-3 px-4 font-medium">Tipo</th>
                    <th className="text-left py-3 px-4 font-medium">Instrutor</th>
                    <th className="text-left py-3 px-4 font-medium">Preço</th>
                    <th className="text-left py-3 px-4 font-medium">Duração</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCatalogs.map((catalog) => (
                    <tr key={catalog.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{catalog.name}</td>
                      <td className="py-3 px-4">
                        <Badge className={getTypeColor(catalog.type)}>
                          {catalog.type}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">{catalog.instructor}</td>
                      <td className="py-3 px-4">R$ {catalog.price.toLocaleString()}</td>
                      <td className="py-3 px-4">{catalog.durationWeeks} sem</td>
                      <td className="py-3 px-4">
                        <Badge variant={catalog.active ? 'default' : 'secondary'}>
                          {catalog.active ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setEditingCatalog(catalog)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteCatalog(catalog.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminMentoringCatalog;
