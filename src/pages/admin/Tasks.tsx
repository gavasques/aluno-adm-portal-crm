
import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useTasks } from "@/hooks/admin/useTasks";
import { TaskFilters } from "@/components/admin/tasks/TaskFilters";
import { TaskTable } from "@/components/admin/tasks/TaskTable";
import { TaskForm } from "@/components/admin/tasks/TaskForm";

const Tasks = () => {
  const {
    // Estados
    isNewTaskDialogOpen,
    setIsNewTaskDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    showStudentModal,
    setShowStudentModal,
    currentTask,
    selectedStudentId,
    selectedTab,
    setSelectedTab,
    
    // Filtros
    priorityFilter,
    setPriorityFilter,
    responsibleFilter,
    setResponsibleFilter,
    statusFilter,
    setStatusFilter,
    studentFilter,
    setStudentFilter,
    
    // Tarefas filtradas
    todayTasks,
    upcomingTasks,
    completedTasks,
    
    // Funções
    toggleTaskCompletion,
    deleteTask,
    viewTaskDetails,
    viewStudent,
    editTask,
    updateTask,
    addTask,
    
    // Form
    form,
    
    // Dados auxiliares
    adminUsers,
    studentUsers
  } = useTasks();
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-portal-dark">Lista de Tarefas</h1>
        <Dialog open={isNewTaskDialogOpen} onOpenChange={setIsNewTaskDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Nova Tarefa
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Nova Tarefa</DialogTitle>
            </DialogHeader>
            <TaskForm
              form={form}
              onSubmit={addTask}
              onCancel={() => {
                setIsNewTaskDialogOpen(false);
                form.reset();
              }}
              adminUsers={adminUsers}
              studentUsers={studentUsers}
            />
          </DialogContent>
        </Dialog>
      </div>
      
      <TaskFilters
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        responsibleFilter={responsibleFilter}
        setResponsibleFilter={setResponsibleFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        studentFilter={studentFilter}
        setStudentFilter={setStudentFilter}
        adminUsers={adminUsers}
        studentUsers={studentUsers}
      />
      
      <Tabs defaultValue="today" value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="today">Tarefas para Hoje ({todayTasks.length})</TabsTrigger>
          <TabsTrigger value="upcoming">Próximas Tarefas ({upcomingTasks.length})</TabsTrigger>
          <TabsTrigger value="completed">Concluídas ({completedTasks.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="today">
          <TaskTable
            title="Tarefas para Hoje"
            description={`${todayTasks.length} tarefas agendadas para hoje.`}
            tasks={todayTasks}
            onToggleCompletion={toggleTaskCompletion}
            onDelete={deleteTask}
            onEdit={editTask}
            onViewDetails={viewTaskDetails}
            onViewStudent={viewStudent}
          />
        </TabsContent>
        
        <TabsContent value="upcoming">
          <TaskTable
            title="Próximas Tarefas"
            description={`${upcomingTasks.length} tarefas agendadas para os próximos dias.`}
            tasks={upcomingTasks}
            showDateColumn={true}
            onToggleCompletion={toggleTaskCompletion}
            onDelete={deleteTask}
            onEdit={editTask}
            onViewDetails={viewTaskDetails}
            onViewStudent={viewStudent}
          />
        </TabsContent>
        
        <TabsContent value="completed">
          <TaskTable
            title="Tarefas Concluídas"
            description={`${completedTasks.length} tarefas concluídas recentemente.`}
            tasks={completedTasks}
            isCompleted={true}
            showDateColumn={true}
            onToggleCompletion={toggleTaskCompletion}
            onDelete={deleteTask}
            onEdit={editTask}
            onViewDetails={viewTaskDetails}
            onViewStudent={viewStudent}
          />
        </TabsContent>
      </Tabs>
      
      {/* Modal para editar/vincular tarefa */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Vincular Tarefa a um Aluno</DialogTitle>
          </DialogHeader>
          {currentTask && (
            <div className="grid gap-4 py-4">
              <div>
                <p className="text-sm font-medium mb-1">Tarefa</p>
                <p>{currentTask.title}</p>
              </div>
              <div>
                <Label htmlFor="student" className="text-sm font-medium mb-1">
                  Aluno vinculado
                </Label>
                <Select 
                  defaultValue={currentTask.relatedStudent ? String(currentTask.relatedStudent.id) : "none"}
                  onValueChange={(value) => {
                    if (value === "none") {
                      updateTask(currentTask.id, { relatedStudent: null });
                      return;
                    }
                    
                    const selectedStudent = studentUsers.find(
                      student => student.id === parseInt(value)
                    );
                    
                    if (selectedStudent) {
                      updateTask(currentTask.id, { 
                        relatedStudent: { 
                          id: selectedStudent.id, 
                          name: selectedStudent.name 
                        } 
                      });
                    }
                  }}
                >
                  <SelectTrigger id="student">
                    <SelectValue placeholder="Selecione um aluno" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhum</SelectItem>
                    {studentUsers.map(user => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modal para visualização do aluno */}
      <Dialog open={showStudentModal} onOpenChange={setShowStudentModal}>
        <DialogContent className="sm:max-w-[90vw] sm:max-h-[90vh] p-0">
          <DialogHeader className="p-4 border-b">
            <DialogTitle>Detalhes do Aluno</DialogTitle>
          </DialogHeader>
          <div className="relative h-[80vh]">
            {selectedStudentId && (
              <iframe 
                src={`/admin/gestao-alunos/${selectedStudentId}`} 
                className="w-full h-full border-0" 
                title="Detalhes do Aluno"
              />
            )}
          </div>
          <DialogFooter className="p-4 border-t">
            <Button onClick={() => setShowStudentModal(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tasks;
