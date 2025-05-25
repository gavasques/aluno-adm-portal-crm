
import React, { useState } from 'react';
import { useMentoring } from '@/hooks/useMentoring';
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
  const { catalogs, createMentoringCatalog, updateMentoringCatalog, deleteMentoringCatalog } = useMentoring();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(false);

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

    setLoading(true);
    try {
      const success = await deleteMentoringCatalog(id);
      if (success) {
        toast({
          title: "Sucesso",
          description: "Mentoria excluída com sucesso!",
        });
      } else {
        throw new Error('Falha ao excluir mentoria');
      }
    } catch (error) {
      console.error('Erro ao excluir mentoria:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir mentoria. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    setLoading(true);
    try {
      const catalog = catalogs.find(c => c.id === id);
      if (!catalog) throw new Error('Mentoria não encontrada');

      const success = await updateMentoringCatalog(id, { active: !currentStatus });
      if (success) {
        toast({
          title: "Sucesso",
          description: `Mentoria ${!currentStatus ? 'ativada' : 'desativada'} com sucesso!`,
        });
      } else {
        throw new Error('Falha ao atualizar status');
      }
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      toast({
        title: "Erro",
        description: "Erro ao alterar status da mentoria. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (data: CreateMentoringCatalogData) => {
    setLoading(true);
    try {
      if (formDialog.catalog) {
        // Editando mentoria existente
        const success = await updateMentoringCatalog(formDialog.catalog.id, data);
        if (success) {
          toast({
            title: "Sucesso",
            description: "Mentoria atualizada com sucesso!",
          });
        } else {
          throw new Error('Falha ao atualizar mentoria');
        }
      } else {
        // Criando nova mentoria
        await createMentoringCatalog(data);
        toast({
          title: "Sucesso",
          description: "Mentoria criada com sucesso!",
        });
      }
    } catch (error) {
      console.error('Erro ao salvar mentoria:', error);
      toast({
        title: "Erro",
        description: `Erro ao ${formDialog.catalog ? 'atualizar' : 'criar'} mentoria. Tente novamente.`,
        variant: "destructive",
      });
      throw error; // Re-throw para manter o dialog aberto
    } finally {
      setLoading(false);
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
          onView={handleViewCatalog}
          onEdit={handleEditCatalog}
          onDelete={handleDeleteCatalog}
          onToggleStatus={handleToggleStatus}
        />
      )}

      {/* Dialogs */}
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
