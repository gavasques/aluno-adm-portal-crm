import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Users, UserPlus, Filter, Download } from "lucide-react";

// Import the hook and components
import { useStudents } from "@/hooks/admin/useStudents";
import { StudentsViewToggle } from "@/components/admin/students/StudentsViewToggle";

// Import existing components
import StudentList from "@/components/admin/students/StudentList";
import StudentListView from "@/components/admin/students/StudentListView";
import StudentDeleteDialog from "@/components/admin/students/StudentDeleteDialog";
import StudentAddDialog from "@/components/admin/students/StudentAddDialog";

const Students = () => {
  console.log("=== STUDENTS COMPONENT LOADING ===");
  
  const {
    searchQuery,
    setSearchQuery,
    itemsPerPage,
    setItemsPerPage,
    currentPage,
    setCurrentPage,
    sortDirection,
    showDeleteConfirmation,
    setShowDeleteConfirmation,
    studentToDelete,
    statusFilter,
    setStatusFilter,
    showAddStudentDialog,
    setShowAddStudentDialog,
    viewMode,
    setViewMode,
    filteredStudents,
    currentItems,
    totalPages,
    toggleSort,
    handlePageChange,
    handleDeleteClick,
    exportToCSV
  } = useStudents();

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Gestão de Alunos' }
  ];

  const statusOptions = [
    { value: "all", label: "Todos os Status", count: filteredStudents.length },
    { value: "Ativo", label: "Ativo", count: filteredStudents.filter(s => s.status === "Ativo").length },
    { value: "Inativo", label: "Inativo", count: filteredStudents.filter(s => s.status === "Inativo").length },
    { value: "Pendente", label: "Pendente", count: filteredStudents.filter(s => s.status === "Pendente").length }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto p-6 space-y-6">
        {/* Breadcrumb Navigation */}
        <BreadcrumbNav 
          items={breadcrumbItems} 
          showBackButton={true}
          backHref="/admin"
        />

        {/* Header with Stats */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                      <Users className="h-6 w-6" />
                    </div>
                    Gestão de Alunos
                  </CardTitle>
                  <div className="flex items-center gap-3 mt-2">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                      {filteredStudents.length} Alunos
                    </Badge>
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      {filteredStudents.filter(s => s.status === "Ativo").length} Ativos
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Button 
                    variant="outline" 
                    onClick={exportToCSV}
                    className="hover:bg-blue-50"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </Button>
                  <Button 
                    onClick={() => setShowAddStudentDialog(true)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Novo Aluno
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                {/* Search Field */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar alunos por nome ou email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                  />
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-2 lg:w-64">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="border-gray-200 focus:border-blue-400">
                      <SelectValue placeholder="Filtrar por status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center justify-between w-full">
                            <span>{option.label}</span>
                            <Badge variant="secondary" className="ml-2 text-xs">
                              {option.count}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* View Toggle */}
                <StudentsViewToggle 
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Students List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {viewMode === "cards" ? (
            <StudentList 
              students={currentItems}
              onDeleteClick={handleDeleteClick}
              sortDirection={sortDirection}
              toggleSort={toggleSort}
            />
          ) : (
            <StudentListView 
              students={currentItems}
              onDeleteClick={handleDeleteClick}
              sortDirection={sortDirection}
              toggleSort={toggleSort}
            />
          )}
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="border-0 shadow-md">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-600">
                      Exibindo {currentItems.length} de {filteredStudents.length} alunos
                    </p>
                    <Select value={String(itemsPerPage)} onValueChange={(value) => {
                      setItemsPerPage(Number(value));
                      setCurrentPage(1);
                    }}>
                      <SelectTrigger className="w-[130px] h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="25">25 por página</SelectItem>
                        <SelectItem value="50">50 por página</SelectItem>
                        <SelectItem value="100">100 por página</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Anterior
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                        if (page > totalPages) return null;
                        
                        return (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className="w-8 h-8 p-0"
                          >
                            {page}
                          </Button>
                        );
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Próximo
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Delete Confirmation Dialog */}
        <StudentDeleteDialog 
          open={showDeleteConfirmation}
          onOpenChange={setShowDeleteConfirmation}
          student={studentToDelete}
        />

        {/* Add Student Dialog */}
        <StudentAddDialog 
          open={showAddStudentDialog}
          onOpenChange={setShowAddStudentDialog}
        />
      </div>
    </div>
  );
};

export default Students;
