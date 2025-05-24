
import { useState, useMemo } from "react";
import { toast } from "@/hooks/use-toast";
import { STUDENTS } from "@/data/students";

export const useStudents = () => {
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

  return {
    // States
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
    
    // Computed values
    filteredStudents,
    currentItems,
    totalPages,
    
    // Functions
    toggleSort,
    handlePageChange,
    handleDeleteClick,
    exportToCSV
  };
};
