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
  Users, 
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
  Edit
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import CatalogDetailModal from "@/components/admin/mentoring/catalog/CatalogDetailModal";

interface MentoringSession {
  id: string;
  title: string;
  mentor: string;
  students: number;
  duration: string;
  date: string;
  status: "Agendada" | "Em Andamento" | "Concluída" | "Cancelada";
  category: string;
  type: "Individual" | "Grupo";
  price: number;
  description: string;
}

const mockMentoringSessions: MentoringSession[] = [
  {
    id: "1",
    title: "Estratégias de E-commerce",
    mentor: "João Silva",
    students: 12,
    duration: "2h",
    date: "2024-01-15",
    status: "Agendada",
    category: "E-commerce",
    type: "Grupo",
    price: 299,
    description: "Aprenda as melhores estratégias para aumentar suas vendas online"
  },
  {
    id: "2",
    title: "Marketing Digital Avançado",
    mentor: "Maria Santos",
    students: 8,
    duration: "1h30m",
    date: "2024-01-12",
    status: "Concluída",
    category: "Marketing",
    type: "Individual",
    price: 199,
    description: "Domine as técnicas mais avançadas de marketing digital"
  },
  {
    id: "3",
    title: "Gestão de Fornecedores",
    mentor: "Pedro Costa",
    students: 15,
    duration: "2h30m",
    date: "2024-01-10",
    status: "Concluída",
    category: "Gestão",
    type: "Grupo",
    price: 349,
    description: "Como otimizar sua cadeia de fornecedores para máxima eficiência"
  }
];

const AdminMentoringCatalog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("Todas");
  const [selectedType, setSelectedType] = useState<string>("Todos");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCatalog, setSelectedCatalog] = useState<MentoringSession | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Gestão de Mentorias', href: '/admin/mentorias' },
    { label: 'Catálogo de Mentorias' }
  ];

  const filteredSessions = mockMentoringSessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.mentor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "Todas" || session.status === selectedStatus;
    const matchesType = selectedType === "Todos" || session.type === selectedType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Agendada":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Em Andamento":
        return "bg-green-100 text-green-700 border-green-200";
      case "Concluída":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "Cancelada":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
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

  const handleViewCatalog = (catalog: MentoringSession) => {
    setSelectedCatalog(catalog);
    setIsDetailModalOpen(true);
  };

  const handleEditCatalog = (catalog: MentoringSession) => {
    console.log("Editar mentoria:", catalog);
    // Aqui você implementaria a lógica de edição
  };

  const stats = {
    total: mockMentoringSessions.length,
    individual: mockMentoringSessions.filter(s => s.type === "Individual").length,
    grupo: mockMentoringSessions.filter(s => s.type === "Grupo").length,
    ativas: mockMentoringSessions.filter(s => s.status === "Agendada" || s.status === "Em Andamento").length
  };

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
          <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 py-1 h-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-sm">
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
                    <Users className="h-2 w-2 text-yellow-500 mr-1" />
                    <span className="text-xs text-yellow-600">turmas</span>
                  </div>
                </div>
                <div className="p-1.5 lg:p-2 bg-yellow-500 rounded-lg">
                  <Users className="h-3 w-3 lg:h-4 lg:w-4 text-white" />
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
              {filteredSessions.length} de {mockMentoringSessions.length} mentorias
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
                <option value="Agendada">Agendadas</option>
                <option value="Em Andamento">Em Andamento</option>
                <option value="Concluída">Concluídas</option>
                <option value="Cancelada">Canceladas</option>
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
                          <Users className="h-3 w-3" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-1">
                          {session.title}
                        </h3>
                        <p className="text-gray-600 text-xs mt-1">por {session.mentor}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(session.status) + " border text-xs"}>
                      {session.status}
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
                        <span className="font-medium text-xs">{session.duration}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 text-xs">Alunos:</span>
                        <span className="font-medium text-xs">{session.students}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 text-xs">Preço:</span>
                        <span className="font-bold text-green-600 text-xs">R$ {session.price}</span>
                      </div>
                    </div>
                    
                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-gray-700 text-xs line-clamp-2">{session.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <Badge variant="outline" className="text-xs">
                        {session.category}
                      </Badge>
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
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        // Vista em Lista
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-900 text-sm">Mentoria</TableHead>
                    <TableHead className="font-semibold text-gray-900 text-sm">Tipo</TableHead>
                    <TableHead className="font-semibold text-gray-900 text-sm">Mentor</TableHead>
                    <TableHead className="font-semibold text-gray-900 text-sm text-center">Alunos</TableHead>
                    <TableHead className="font-semibold text-gray-900 text-sm text-center">Duração</TableHead>
                    <TableHead className="font-semibold text-gray-900 text-sm text-center">Status</TableHead>
                    <TableHead className="font-semibold text-gray-900 text-sm text-center">Preço</TableHead>
                    <TableHead className="text-right font-semibold text-gray-900 text-sm">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSessions.map((session, index) => (
                    <motion.tr
                      key={session.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900 text-sm">{session.title}</span>
                          <Badge variant="outline" className="w-fit text-xs mt-1">
                            {session.category}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getTypeColor(session.type) + " border text-xs"}>
                          {session.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-xs">
                            {session.mentor.charAt(0)}
                          </div>
                          <span className="text-gray-900 text-sm">{session.mentor}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Users className="h-3 w-3 text-gray-400" />
                          <span className="text-sm">{session.students}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span className="text-sm">{session.duration}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className={getStatusColor(session.status) + " text-xs"}>
                          {session.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <DollarSign className="h-3 w-3 text-green-500" />
                          <span className="font-medium text-green-600 text-sm">{session.price}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 hover:bg-blue-50 text-blue-600 text-xs"
                            onClick={() => handleViewCatalog(session)}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Ver
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 hover:bg-gray-50 text-xs"
                            onClick={() => handleEditCatalog(session)}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Editar
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estado Vazio */}
      {filteredSessions.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-0 shadow-sm">
            <CardContent className="py-12 text-center">
              <div className="p-4 bg-gray-100 rounded-xl inline-block mb-4">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Nenhuma mentoria encontrada
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto text-sm">
                {(selectedType !== "Todos" || selectedStatus !== "Todas" || searchTerm) 
                  ? 'Ajuste os filtros para encontrar mentorias ou crie uma nova'
                  : 'Crie sua primeira mentoria para começar'
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                {(selectedType !== "Todos" || selectedStatus !== "Todas" || searchTerm) && (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSelectedType("Todos");
                      setSelectedStatus("Todas");
                      setSearchTerm("");
                    }}
                    className="px-4 py-2 border border-blue-200 text-blue-600 hover:bg-blue-50 rounded-lg text-sm"
                  >
                    Limpar Filtros
                  </Button>
                )}
                <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Mentoria
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Modal de Detalhes */}
      <CatalogDetailModal
        catalog={selectedCatalog}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onEdit={handleEditCatalog}
      />
    </div>
  );
};

export default AdminMentoringCatalog;
