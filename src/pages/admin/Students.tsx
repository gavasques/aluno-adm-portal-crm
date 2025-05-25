
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav";

// Import the new hook and components
import { useStudents } from "@/hooks/admin/useStudents";
import { StudentsHeader } from "@/components/admin/students/StudentsHeader";
import { StudentsActions } from "@/components/admin/students/StudentsActions";

// Import existing components
import StudentSearch from "@/components/admin/students/StudentSearch";
import StudentList from "@/components/admin/students/StudentList";
import StudentPagination from "@/components/admin/students/StudentPagination";
import StudentDeleteDialog from "@/components/admin/students/StudentDeleteDialog";
import StudentAddDialog from "@/components/admin/students/StudentAddDialog";

const Students = () => {
  console.log("=== STUDENTS COMPONENT LOADING ===");
  console.log("Component Students está sendo renderizado");
  
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
    filteredStudents,
    currentItems,
    totalPages,
    toggleSort,
    handlePageChange,
    handleDeleteClick,
    exportToCSV
  } = useStudents();

  console.log("=== STUDENTS DATA ===");
  console.log("Filtered students:", filteredStudents.length);
  console.log("Current items:", currentItems.length);
  console.log("====================");

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Gestão de Alunos' }
  ];

  return (
    <div className="w-full">
      {/* Breadcrumb Navigation */}
      <BreadcrumbNav 
        items={breadcrumbItems} 
        showBackButton={true}
        backHref="/admin"
        className="mb-6"
      />

      <StudentsHeader onAddStudent={() => setShowAddStudentDialog(true)} />

      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Lista de Alunos</CardTitle>
          <StudentsActions onExportCSV={exportToCSV} />
        </CardHeader>
        <CardContent>
          <StudentSearch 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />

          <StudentList 
            students={currentItems}
            onDeleteClick={handleDeleteClick}
            sortDirection={sortDirection}
            toggleSort={toggleSort}
          />
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">
              Exibindo {currentItems.length} de {filteredStudents.length} alunos
            </p>
            <Select value={String(itemsPerPage)} onValueChange={(value) => {
              setItemsPerPage(Number(value));
              setCurrentPage(1);
            }}>
              <SelectTrigger className="w-[110px]">
                <SelectValue placeholder="25 por página" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">25 por página</SelectItem>
                <SelectItem value="50">50 por página</SelectItem>
                <SelectItem value="100">100 por página</SelectItem>
                <SelectItem value="200">200 por página</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <StudentPagination 
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
        </CardFooter>
      </Card>

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
  );
};

export default Students;
