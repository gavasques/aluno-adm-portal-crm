
import React, { useEffect, useState } from 'react';
import { useMentoringContext } from '../../contexts/MentoringContext';
import { useMentoringOperations } from '../../hooks/useMentoringOperations';
import { useMentoringFilters } from '../../hooks/useMentoringFilters';
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BreadcrumbNav } from '@/components/ui/breadcrumb-nav';
import { MentoringLoadingState } from '../../shared/components/LoadingState';
import CatalogFormDialog from '@/components/admin/mentoring/catalog/CatalogFormDialog';
import { useMentoringCatalog } from '@/hooks/mentoring/useMentoringCatalog';
import { 
  BookOpen, 
  Plus, 
  Users, 
  Search, 
  Filter,
  Star,
  TrendingUp,
  Award,
  Zap,
  Target
} from 'lucide-react';
import { MentoringCatalog, CreateMentoringCatalogData } from '@/types/mentoring.types';

export const CatalogManagement: React.FC = () => {
  const { state } = useMentoringContext();
  const { loading } = useMentoringOperations();
  const { filteredCatalogs, filters, setFilters, clearFilters } = useMentoringFilters();
  const { searchTerm, debouncedSearchTerm, setSearchTerm } = useDebouncedSearch();
  const { createCatalog, loading: catalogLoading } = useMentoringCatalog();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Update filters when search term changes
  useEffect(() => {
    setFilters({ search: debouncedSearchTerm });
  }, [debouncedSearchTerm, setFilters]);

  const stats = {
    total: state.catalogs.length,
    active: state.catalogs.filter(c => c.active).length,
    individual: state.catalogs.filter(c => c.type === 'Individual').length,
    group: state.catalogs.filter(c => c.type === 'Grupo').length
  };

  const handleCreateCatalog = () => {
    setShowCreateDialog(true);
  };

  const handleSubmitCatalog = async (data: CreateMentoringCatalogData): Promise<void> => {
    try {
      await createCatalog(data);
      setShowCreateDialog(false);
    } catch (error) {
      console.error('Erro ao criar mentoria:', error);
      throw error;
    }
  };

  const handleViewCatalog = (catalog: MentoringCatalog) => {
    console.log('View catalog:', catalog.id);
  };

  const handleTypeFilter = (value: string) => {
    setFilters({ type: value || undefined });
  };

  const handleStatusFilter = (value: string) => {
    setFilters({ status: value || undefined });
  };

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Mentorias', href: '/admin/mentorias' },
    { label: 'Catálogo' }
  ];

  if (loading) {
    return <MentoringLoadingState variant="card" count={6} message="Carregando catálogo de mentorias..." />;
  }

  return (
    <>
      <div className="space-y-4 lg:space-y-6">
        {/* Breadcrumb Navigation */}
        <BreadcrumbNav 
          items={breadcrumbItems} 
          showBackButton={true}
          backHref="/admin/mentorias"
          className="mb-4"
        />

        {/* Header compacto */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="space-y-1">
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <div className="p-1.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white">
                <BookOpen className="h-4 w-4 lg:h-5 w-5" />
              </div>
              Catálogo de Mentorias
            </h2>
            <p className="text-gray-600 text-xs lg:text-sm">Gerencie o catálogo de mentorias disponíveis</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3" />
              <Input
                placeholder="Buscar mentorias..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-full sm:w-56 h-8 border border-gray-200 focus:border-blue-500 rounded-lg text-sm"
              />
            </div>
            <Button 
              onClick={handleCreateCatalog}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 py-1 h-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-sm"
            >
              <Plus className="h-3 w-3 mr-1" />
              Nova Mentoria
            </Button>
          </div>
        </div>

        {/* Stats Cards compactos */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 lg:gap-3">
          <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-md transition-all duration-300">
            <CardContent className="p-2 lg:p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-blue-600 mb-1">Total</p>
                  <p className="text-lg lg:text-xl font-bold text-blue-900">{stats.total}</p>
                  <div className="flex items-center mt-1">
                    <Award className="h-2 w-2 text-blue-500 mr-1" />
                    <span className="text-xs text-blue-600">mentorias</span>
                  </div>
                </div>
                <div className="p-1.5 lg:p-2 bg-blue-500 rounded-lg">
                  <BookOpen className="h-3 w-3 lg:h-4 w-4 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100 hover:shadow-md transition-all duration-300">
            <CardContent className="p-2 lg:p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-green-600 mb-1">Ativas</p>
                  <p className="text-lg lg:text-xl font-bold text-green-900">{stats.active}</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-2 w-2 text-green-500 mr-1" />
                    <span className="text-xs text-green-600">disponíveis</span>
                  </div>
                </div>
                <div className="p-1.5 lg:p-2 bg-green-500 rounded-lg">
                  <Zap className="h-3 w-3 lg:h-4 w-4 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-md transition-all duration-300">
            <CardContent className="p-2 lg:p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-purple-600 mb-1">Individual</p>
                  <p className="text-lg lg:text-xl font-bold text-purple-900">{stats.individual}</p>
                  <div className="flex items-center mt-1">
                    <Target className="h-2 w-2 text-purple-500 mr-1" />
                    <span className="text-xs text-purple-600">1:1</span>
                  </div>
                </div>
                <div className="p-1.5 lg:p-2 bg-purple-500 rounded-lg">
                  <Users className="h-3 w-3 lg:h-4 w-4 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-yellow-50 to-yellow-100 hover:shadow-md transition-all duration-300">
            <CardContent className="p-2 lg:p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-yellow-600 mb-1">Grupo</p>
                  <p className="text-lg lg:text-xl font-bold text-yellow-900">{stats.group}</p>
                  <div className="flex items-center mt-1">
                    <Star className="h-2 w-2 text-yellow-500 mr-1" />
                    <span className="text-xs text-yellow-600">turmas</span>
                  </div>
                </div>
                <div className="p-1.5 lg:p-2 bg-yellow-500 rounded-lg">
                  <Users className="h-3 w-3 lg:h-4 w-4 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros compactos */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <div className="p-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white">
                <Filter className="h-3 w-3" />
              </div>
              Filtros e Ordenação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Select value={filters.type || ""} onValueChange={handleTypeFilter}>
                <SelectTrigger className="h-8 border border-gray-200 focus:border-blue-500 rounded-lg text-sm">
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os tipos</SelectItem>
                  <SelectItem value="Individual">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      Individual
                    </div>
                  </SelectItem>
                  <SelectItem value="Grupo">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      Grupo
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.status || ""} onValueChange={handleStatusFilter}>
                <SelectTrigger className="h-8 border border-gray-200 focus:border-blue-500 rounded-lg text-sm">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os status</SelectItem>
                  <SelectItem value="active">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Ativas
                    </div>
                  </SelectItem>
                  <SelectItem value="inactive">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                      Inativas
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-1">
                <Button 
                  variant={viewMode === 'grid' ? 'default' : 'outline'} 
                  onClick={() => setViewMode('grid')}
                  className="flex-1 h-8 rounded-lg text-xs"
                >
                  Grid
                </Button>
                <Button 
                  variant={viewMode === 'list' ? 'default' : 'outline'} 
                  onClick={() => setViewMode('list')}
                  className="flex-1 h-8 rounded-lg text-xs"
                >
                  Lista
                </Button>
              </div>

              {Object.keys(filters).length > 0 && (
                <Button 
                  variant="outline" 
                  onClick={clearFilters}
                  className="h-8 border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-lg text-xs"
                >
                  Limpar Filtros
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Catalog List compacto */}
        <div className={`grid gap-3 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {filteredCatalogs.map((catalog) => (
            <Card
              key={catalog.id}
              className="border-0 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group overflow-hidden"
              onClick={() => handleViewCatalog(catalog)}
            >
              <div className={`h-1 bg-gradient-to-r ${
                catalog.type === 'Individual' 
                  ? 'from-purple-500 to-purple-600' 
                  : 'from-yellow-500 to-yellow-600'
              }`} />
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${
                      catalog.type === 'Individual' 
                        ? 'bg-purple-100 text-purple-600' 
                        : 'bg-yellow-100 text-yellow-600'
                    } group-hover:scale-105 transition-transform duration-300`}>
                      <Users className="h-3 w-3" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                        {catalog.name}
                      </h3>
                      <p className="text-gray-600 text-xs mt-1">por {catalog.instructor}</p>
                    </div>
                  </div>
                  <Badge 
                    className={`${
                      catalog.active 
                        ? 'bg-green-100 text-green-700 border-green-200' 
                        : 'bg-gray-100 text-gray-700 border-gray-200'
                    } border text-xs`}
                  >
                    {catalog.active ? 'Ativa' : 'Inativa'}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 text-xs">Tipo:</span>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          catalog.type === 'Individual' 
                            ? 'border-purple-200 text-purple-700 bg-purple-50' 
                            : 'border-yellow-200 text-yellow-700 bg-yellow-50'
                        }`}
                      >
                        {catalog.type}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 text-xs">Duração:</span>
                      <span className="font-medium text-xs">{catalog.durationWeeks} sem</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 text-xs">Sessões:</span>
                      <span className="font-medium text-xs">{catalog.numberOfSessions}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 text-xs">Preço:</span>
                      <span className="font-bold text-green-600 text-xs">R$ {catalog.price.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-gray-700 text-xs line-clamp-2">{catalog.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Estado Vazio compacto */}
        {filteredCatalogs.length === 0 && (
          <Card className="border-0 shadow-sm">
            <CardContent className="py-8 text-center">
              <div className="p-3 bg-gray-100 rounded-xl inline-block mb-3">
                <BookOpen className="h-8 w-8 text-gray-400 mx-auto" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Nenhuma mentoria encontrada
              </h3>
              <p className="text-gray-600 mb-4 max-w-md mx-auto text-sm">
                {Object.keys(filters).length > 0 
                  ? 'Ajuste os filtros para encontrar mentorias ou crie uma nova'
                  : 'Crie sua primeira mentoria para começar'
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                {Object.keys(filters).length > 0 && (
                  <Button 
                    variant="outline" 
                    onClick={clearFilters}
                    className="px-3 py-1 border border-blue-200 text-blue-600 hover:bg-blue-50 rounded-lg text-sm"
                  >
                    Limpar Filtros
                  </Button>
                )}
                <Button 
                  onClick={handleCreateCatalog}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-1 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-sm"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Nova Mentoria
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create Catalog Dialog */}
      <CatalogFormDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        catalog={null}
        onSubmit={handleSubmitCatalog}
        isLoading={catalogLoading}
      />
    </>
  );
};
