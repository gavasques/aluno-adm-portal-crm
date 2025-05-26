import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav";
import { Separator } from "@/components/ui/separator";
import { 
  Plus, 
  Search, 
  Calendar, 
  Clock,
  Filter,
  Eye,
  Grid3X3,
  List,
  BookOpen,
  GraduationCap,
  TrendingUp,
  Award,
  Zap,
  Target,
  DollarSign,
  User,
  Edit,
  Trash2
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import CatalogDetailModal from "@/components/admin/mentoring/catalog/CatalogDetailModal";
import CatalogEditModal from "@/components/admin/mentoring/catalog/CatalogEditModal";
import CatalogFormDialog from "@/components/admin/mentoring/catalog/CatalogFormDialog";
import { useSupabaseMentoringCatalog } from "@/hooks/mentoring/useSupabaseMentoringCatalog";
import { useToast } from "@/hooks/use-toast";
import { MentoringCatalog } from "@/types/mentoring.types";

const AdminMentoringCatalog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("Todas");
  const [selectedType, setSelectedType] = useState<string>("Todos");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCatalog, setSelectedCatalog] = useState<MentoringCatalog | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const { catalogs, createCatalog, updateCatalog, deleteCatalog, loading } = useSupabaseMentoringCatalog();
  const { toast } = useToast();

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Gestão de Mentorias', href: '/admin/mentorias' },
    { label: 'Catálogo de Mentorias' }
  ];

  const filteredSessions = catalogs.filter(catalog => {
    const matchesSearch = catalog.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         catalog.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "Todas" || 
      (selectedStatus === "Ativa" && catalog.active) ||
      (selectedStatus === "Inativa" && !catalog.active);
    const matchesType = selectedType === "Todos" || catalog.type === selectedType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (active: boolean) => {
    return active 
      ? "bg-green-100 text-green-700 border-green-200"
      : "bg-gray-100 text-gray-700 border-gray-200";
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Individual":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "Grupo":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const handleCreateCatalog = () => {
    setIsCreateModalOpen(true);
  };

  const handleViewCatalog = (catalog: MentoringCatalog) => {
    setSelectedCatalog(catalog);
    setIsDetailModalOpen(true);
  };

  const handleEditCatalog = (catalog: MentoringCatalog) => {
    setSelectedCatalog(catalog);
    setIsEditModalOpen(true);
  };

  const handleDeleteCatalog = async (catalog: MentoringCatalog) => {
    if (window.confirm(`Tem certeza que deseja excluir a mentoria "${catalog.name}"?`)) {
      try {
        await deleteCatalog(catalog.id);
      } catch (error) {
        console.error('Erro ao excluir mentoria:', error);
      }
    }
  };

  const handleSubmitCatalog = async (data: any): Promise<void> => {
    try {
      await createCatalog(data);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Erro ao criar mentoria:', error);
      throw error;
    }
  };

  const handleSaveCatalog = async (updatedData: any) => {
    if (selectedCatalog) {
      try {
        await updateCatalog(selectedCatalog.id, updatedData);
        setIsEditModalOpen(false);
        setSelectedCatalog(null);
      } catch (error) {
        console.error('Erro ao atualizar mentoria:', error);
      }
    }
  };

  const stats = {
    total: catalogs.length,
    individual: catalogs.filter(s => s.type === "Individual").length,
    grupo: catalogs.filter(s => s.type === "Grupo").length,
    ativas: catalogs.filter(s => s.active).length
  };

  if (loading && catalogs.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando catálogo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Breadcrumb Navigation */}
      <BreadcrumbNav 
        items={breadcrumbItems} 
        showBackButton={true}
        backHref="/admin/mentorias"
        className="mb-4"
      />

      {/* Header Compacto */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white">
              <BookOpen className="h-4 w-4 lg:h-5 lg:w-5" />
            </div>
            Catálogo de Mentorias
          </h2>
          <p className="text-gray-600 text-xs lg:text-sm">Gerencie o catálogo de mentorias disponíveis na plataforma</p>
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
            disabled={loading}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 py-1 h-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-sm"
          >
            <Plus className="h-3 w-3 mr-1" />
            Nova Mentoria
          </Button>
        </div>
      </div>

      {/* Stats Cards Compactos */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 lg:gap-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
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
                  <BookOpen className="h-3 w-3 lg:h-4 lg:w-4 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100 hover:shadow-md transition-all duration-300">
            <CardContent className="p-2 lg:p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-green-600 mb-1">Ativas</p>
                  <p className="text-lg lg:text-xl font-bold text-green-900">{stats.ativas}</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-2 w-2 text-green-500 mr-1" />
                    <span className="text-xs text-green-600">disponíveis</span>
                  </div>
                </div>
                <div className="p-1.5 lg:p-2 bg-green-500 rounded-lg">
                  <Zap className="h-3 w-3 lg:h-4 lg:w-4 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
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
                  <User className="h-3 w-3 lg:h-4 lg:w-4 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="border-0 shadow-sm bg-gradient-to-br from-yellow-50 to-yellow-100 hover:shadow-md transition-all duration-300">
            <CardContent className="p-2 lg:p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-yellow-600 mb-1">Grupo</p>
                  <p className="text-lg lg:text-xl font-bold text-yellow-900">{stats.grupo}</p>
                  <div className="flex items-center mt-1">
                    <GraduationCap className="h-2 w-2 text-yellow-500 mr-1" />
                    <span className="text-xs text-yellow-600">turmas</span>
                  </div>
                </div>
                <div className="p-1.5 lg:p-2 bg-yellow-500 rounded-lg">
                  <GraduationCap className="h-3 w-3 lg:h-4 lg:w-4 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filtros Compactos */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between text-base">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white">
                <Filter className="h-3 w-3" />
              </div>
              Filtros e Visualização
            </div>
            <Badge variant="secondary" className="text-xs">
              {filteredSessions.length} de {catalogs.length} mentorias
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
            {/* Filtros */}
            <div className="col-span-2 md:col-span-1">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full h-8 px-2 text-xs border border-gray-200 rounded-lg focus:border-blue-500"
              >
                <option value="Todos">Todos os tipos</option>
                <option value="Individual">Individual</option>
                <option value="Grupo">Grupo</option>
              </select>
            </div>

            <div className="col-span-2 md:col-span-1">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full h-8 px-2 text-xs border border-gray-200 rounded-lg focus:border-blue-500"
              >
                <option value="Todas">Todos status</option>
                <option value="Ativa">Ativas</option>
                <option value="Inativa">Inativas</option>
              </select>
            </div>

            {/* Controles de Visualização */}
            <div className="col-span-2 md:col-span-2 flex gap-1">
              <Button 
                variant={viewMode === 'grid' ? 'default' : 'outline'} 
                onClick={() => setViewMode('grid')}
                className="flex-1 h-8 rounded-lg text-xs"
              >
                <Grid3X3 className="h-3 w-3 mr-1" />
                Cards
              </Button>
              <Button 
                variant={viewMode === 'list' ? 'default' : 'outline'} 
                onClick={() => setViewMode('list')}
                className="flex-1 h-8 rounded-lg text-xs"
              >
                <List className="h-3 w-3 mr-1" />
                Lista
              </Button>
            </div>

            {/* Limpar Filtros */}
            <div className="col-span-2 md:col-span-2">
              {(selectedType !== "Todos" || selectedStatus !== "Todas" || searchTerm) && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedType("Todos");
                    setSelectedStatus("Todas");
                    setSearchTerm("");
                  }}
                  className="w-full h-8 border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-lg text-xs"
                >
                  Limpar Filtros
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conteúdo Principal */}
      {viewMode === 'grid' ? (
        // Vista em Cards
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredSessions.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group overflow-hidden">
                <div className={`h-1 bg-gradient-to-r ${
                  session.type === 'Individual' 
                    ? 'from-purple-500 to-purple-600' 
                    : 'from-yellow-500 to-yellow-600'
                }`} />
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${
                        session.type === 'Individual' 
                          ? 'bg-purple-100 text-purple-600' 
                          : 'bg-yellow-100 text-yellow-600'
                      } group-hover:scale-105 transition-transform duration-300`}>
                        {session.type === 'Individual' ? (
                          <User className="h-3 w-3" />
                        ) : (
                          <GraduationCap className="h-3 w-3" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-1">
                          {session.name}
                        </h3>
                        <p className="text-gray-600 text-xs mt-1">por {session.instructor}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(session.active) + " border text-xs"}>
                      {session.active ? 'Ativa' : 'Inativa'}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 text-xs">Tipo:</span>
                        <Badge variant="outline" className={getTypeColor(session.type) + " text-xs"}>
                          {session.type}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 text-xs">Duração:</span>
                        <span className="font-medium text-xs">{session.durationWeeks} sem</span>
                      </div>
                      <div className="flex items-center justify-between col-span-2">
                        <span className="text-gray-600 text-xs">Preço:</span>
                        <span className="font-bold text-green-600 text-xs">R$ {session.price}</span>
                      </div>
                    </div>
                    
                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-gray-700 text-xs line-clamp-2">{session.description}</p>
                    </div>

                    <Separator className="my-2" />

                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="flex-1 h-7 text-xs hover:bg-blue-50 text-blue-600"
                        onClick={() => handleViewCatalog(session)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Ver
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="flex-1 h-7 text-xs hover:bg-gray-50"
                        onClick={() => handleEditCatalog(session)}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Editar
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 px-2 text-xs hover:bg-red-50 text-red-600"
                        onClick={() => handleDeleteCatalog(session)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        // Vista em Lista similar...
        <div>Lista view placeholder</div>
      )}

      {/* Dialogs */}
      <CatalogFormDialog
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        catalog={null}
        onSubmit={handleSubmitCatalog}
        isLoading={loading}
      />

      {selectedCatalog && (
        <>
          <CatalogDetailModal
            catalog={selectedCatalog}
            isOpen={isDetailModalOpen}
            onClose={() => setIsDetailModalOpen(false)}
            onEdit={() => {
              setIsDetailModalOpen(false);
              setIsEditModalOpen(true);
            }}
          />

          <CatalogEditModal
            catalog={selectedCatalog}
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSave={handleSaveCatalog}
          />
        </>
      )}
    </div>
  );
};

export default AdminMentoringCatalog;
