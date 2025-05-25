
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
import { StatsCard } from '@/components/mentoring/shared/StatsCard';
import { MentoringCard } from '@/components/mentoring/shared/MentoringCard';
import { MentoringLoadingState } from '../../shared/components/LoadingState';
import { 
  BookOpen, 
  Plus, 
  Users, 
  Clock, 
  Search, 
  Filter,
  Star,
  TrendingUp,
  Award,
  Zap,
  Target
} from 'lucide-react';
import { MentoringCatalog } from '@/types/mentoring.types';

export const CatalogManagement: React.FC = () => {
  const { state } = useMentoringContext();
  const { loading } = useMentoringOperations();
  const { filteredCatalogs, filters, setFilters, clearFilters } = useMentoringFilters();
  const { searchTerm, debouncedSearchTerm, setSearchTerm } = useDebouncedSearch();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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
    console.log('Navigate to create catalog');
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

  if (loading) {
    return <MentoringLoadingState variant="card" count={6} message="Carregando catálogo de mentorias..." />;
  }

  return (
    <div className="space-y-8">
      {/* Header Moderno */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-3">
          <h2 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white">
              <BookOpen className="h-8 w-8" />
            </div>
            Catálogo de Mentorias
          </h2>
          <p className="text-gray-600 text-lg">Gerencie o catálogo de mentorias disponíveis</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Buscar mentorias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-80 h-12 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-xl"
            />
          </div>
          <Button 
            onClick={handleCreateCatalog}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 h-12 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nova Mentoria
          </Button>
        </div>
      </div>

      {/* Stats Cards Melhorados */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 mb-1">Total</p>
                <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
                <div className="flex items-center mt-2">
                  <Award className="h-4 w-4 text-blue-500 mr-1" />
                  <span className="text-sm text-blue-600">mentorias</span>
                </div>
              </div>
              <div className="p-4 bg-blue-500 rounded-2xl">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 mb-1">Ativas</p>
                <p className="text-3xl font-bold text-green-900">{stats.active}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">disponíveis</span>
                </div>
              </div>
              <div className="p-4 bg-green-500 rounded-2xl">
                <Zap className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 mb-1">Individual</p>
                <p className="text-3xl font-bold text-purple-900">{stats.individual}</p>
                <div className="flex items-center mt-2">
                  <Target className="h-4 w-4 text-purple-500 mr-1" />
                  <span className="text-sm text-purple-600">1:1</span>
                </div>
              </div>
              <div className="p-4 bg-purple-500 rounded-2xl">
                <Users className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600 mb-1">Grupo</p>
                <p className="text-3xl font-bold text-yellow-900">{stats.group}</p>
                <div className="flex items-center mt-2">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="text-sm text-yellow-600">turmas</span>
                </div>
              </div>
              <div className="p-4 bg-yellow-500 rounded-2xl">
                <Users className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros Aprimorados */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white">
              <Filter className="h-5 w-5" />
            </div>
            Filtros e Ordenação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={filters.type || ""} onValueChange={handleTypeFilter}>
              <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl">
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
              <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl">
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

            <div className="flex gap-2">
              <Button 
                variant={viewMode === 'grid' ? 'default' : 'outline'} 
                onClick={() => setViewMode('grid')}
                className="flex-1 h-12 rounded-xl"
              >
                Grid
              </Button>
              <Button 
                variant={viewMode === 'list' ? 'default' : 'outline'} 
                onClick={() => setViewMode('list')}
                className="flex-1 h-12 rounded-xl"
              >
                Lista
              </Button>
            </div>

            {Object.keys(filters).length > 0 && (
              <Button 
                variant="outline" 
                onClick={clearFilters}
                className="h-12 border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-xl"
              >
                Limpar Filtros
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Catalog List com Cards Melhorados */}
      <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
        {filteredCatalogs.map((catalog) => (
          <Card
            key={catalog.id}
            className="border-0 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer group overflow-hidden"
            onClick={() => handleViewCatalog(catalog)}
          >
            <div className={`h-2 bg-gradient-to-r ${
              catalog.type === 'Individual' 
                ? 'from-purple-500 to-purple-600' 
                : 'from-yellow-500 to-yellow-600'
            }`} />
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-2xl ${
                    catalog.type === 'Individual' 
                      ? 'bg-purple-100 text-purple-600' 
                      : 'bg-yellow-100 text-yellow-600'
                  } group-hover:scale-110 transition-transform duration-300`}>
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                      {catalog.name}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">por {catalog.instructor}</p>
                  </div>
                </div>
                <Badge 
                  className={`${
                    catalog.active 
                      ? 'bg-green-100 text-green-700 border-green-200' 
                      : 'bg-gray-100 text-gray-700 border-gray-200'
                  } border-2`}
                >
                  {catalog.active ? 'Ativa' : 'Inativa'}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Tipo:</span>
                    <Badge 
                      variant="outline" 
                      className={`${
                        catalog.type === 'Individual' 
                          ? 'border-purple-200 text-purple-700 bg-purple-50' 
                          : 'border-yellow-200 text-yellow-700 bg-yellow-50'
                      }`}
                    >
                      {catalog.type}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Duração:</span>
                    <span className="font-medium">{catalog.durationWeeks} sem</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Sessões:</span>
                    <span className="font-medium">{catalog.numberOfSessions}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Preço:</span>
                    <span className="font-bold text-green-600">R$ {catalog.price.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-gray-700 text-sm line-clamp-2">{catalog.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Estado Vazio Melhorado */}
      {filteredCatalogs.length === 0 && (
        <Card className="border-0 shadow-lg">
          <CardContent className="py-16 text-center">
            <div className="p-6 bg-gray-100 rounded-3xl inline-block mb-6">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Nenhuma mentoria encontrada
            </h3>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              {Object.keys(filters).length > 0 
                ? 'Ajuste os filtros para encontrar mentorias ou crie uma nova mentoria para começar'
                : 'Crie sua primeira mentoria para começar a ajudar seus alunos'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {Object.keys(filters).length > 0 && (
                <Button 
                  variant="outline" 
                  onClick={clearFilters}
                  className="px-6 py-3 border-2 border-blue-200 text-blue-600 hover:bg-blue-50 rounded-xl"
                >
                  Limpar Filtros
                </Button>
              )}
              <Button 
                onClick={handleCreateCatalog}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Plus className="h-5 w-5 mr-2" />
                Nova Mentoria
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
