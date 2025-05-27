
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useStudentsData } from '@/hooks/admin/useStudentsData';
import StudentsStatistics from '@/components/admin/students/StudentsStatistics';
import StudentsFilter from '@/components/admin/students/StudentsFilter';
import StudentsTable from '@/components/admin/students/StudentsTable';
import StudentAddDialog from '@/components/admin/students/StudentAddDialog';

const AdminStudents = () => {
  const {
    students,
    statistics,
    isLoading,
    searchTerm,
    statusFilter,
    setSearchTerm,
    setStatusFilter,
    refreshStudents
  } = useStudentsData();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleAddStudent = () => {
    setIsAddDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestão de Alunos</h1>
          <p className="text-muted-foreground">
            Gerencie informações e atividades dos alunos
          </p>
        </div>
        <Button onClick={handleAddStudent}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Aluno
        </Button>
      </div>

      <StudentsStatistics 
        statistics={statistics}
        isLoading={isLoading}
      />

      <StudentsFilter
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        onSearchChange={setSearchTerm}
        onStatusChange={setStatusFilter}
      />

      <StudentsTable 
        students={students}
        isLoading={isLoading}
      />

      <StudentAddDialog 
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
    </div>
  );
};

export default AdminStudents;
