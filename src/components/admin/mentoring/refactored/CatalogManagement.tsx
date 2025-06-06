
import React, { useState } from 'react';
import { useRefactoredMentoring } from '@/hooks/mentoring/useRefactoredMentoring';
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { StatsCard } from '@/components/mentoring/shared/StatsCard';
import { MentoringCard } from '@/components/mentoring/shared/MentoringCard';
import { BookOpen, Plus, Users, Clock, Search } from 'lucide-react';
import { MentoringCatalog } from '@/types/mentoring.types';

export const CatalogManagement: React.FC = () => {
  const { catalogs, loading } = useRefactoredMentoring();
  const { searchTerm, debouncedSearchTerm, setSearchTerm } = useDebouncedSearch();
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredCatalogs = catalogs.filter(catalog => {
    const matchesSearch = !debouncedSearchTerm || 
      catalog.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      catalog.instructor.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    
    const matchesType = !typeFilter || catalog.type === typeFilter;
    const matchesStatus = !statusFilter || 
      (statusFilter === 'active' && catalog.active) ||
      (statusFilter === 'inactive' && !catalog.active);
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = {
    total: catalogs.length,
    active: catalogs.filter(c => c.active).length,
    individual: catalogs.filter(c => c.type === 'Individual').length,
    group: catalogs.filter(c => c.type === 'Grupo').length
  };

  const handleCreateCatalog = () => {
    // Navigate to create form
    console.log('Navigate to create catalog');
  };

  const handleViewCatalog = (catalog: MentoringCatalog) => {
    console.log('View catalog:', catalog.id);
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Catálogo de Mentorias</h2>
          <p className="text-gray-600">Gerencie o catálogo de mentorias disponíveis</p>
        </div>
        <Button onClick={handleCreateCatalog}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Mentoria
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard title="Total" value={stats.total} icon={BookOpen} color="blue" />
        <StatsCard title="Ativas" value={stats.active} icon={Clock} color="green" />
        <StatsCard title="Individual" value={stats.individual} icon={Users} color="purple" />
        <StatsCard title="Grupo" value={stats.group} icon={Users} color="yellow" />
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar mentorias..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os tipos</SelectItem>
                <SelectItem value="Individual">Individual</SelectItem>
                <SelectItem value="Grupo">Grupo</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os status</SelectItem>
                <SelectItem value="active">Ativas</SelectItem>
                <SelectItem value="inactive">Inativas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Catalog List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCatalogs.map((catalog) => (
          <MentoringCard
            key={catalog.id}
            title={catalog.name}
            status={catalog.active ? 'ativa' : 'inativa'}
            mentor={catalog.instructor}
            onClick={() => handleViewCatalog(catalog)}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Tipo:</span>
                <Badge variant="outline">{catalog.type}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Duração:</span>
                <span>{catalog.durationMonths} {catalog.durationMonths === 1 ? 'mês' : 'meses'}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Sessões:</span>
                <span>{catalog.numberOfSessions}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Preço:</span>
                <span>R$ {catalog.price.toFixed(2)}</span>
              </div>
            </div>
          </MentoringCard>
        ))}
      </div>

      {filteredCatalogs.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma mentoria encontrada
            </h3>
            <p className="text-gray-500">
              Ajuste os filtros ou crie uma nova mentoria
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
