import React, { useState } from 'react';
import { useSupabaseMentoringCatalog } from '@/hooks/mentoring/useSupabaseMentoringCatalog';
import CatalogHeader from './CatalogHeader';
import CatalogStatsCards from './CatalogStatsCards';
import CatalogFilters from './CatalogFilters';
import CatalogTable from './CatalogTable';
import CatalogDetailDialog from './CatalogDetailDialog';
import CatalogFormDialog from './CatalogFormDialog';
import EmptyState from '@/components/mentoring/EmptyState';
import LoadingSpinner from '@/components/mentoring/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { MentoringCatalog, CreateMentoringCatalogData } from '@/types/mentoring.types';

const CatalogContent: React.FC = () => {
  const { catalogs, createCatalog, updateCatalog, deleteCatalog, loading } = useSupabaseMentoringCatalog();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Dialog states
  const [detailDialog, setDetailDialog] = useState<{
    open: boolean;
    catalog: MentoringCatalog | null;
  }>({ open: false, catalog: null });

  const [formDialog, setFormDialog] = useState<{
    open: boolean;
    catalog: MentoringCatalog | null;
  }>({ open: false, catalog: null });

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
    setFormDialog({ open: true, catalog: null });
  };

  const handleViewCatalog = (catalog: MentoringCatalog) => {
    setDetailDialog({ open: true, catalog });
  };

  const handleEditCatalog = (catalog: MentoringCatalog) => {
    setFormDialog({ open: true, catalog });
  };

  const handleDeleteCatalog = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta mentoria?')) {
      return;
    }

    try {
      await deleteCatalog(id);
    } catch (error) {
      console.error('Erro ao excluir mentoria:', error);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await updateCatalog(id, { active: !currentStatus });
    } catch (error) {
      console.error('Erro ao alterar status:', error);
    }
  };

  const handleFormSubmit = async (data: CreateMentoringCatalogData) => {
    try {
      if (formDialog.catalog) {
        await updateCatalog(formDialog.catalog.id, data);
      } else {
        await createCatalog(data);
      }
      setFormDialog({ open: false, catalog: null });
    } catch (error) {
      console.error('Erro ao salvar mentoria:', error);
      throw error;
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setTypeFilter('');
    setStatusFilter('');
  };

  if (loading && catalogs.length === 0) {
    return (
      <LoadingSpinner size="lg" message="Carregando catálogo..." />
    );
  }

  return (
    <>
      <CatalogHeader
        onCreateCatalog={handleCreateCatalog}
        totalCatalogs={catalogs.length}
        activeCatalogs={catalogs.filter(c => c.active).length}
      />

      <CatalogStatsCards catalogs={catalogs} />

      <CatalogFilters
        searchTerm={searchTerm}
        typeFilter={typeFilter}
        statusFilter={statusFilter}
        onSearchChange={setSearchTerm}
        onTypeFilterChange={setTypeFilter}
        onStatusFilterChange={setStatusFilter}
        onClearFilters={handleClearFilters}
      />

      {filteredCatalogs.length === 0 ? (
        <EmptyState 
          type="enrollments" 
          title="Nenhuma mentoria encontrada"
          description="Não há mentorias que correspondam aos filtros selecionados. Tente ajustar os critérios de busca."
        />
      ) : (
        <CatalogTable
          catalogs={filteredCatalogs}
          onView={handleViewCatalog}
          onEdit={handleEditCatalog}
          onDelete={handleDeleteCatalog}
          onToggleStatus={handleToggleStatus}
        />
      )}

      <CatalogDetailDialog
        open={detailDialog.open}
        onOpenChange={(open) => setDetailDialog({ open, catalog: null })}
        catalog={detailDialog.catalog}
        onEdit={handleEditCatalog}
      />

      <CatalogFormDialog
        open={formDialog.open}
        onOpenChange={(open) => setFormDialog({ open, catalog: null })}
        catalog={formDialog.catalog}
        onSubmit={handleFormSubmit}
        isLoading={loading}
      />
    </>
  );
};

export default CatalogContent;
