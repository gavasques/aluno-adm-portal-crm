
import React, { useEffect, useState } from 'react';
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch';
import { MentoringLoadingState } from '../../shared/components/LoadingState';
import CatalogFormDialog from '@/components/admin/mentoring/catalog/CatalogFormDialog';
import CatalogDetailDialog from '@/components/admin/mentoring/catalog/CatalogDetailDialog';
import CatalogEditModal from '@/components/admin/mentoring/catalog/CatalogEditModal';
import { useSupabaseMentoringCatalog } from '@/hooks/mentoring/useSupabaseMentoringCatalog';
import { useMentorsForEnrollment } from '@/hooks/admin/useMentorsForEnrollment';
import { MentoringCatalog, CreateMentoringCatalogData } from '@/types/mentoring.types';
import { CatalogHeader } from './catalog/CatalogHeader';
import { CatalogStats } from './catalog/CatalogStats';
import { CatalogFilters } from './catalog/CatalogFilters';
import { CatalogGrid } from './catalog/CatalogGrid';

export const CatalogManagement: React.FC = () => {
  const { catalogs, loading, createCatalog, updateCatalog, deleteCatalog } = useSupabaseMentoringCatalog();
  const { mentors, loading: mentorsLoading } = useMentorsForEnrollment();
  const { searchTerm, debouncedSearchTerm, setSearchTerm } = useDebouncedSearch();
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedCatalog, setSelectedCatalog] = useState<MentoringCatalog | null>(null);

  // Debug log para verificar qual modal está sendo usado
  console.log('🎯 Estado dos modais:', { 
    showCreateDialog, 
    showDetailDialog, 
    showEditDialog, 
    selectedCatalog: selectedCatalog?.id 
  });

  // Filtrar catálogos
  const filteredCatalogs = catalogs.filter(catalog => {
    const matchesSearch = !debouncedSearchTerm || 
      catalog.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      catalog.instructor.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      catalog.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    
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
    console.log('🚀 Abrindo modal de criação');
    setShowCreateDialog(true);
  };

  const handleSubmitCatalog = async (data: CreateMentoringCatalogData): Promise<void> => {
    try {
      console.log('📝 Dados do formulário:', data);
      await createCatalog(data);
      setShowCreateDialog(false);
    } catch (error) {
      console.error('Erro ao criar mentoria:', error);
      throw error;
    }
  };

  const handleViewCatalog = (catalog: MentoringCatalog) => {
    console.log('🔍 Visualizando catálogo:', catalog);
    console.log('📦 Extensões do catálogo:', catalog.extensions);
    setSelectedCatalog(catalog);
    setShowDetailDialog(true);
  };

  const handleEditCatalog = (catalog: MentoringCatalog) => {
    console.log('✏️ Editando catálogo - USANDO CatalogEditModal:', catalog.id);
    setSelectedCatalog(catalog);
    setShowEditDialog(true);
  };

  const handleUpdateCatalog = async (updatedCatalog: MentoringCatalog) => {
    try {
      console.log('🔄 Atualizando catálogo:', updatedCatalog);
      await updateCatalog(updatedCatalog.id, {
        name: updatedCatalog.name,
        type: updatedCatalog.type,
        instructor: updatedCatalog.instructor,
        durationMonths: updatedCatalog.durationMonths,
        numberOfSessions: updatedCatalog.numberOfSessions,
        price: updatedCatalog.price,
        description: updatedCatalog.description,
        active: updatedCatalog.active,
        extensions: updatedCatalog.extensions
      });
      setShowEditDialog(false);
      setSelectedCatalog(null);
    } catch (error) {
      console.error('Erro ao atualizar mentoria:', error);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setTypeFilter('');
    setStatusFilter('');
  };

  const hasActiveFilters = debouncedSearchTerm || typeFilter || statusFilter;

  // Debug logs melhorados
  useEffect(() => {
    console.log('🔄 Estado atual:');
    console.log('📚 Catalogs disponíveis:', catalogs);
    console.log('👥 Mentors carregados:', mentors);
    console.log('⏳ Mentors loading:', mentorsLoading);
    
    // Log detalhado de cada catálogo
    catalogs.forEach(catalog => {
      console.log(`📖 Catálogo "${catalog.name}": instructor="${catalog.instructor}"`);
    });
  }, [mentors, catalogs, mentorsLoading]);

  const getMentorName = (instructor: string) => {
    console.log('🔍 Buscando mentor para instructor:', instructor);
    console.log('👥 Mentors disponíveis para busca:', mentors);
    
    if (!instructor) {
      console.log('❌ Instructor está vazio');
      return 'Sem mentor';
    }
    
    if (mentorsLoading) {
      console.log('⏳ Mentores ainda carregando...');
      return 'Carregando...';
    }
    
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(instructor);
    if (!isUUID) {
      console.log('✅ Instructor já é um nome:', instructor);
      return instructor;
    }
    
    console.log('🔎 Procurando mentor com UUID:', instructor);
    const mentor = mentors.find(m => m.id === instructor);
    
    if (mentor) {
      console.log('✅ Mentor encontrado:', mentor.name);
      return mentor.name;
    } else {
      console.log('❌ Mentor não encontrado, usando instructor original');
      return instructor; // Fallback para o UUID se não encontrar
    }
  };

  // Função para renderizar descrição HTML formatada
  const renderFormattedDescription = (htmlDescription: string) => {
    if (!htmlDescription) return '';
    
    console.log('📝 Renderizando descrição:', htmlDescription.substring(0, 100) + '...');
    
    // Sanitizar e renderizar HTML básico
    const cleanHtml = htmlDescription
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, ''); // Remove iframes
    
    return (
      <div 
        className="text-gray-700 text-xs leading-relaxed prose prose-xs"
        dangerouslySetInnerHTML={{ __html: cleanHtml }}
        style={{
          maxHeight: '28rem', // Espaço para aproximadamente 20 linhas
          lineHeight: '1.4',
          overflow: 'hidden'
        }}
      />
    );
  };

  if (loading && catalogs.length === 0) {
    return <MentoringLoadingState variant="card" count={6} message="Carregando catálogo de mentorias..." />;
  }

  return (
    <>
      <div className="space-y-4 lg:space-y-6">
        <CatalogHeader
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onCreateCatalog={handleCreateCatalog}
          loading={loading}
        />

        <CatalogStats
          total={stats.total}
          active={stats.active}
          individual={stats.individual}
          group={stats.group}
        />

        <CatalogFilters
          typeFilter={typeFilter}
          statusFilter={statusFilter}
          onTypeFilterChange={setTypeFilter}
          onStatusFilterChange={setStatusFilter}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
        />

        <CatalogGrid
          catalogs={filteredCatalogs}
          onViewCatalog={handleViewCatalog}
          onEditCatalog={handleEditCatalog}
          onCreateCatalog={handleCreateCatalog}
          getMentorName={getMentorName}
          renderFormattedDescription={renderFormattedDescription}
        />
      </div>

      {/* Dialog de criação */}
      <CatalogFormDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        catalog={null}
        onSubmit={handleSubmitCatalog}
        isLoading={loading}
      />

      {/* Dialog de detalhes */}
      <CatalogDetailDialog
        open={showDetailDialog}
        onOpenChange={setShowDetailDialog}
        catalog={selectedCatalog}
        onEdit={handleEditCatalog}
      />

      {/* MODAL DE EDIÇÃO - Usando CatalogEditModal com design moderno */}
      <CatalogEditModal
        catalog={selectedCatalog}
        isOpen={showEditDialog}
        onClose={() => {
          console.log('🔒 Fechando CatalogEditModal');
          setShowEditDialog(false);
          setSelectedCatalog(null);
        }}
        onSave={handleUpdateCatalog}
      />
    </>
  );
};
