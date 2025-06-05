
import React, { useState, useCallback } from 'react';
import { useMentoringReadQueries } from '@/features/mentoring/hooks/useMentoringReadQueries';
import { useMentoringCatalogFilters } from '@/hooks/admin/useMentoringCatalogFilters';
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
  const { useCatalogs } = useMentoringReadQueries();
  const { data: catalogs = [], isLoading: loading, error, refetch } = useCatalogs();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Use optimized filtering hook
  const { filteredCatalogs, stats } = useMentoringCatalogFilters(catalogs, {
    searchTerm,
    typeFilter,
    statusFilter
  });

  // Dialog states
  const [detailDialog, setDetailDialog] = useState<{
    open: boolean;
    catalog: MentoringCatalog | null;
  }>({ open: false, catalog: null });

  const [formDialog, setFormDialog] = useState<{
    open: boolean;
    catalog: MentoringCatalog | null;
  }>({ open: false, catalog: null });

  const handleCreateCatalog = useCallback(() => {
    setFormDialog({ open: true, catalog: null });
  }, []);

  const handleViewCatalog = useCallback((catalog: MentoringCatalog) => {
    setDetailDialog({ open: true, catalog });
  }, []);

  const handleEditCatalog = useCallback((catalog: MentoringCatalog) => {
    setFormDialog({ open: true, catalog });
  }, []);

  const handleDeleteCatalog = useCallback(async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta mentoria?')) {
      return;
    }

    try {
      console.log('Delete catalog:', id);
      await refetch();
    } catch (error) {
      console.error('Erro ao excluir mentoria:', error);
    }
  }, [refetch]);

  const handleToggleStatus = useCallback(async (id: string, currentStatus: boolean) => {
    try {
      console.log('Toggle status:', id, currentStatus);
      await refetch();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
    }
  }, [refetch]);

  const handleFormSubmit = useCallback(async (data: CreateMentoringCatalogData) => {
    try {
      if (formDialog.catalog) {
        console.log('Update catalog:', formDialog.catalog.id, data);
      } else {
        console.log('Create catalog:', data);
      }
      setFormDialog({ open: false, catalog: null });
      await refetch();
    } catch (error) {
      console.error('Erro ao salvar mentoria:', error);
      throw error;
    }
  }, [formDialog.catalog, refetch]);

  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setTypeFilter('');
    setStatusFilter('');
  }, []);

  if (loading) {
    return (
      <LoadingSpinner size="lg" message="Carregando catálogo..." />
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">Erro: {error.message}</div>
        <button 
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <>
      <CatalogHeader
        onCreateCatalog={handleCreateCatalog}
        totalCatalogs={stats.total}
        activeCatalogs={stats.active}
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
        totalCatalogs={stats.total}
        filteredCount={stats.filtered}
      />

      {stats.total === 0 ? (
        <EmptyState 
          type="enrollments" 
          title="Nenhuma mentoria cadastrada"
          description="Não há mentorias cadastradas no sistema. Clique em 'Nova Mentoria' para começar."
        />
      ) : stats.filtered === 0 ? (
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
