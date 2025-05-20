import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, Clock, Plus, Check, User, Filter, Trash2, Eye, Link as LinkIcon } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent, TabsTriggerWithBadge } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { USERS } from "@/data/users";
import { toast } from "@/hooks/use-toast";

// Mock de usuários administradores para o dropdown de responsáveis
const adminUsers = [
  { id: 1, name: "Ana Carolina" },
  { id: 2, name: "Pedro Santos" },
  { id: 3, name: "Roberto Silva" },
  { id: 4, name: "Juliana Costa" },
];

// Constante para selecionar os usuários do tipo "Usuário"
const studentUsers = USERS.filter(user => user.role === "Usuário");

const Tasks = () => {
  // Mock tasks data
  const [tasks, setTasks] = useState([
    { 
      id: 1, 
      title: "Reunião com fornecedor", 
      date: "25/05/2025", 
      time: "11:00", 
      priority: "Alta", 
      completed: false, 
      description: "Discutir novos termos de contrato com o fornecedor ABC.",
      assignedTo: "Ana Carolina",
      location: "Sala de Reuniões 3",
      relatedStudent: { id: 3, name: "Maria Santos" }
    },
    { 
      id: 2, 
      title: "Revisar propostas", 
      date: "25/05/2025", 
      time: "14:30", 
      priority: "Média", 
      completed: false,
      description: "Revisar propostas comerciais para novos clientes.",
      assignedTo: "Pedro Santos",
      location: "Escritório",
      relatedStudent: { id: 2, name: "João Silva" }
    },
    { 
      id: 3, 
      title: "Call com parceiro", 
      date: "25/05/2025", 
      time: "16:00", 
      priority: "Alta", 
      completed: false,
      description: "Discutir parceria para novo curso.",
      assignedTo: "Ana Carolina",
      location: "Videoconferência",
      relatedStudent: { id: 5, name: "Ana Costa" }
    },
    { 
      id: 4, 
      title: "Preparar material", 
      date: "26/05/2025", 
      time: "09:30", 
      priority: "Baixa", 
      completed: false,
      description: "Preparar material para mentoria em grupo de amanhã.",
      assignedTo: "Pedro Santos",
      location: "Home Office",
      relatedStudent: { id: 5, name: "Ana Costa" }
    },
    { 
      id: 5, 
      title: "Revisar feedback dos alunos", 
      date: "26/05/2025", 
      time: "13:00", 
      priority: "Média", 
      completed: true,
      description: "Analisar feedback do último curso para implementar melhorias.",
      assignedTo: "Ana Carolina",
      location: "Sala de Estudos",
      relatedStudent: { id: 3, name: "Maria Santos" }
    }
  ]);
  
  // Estados para filtros
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [responsibleFilter, setResponsibleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [studentFilter, setStudentFilter] = useState("all");
  
  // Estados para o modal de visualização do aluno
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  
  // Estado para abas
  const [selectedTab, setSelectedTab] = useState("today");
  
  // Estado para o modal de edição de tarefa
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  
  const navigate = useNavigate();
  
  // Função para marcar uma tarefa como concluída
  const toggleTaskCompletion = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? {...task, completed: !task.completed} : task
    ));
  };
  
  // Função para excluir uma tarefa
  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };
  
  // Função para visualizar detalhes da tarefa em nova página
  const viewTaskDetails = (taskId) => {
    navigate(`/admin/tasks/${taskId}`);
  };
  
  // Função para mostrar o modal de um aluno
  const viewStudent = (studentId) => {
    setSelectedStudentId(studentId);
    setShowStudentModal(true);
  };
  
  // Função para editar uma tarefa
  const editTask = (task) => {
    setCurrentTask(task);
    setIsEditDialogOpen(true);
  };
  
  // Função para atualizar uma tarefa após edição
  const updateTask = (taskId, updatedData) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? {...task, ...updatedData} : task
    ));
    setIsEditDialogOpen(false);
    toast({
      title: "Tarefa atualizada",
      description: "A tarefa foi atualizada com sucesso."
    });
  };
  
  // Filtrar tarefas com base nos filtros selecionados
  const filterTasks = (tasksArray) => {
    return tasksArray.filter(task => {
      // Filtro de prioridade
      if (priorityFilter !== "all" && task.priority !== priorityFilter) return false;
      
      // Filtro de responsável
      if (responsibleFilter !== "all" && task.assignedTo !== responsibleFilter) return false;
      
      // Filtro de status
      if (statusFilter === "completed" && !task.completed) return false;
      if (statusFilter === "pending" && task.completed) return false;
      
      // Filtro de aluno
      if (studentFilter !== "all" && 
          (!task.relatedStudent || task.relatedStudent.id !== parseInt(studentFilter))) 
        return false;
      
      return true;
    });
  };
  
  // Filtrar tarefas para hoje
  const todayTasks = filterTasks(tasks.filter(task => task.date === "25/05/2025" && !task.completed));
  
  // Filtrar tarefas futuras
  const upcomingTasks = filterTasks(tasks.filter(task => task.date !== "25/05/2025" && !task.completed));
  
  // Filtrar tarefas concluídas
  const completedTasks = filterTasks(tasks.filter(task => task.completed));
  
  // Renderiza o TaskRow como um componente separado para melhor organização
  const TaskRow = ({ task, isCompleted }) => {
    return (
      <TableRow key={task.id}>
        <TableCell>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={() => toggleTaskCompletion(task.id)}
          >
            <span className={`h-6 w-6 rounded-full border-2 border-gray-300 flex items-center justify-center ${task.completed ? 'bg-green-500 border-green-500' : ''}`}>
              {task.completed && <Check className="h-4 w-4 text-white" />}
            </span>
          </Button>
        </TableCell>
        <TableCell className={`font-medium ${isCompleted ? 'line-through text-gray-500' : ''}`}>{task.title}</TableCell>
        {task.date !== "25/05/2025" && (
          <TableCell>
            <div className={`flex items-center ${isCompleted ? 'text-gray-500' : ''}`}>
              <Calendar className="h-4 w-4 mr-1 text-gray-400" />
              {task.date}
            </div>
          </TableCell>
        )}
        <TableCell>
          <div className={`flex items-center ${isCompleted ? 'text-gray-500' : ''}`}>
            <Clock className="h-4 w-4 mr-1 text-gray-400" />
            {task.time}
          </div>
        </TableCell>
        <TableCell className={isCompleted ? 'text-gray-500' : ''}>{task.location}</TableCell>
        {!isCompleted && (
          <TableCell>
            <span className={`px-2 py-1 rounded-full text-xs ${
              task.priority === "Alta" ? "bg-red-100 text-red-800" :
              task.priority === "Média" ? "bg-amber-100 text-amber-800" :
              "bg-green-100 text-green-800"
            }`}>
              {task.priority}
            </span>
          </TableCell>
        )}
        <TableCell>
          <div className={`flex items-center ${isCompleted ? 'text-gray-500' : ''}`}>
            <User className="h-4 w-4 mr-1 text-gray-400" />
            {task.assignedTo}
          </div>
        </TableCell>
        <TableCell>
          {task.relatedStudent ? (
            <Button 
              variant="link" 
              onClick={() => viewStudent(task.relatedStudent.id)}
              className={`${isCompleted ? 'text-gray-500' : 'text-blue-600'}`}
            >
              {task.relatedStudent.name}
            </Button>
          ) : (
            <span className="text-gray-400">Nenhum</span>
          )}
        </TableCell>
        <TableCell className="text-right space-x-2">
          <Button variant="ghost" size="sm" onClick={() => editTask(task)}>
            <LinkIcon className="h-4 w-4 mr-1" /> Vincular
          </Button>
          <Button variant="ghost" size="sm" onClick={() => viewTaskDetails(task.id)}>
            <Eye className="h-4 w-4 mr-1" /> Ver
          </Button>
          <Button variant="ghost" size="sm" onClick={() => deleteTask(task.id)}>
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </TableCell>
      </TableRow>
    );
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-portal-dark">Lista de Tarefas</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Nova Tarefa
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Nova Tarefa</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Formulário seria implementado aqui */}
              <p>Formulário para adicionar uma nova tarefa.</p>
            </div>
            <DialogFooter>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Filtros */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Prioridade</label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as prioridades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="Alta">Alta</SelectItem>
                  <SelectItem value="Média">Média</SelectItem>
                  <SelectItem value="Baixa">Baixa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Responsável</label>
              <Select value={responsibleFilter} onValueChange={setResponsibleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os responsáveis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {adminUsers.map(user => (
                    <SelectItem key={user.id} value={user.name}>{user.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="completed">Concluídas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Aluno</label>
              <Select value={studentFilter} onValueChange={setStudentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os alunos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {studentUsers.map(user => (
                    <SelectItem key={user.id} value={user.id.toString()}>{user.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Abas de tarefas */}
      <Tabs defaultValue="today" value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="today">Tarefas para Hoje ({todayTasks.length})</TabsTrigger>
          <TabsTrigger value="upcoming">Próximas Tarefas ({upcomingTasks.length})</TabsTrigger>
          <TabsTrigger value="completed">Concluídas ({completedTasks.length})</TabsTrigger>
        </TabsList>
        
        {/* Conteúdo da aba "Hoje" */}
        <TabsContent value="today">
          <Card>
            <CardHeader>
              <CardTitle>Tarefas para Hoje</CardTitle>
              <CardDescription>
                {todayTasks.length} tarefas agendadas para hoje.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">Status</TableHead>
                      <TableHead>Título</TableHead>
                      <TableHead>Horário</TableHead>
                      <TableHead>Local</TableHead>
                      <TableHead>Prioridade</TableHead>
                      <TableHead>Responsável</TableHead>
                      <TableHead>Aluno</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {todayTasks.length > 0 ? (
                      todayTasks.map(task => (
                        <TaskRow key={task.id} task={task} isCompleted={false} />
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-4 text-gray-500">
                          Nenhuma tarefa para hoje.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Conteúdo da aba "Próximas" */}
        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
              <CardTitle>Próximas Tarefas</CardTitle>
              <CardDescription>
                {upcomingTasks.length} tarefas agendadas para os próximos dias.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">Status</TableHead>
                      <TableHead>Título</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Horário</TableHead>
                      <TableHead>Local</TableHead>
                      <TableHead>Prioridade</TableHead>
                      <TableHead>Responsável</TableHead>
                      <TableHead>Aluno</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {upcomingTasks.length > 0 ? (
                      upcomingTasks.map(task => (
                        <TaskRow key={task.id} task={task} isCompleted={false} />
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-4 text-gray-500">
                          Nenhuma tarefa futura.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Conteúdo da aba "Concluídas" */}
        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Tarefas Concluídas</CardTitle>
              <CardDescription>
                {completedTasks.length} tarefas concluídas recentemente.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">Status</TableHead>
                      <TableHead>Título</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Horário</TableHead>
                      <TableHead>Local</TableHead>
                      <TableHead>Responsável</TableHead>
                      <TableHead>Aluno</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {completedTasks.length > 0 ? (
                      completedTasks.map(task => (
                        <TaskRow key={task.id} task={task} isCompleted={true} />
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-4 text-gray-500">
                          Nenhuma tarefa concluída.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
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
