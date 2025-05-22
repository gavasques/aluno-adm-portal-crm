
import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, UserPlus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Import student data from shared file
import { STUDENTS } from "@/data/students";

// Import components
import StudentSearch from "@/components/admin/students/StudentSearch";
import StudentList from "@/components/admin/students/StudentList";
import StudentPagination from "@/components/admin/students/StudentPagination";
import StudentDeleteDialog from "@/components/admin/students/StudentDeleteDialog";
import StudentAddDialog from "@/components/admin/students/StudentAddDialog";

const Students = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortDirection, setSortDirection] = useState("asc");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddStudentDialog, setShowAddStudentDialog] = useState(false);
  
  // Filter students based on search query and status filter
  const filteredStudents = useMemo(() => {
    return STUDENTS.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || student.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  // Sort students by name
  const sortedStudents = useMemo(() => {
    return [...filteredStudents].sort((a, b) => {
      if (sortDirection === "asc") {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
  }, [filteredStudents, sortDirection]);

  // Calculate pagination
  const totalPages = Math.ceil(sortedStudents.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedStudents.slice(indexOfFirstItem, indexOfLastItem);

  // Handle sort toggle
  const toggleSort = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  // Handle pagination change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle delete student
  const handleDeleteClick = (e, student) => {
    e.stopPropagation();
    setStudentToDelete(student);
    setShowDeleteConfirmation(true);
  };

  // Export students to CSV
  const exportToCSV = () => {
    // Create CSV header
    let csvContent = "ID,Nome,Status,Último Login,Data de Cadastro\n";

    // Add data rows
    sortedStudents.forEach(student => {
      csvContent += `${student.id},"${student.name}","${student.status}","${student.lastLogin}","${student.registrationDate}"\n`;
    });

    // Create download link
    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "alunos.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Exportação concluída",
      description: "Os dados dos alunos foram exportados com sucesso."
    });
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-portal-dark">Gestão de Alunos</h1>
        <Button onClick={() => setShowAddStudentDialog(true)}>
          <UserPlus className="mr-2 h-4 w-4" /> Adicionar Aluno
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Lista de Alunos</CardTitle>
          <Button onClick={exportToCSV}>
            <Download className="mr-2 h-4 w-4" /> Exportar CSV
          </Button>
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
