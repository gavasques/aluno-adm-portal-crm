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
import CatalogDetailDialog from '@/components/admin/mentoring/catalog/CatalogDetailDialog';
import CatalogEditModal from '@/components/admin/mentoring/catalog/CatalogEditModal';
import { useSupabaseMentoringCatalog } from '@/hooks/mentoring/useSupabaseMentoringCatalog';
import { useMentorsForEnrollment } from '@/hooks/admin/useMentorsForEnrollment';
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
  Target,
  User,
  Calendar,
  DollarSign,
  Eye,
  Edit
} from 'lucide-react';
import { MentoringCatalog, CreateMentoringCatalogData } from '@/types/mentoring.types';

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
    console.log('✏️ Editando catálogo:', catalog.id);
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

  // Função para renderizar descrição HTML formatada com 20 linhas
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

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Mentorias', href: '/admin/mentorias' },
    { label: 'Catálogo' }
  ];

  if (loading && catalogs.length === 0) {
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
                    <span className="text-xs text-blue-700">Mentorias</span>
                  </div>
                </div>
                <Target className="h-6 w-6 text-blue-500" />
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
                    <Zap className="h-2 w-2 text-green-500 mr-1" />
                    <span className="text-xs text-green-700">{((stats.active / stats.total) * 100 || 0).toFixed(0)}%</span>
                  </div>
                </div>
                <TrendingUp className="h-6 w-6 text-green-500" />
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
                    <User className="h-2 w-2 text-purple-500 mr-1" />
                    <span className="text-xs text-purple-700">1:1</span>
                  </div>
                </div>
                <User className="h-6 w-6 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-md transition-all duration-300">
            <CardContent className="p-2 lg:p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-orange-600 mb-1">Grupo</p>
                  <p className="text-lg lg:text-xl font-bold text-orange-900">{stats.group}</p>
                  <div className="flex items-center mt-1">
                    <Users className="h-2 w-2 text-orange-500 mr-1" />
                    <span className="text-xs text-orange-700">Turmas</span>
                  </div>
                </div>
                <Users className="h-6 w-6 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap items-center gap-2 lg:gap-3">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-32 h-8 text-xs">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os tipos</SelectItem>
              <SelectItem value="Individual">Individual</SelectItem>
              <SelectItem value="Grupo">Grupo</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32 h-8 text-xs">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos</SelectItem>
              <SelectItem value="active">Ativas</SelectItem>
              <SelectItem value="inactive">Inativas</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
              className="h-8 px-2 text-xs text-gray-600 hover:text-gray-900"
            >
              <Filter className="h-3 w-3 mr-1" />
              Limpar filtros
            </Button>
          )}
        </div>

        {/* Lista de mentorias */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
          {filteredCatalogs.map((catalog) => (
            <Card key={catalog.id} className="hover:shadow-md transition-all duration-200 border border-gray-200">
              <CardContent className="p-3 lg:p-4">
                <div className="space-y-3">
                  {/* Header do card */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm lg:text-base text-gray-900 line-clamp-2 mb-1">
                        {catalog.name}
                      </h3>
                      <div className="flex items-center gap-1 flex-wrap">
                        <Badge 
                          variant={catalog.type === 'Individual' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {catalog.type}
                        </Badge>
                        <Badge 
                          variant={catalog.active ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {catalog.active ? 'Ativa' : 'Inativa'}
                        </Badge>
                        {catalog.extensions && catalog.extensions.length > 0 && (
                          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600 border-blue-200">
                            {catalog.extensions.length} ext.
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Descrição */}
                  <div className="text-xs text-gray-600 line-clamp-2">
                    {renderFormattedDescription(catalog.description)}
                  </div>

                  {/* Informações principais */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3 text-gray-400" />
                      <span className="truncate">{getMentorName(catalog.instructor)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <span>{catalog.durationMonths} {catalog.durationMonths === 1 ? 'mês' : 'meses'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3 text-gray-400" />
                      <span>{catalog.numberOfSessions} sessões</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3 text-gray-400" />
                      <span className="font-medium text-green-600">R$ {catalog.price.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Botões de ação */}
                  <div className="flex gap-1 pt-2 border-t border-gray-100">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex-1 h-7 text-xs"
                      onClick={() => handleViewCatalog(catalog)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Ver
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex-1 h-7 text-xs"
                      onClick={() => handleEditCatalog(catalog)}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Editar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Estado vazio */}
        {filteredCatalogs.length === 0 && (
          <div className="text-center py-8 lg:py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {hasActiveFilters ? 'Nenhuma mentoria encontrada' : 'Nenhuma mentoria cadastrada'}
            </h3>
            <p className="text-gray-500 mb-4">
              {hasActiveFilters 
                ? 'Tente ajustar os filtros para encontrar mentorias.' 
                : 'Comece criando sua primeira mentoria.'
              }
            </p>
            {!hasActiveFilters && (
              <Button onClick={handleCreateCatalog}>
                <Plus className="h-4 w-4 mr-2" />
                Criar primeira mentoria
              </Button>
            )}
          </div>
        )}
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

      {/* Dialog de edição */}
      <CatalogEditModal
        catalog={selectedCatalog}
        isOpen={showEditDialog}
        onClose={() => {
          setShowEditDialog(false);
          setSelectedCatalog(null);
        }}
        onSave={handleUpdateCatalog}
      />
    </>
  );
};
