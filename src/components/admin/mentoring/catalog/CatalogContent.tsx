
import React, { useState } from 'react';
import { useMentoring } from '@/hooks/useMentoring';
import CatalogHeader from './CatalogHeader';
import CatalogStatsCards from './CatalogStatsCards';
import CatalogFilters from './CatalogFilters';
import CatalogTable from './CatalogTable';
import EmptyState from '@/components/mentoring/EmptyState';
import LoadingSpinner from '@/components/mentoring/LoadingSpinner';

const CatalogContent: React.FC = () => {
  const { catalogs } = useMentoring();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [editingCatalog, setEditingCatalog] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const filteredCatalogs = catalogs.filter(catalog => {
    const matchesSearch = !searchTerm || 
      catalog.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      catalog.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      catalog.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = !typeFilter || catalog.type === typeFilter;
    const matchesStatus = !statusFilter || 
      (statusFilter === 'active' && catalog.active) ||
      (statusFilter === 'inactive' && !catalog.active);
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleCreateCatalog = () => {
    console.log('Creating new catalog');
  };

  const handleEditCatalog = (catalog: any) => {
    setEditingCatalog(catalog);
    console.log('Editing catalog:', catalog);
  };

  const handleDeleteCatalog = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta mentoria?')) {
      console.log('Deleting catalog:', id);
    }
  };

  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    console.log(`Toggling status for ${id} to ${!currentStatus}`);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setTypeFilter('');
    setStatusFilter('');
  };

  if (loading) {
    return (
      <LoadingSpinner size="lg" message="Carregando catálogo..." />
    );
  }

  return (
    <>
      {/* Header */}
      <CatalogHeader
        onCreateCatalog={handleCreateCatalog}
        totalCatalogs={catalogs.length}
        activeCatalogs={catalogs.filter(c => c.active).length}
      />

      {/* Statistics Cards */}
      <CatalogStatsCards catalogs={catalogs} />

      {/* Filters */}
      <CatalogFilters
        searchTerm={searchTerm}
        typeFilter={typeFilter}
        statusFilter={statusFilter}
        onSearchChange={setSearchTerm}
        onTypeFilterChange={setTypeFilter}
        onStatusFilterChange={setStatusFilter}
        onClearFilters={handleClearFilters}
      />

      {/* Content */}
      {filteredCatalogs.length === 0 ? (
        <EmptyState 
          type="enrollments" 
          title="Nenhuma mentoria encontrada"
          description="Não há mentorias que correspondam aos filtros selecionados. Tente ajustar os critérios de busca."
        />
      ) : (
        <CatalogTable
          catalogs={filteredCatalogs}
          onEdit={handleEditCatalog}
          onDelete={handleDeleteCatalog}
          onToggleStatus={handleToggleStatus}
        />
      )}
    </>
  );
};

export default CatalogContent;
