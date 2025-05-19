
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, Clock, Plus, Check, User } from "lucide-react";

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
      assignedTo: "Ana Carolina"
    },
    { 
      id: 2, 
      title: "Revisar propostas", 
      date: "25/05/2025", 
      time: "14:30", 
      priority: "Média", 
      completed: false,
      description: "Revisar propostas comerciais para novos clientes.",
      assignedTo: "Pedro Santos"
    },
    { 
      id: 3, 
      title: "Call com parceiro", 
      date: "25/05/2025", 
      time: "16:00", 
      priority: "Alta", 
      completed: false,
      description: "Discutir parceria para novo curso.",
      assignedTo: "Ana Carolina"
    },
    { 
      id: 4, 
      title: "Preparar material", 
      date: "26/05/2025", 
      time: "09:30", 
      priority: "Baixa", 
      completed: false,
      description: "Preparar material para mentoria em grupo de amanhã.",
      assignedTo: "Pedro Santos"
    },
    { 
      id: 5, 
      title: "Revisar feedback dos alunos", 
      date: "26/05/2025", 
      time: "13:00", 
      priority: "Média", 
      completed: true,
      description: "Analisar feedback do último curso para implementar melhorias.",
      assignedTo: "Ana Carolina"
    }
  ]);
  
  const [selectedTask, setSelectedTask] = useState(null);
  
  // Função para marcar uma tarefa como concluída
  const toggleTaskCompletion = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? {...task, completed: !task.completed} : task
    ));
  };
  
  // Função para abrir detalhes da tarefa
  const openTaskDetails = (task) => {
    setSelectedTask(task);
  };
  
  // Filtrar tarefas para hoje
  const todayTasks = tasks.filter(task => task.date === "25/05/2025" && !task.completed);
  
  // Filtrar tarefas futuras
  const upcomingTasks = tasks.filter(task => task.date !== "25/05/2025" && !task.completed);
  
  // Filtrar tarefas concluídas
  const completedTasks = tasks.filter(task => task.completed);
  
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
      
      {/* Tarefas para hoje */}
      <Card className="mb-6">
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
                  <TableHead>Prioridade</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {todayTasks.length > 0 ? (
                  todayTasks.map(task => (
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
                      <TableCell className="font-medium">{task.title}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-gray-400" />
                          {task.time}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          task.priority === "Alta" ? "bg-red-100 text-red-800" :
                          task.priority === "Média" ? "bg-amber-100 text-amber-800" :
                          "bg-green-100 text-green-800"
                        }`}>
                          {task.priority}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1 text-gray-400" />
                          {task.assignedTo}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => openTaskDetails(task)}>
                          Ver Detalhes
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                      Nenhuma tarefa para hoje.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Próximas tarefas */}
      <Card className="mb-6">
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
                  <TableHead>Prioridade</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcomingTasks.length > 0 ? (
                  upcomingTasks.map(task => (
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
                      <TableCell className="font-medium">{task.title}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                          {task.date}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-gray-400" />
                          {task.time}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          task.priority === "Alta" ? "bg-red-100 text-red-800" :
                          task.priority === "Média" ? "bg-amber-100 text-amber-800" :
                          "bg-green-100 text-green-800"
                        }`}>
                          {task.priority}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1 text-gray-400" />
                          {task.assignedTo}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => openTaskDetails(task)}>
                          Ver Detalhes
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                      Nenhuma tarefa futura.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Tarefas concluídas */}
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
                  <TableHead>Responsável</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {completedTasks.length > 0 ? (
                  completedTasks.map(task => (
                    <TableRow key={task.id} className="bg-gray-50">
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0" 
                          onClick={() => toggleTaskCompletion(task.id)}
                        >
                          <span className="h-6 w-6 rounded-full border-2 border-green-500 bg-green-500 flex items-center justify-center">
                            <Check className="h-4 w-4 text-white" />
                          </span>
                        </Button>
                      </TableCell>
                      <TableCell className="font-medium line-through text-gray-500">{task.title}</TableCell>
                      <TableCell>
                        <div className="flex items-center text-gray-500">
                          <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                          {task.date}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-gray-500">
                          <Clock className="h-4 w-4 mr-1 text-gray-400" />
                          {task.time}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-gray-500">
                          <User className="h-4 w-4 mr-1 text-gray-400" />
                          {task.assignedTo}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => openTaskDetails(task)}>
                          Ver Detalhes
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                      Nenhuma tarefa concluída.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Dialog para detalhes da tarefa */}
      {selectedTask && (
        <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Detalhes da Tarefa</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <h3 className="font-medium mb-1">Título</h3>
                <p>{selectedTask.title}</p>
              </div>
              <div>
                <h3 className="font-medium mb-1">Descrição</h3>
                <p>{selectedTask.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-1">Data</h3>
                  <p>{selectedTask.date}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Horário</h3>
                  <p>{selectedTask.time}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-1">Prioridade</h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    selectedTask.priority === "Alta" ? "bg-red-100 text-red-800" :
                    selectedTask.priority === "Média" ? "bg-amber-100 text-amber-800" :
                    "bg-green-100 text-green-800"
                  }`}>
                    {selectedTask.priority}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Status</h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    selectedTask.completed ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                  }`}>
                    {selectedTask.completed ? "Concluída" : "Pendente"}
                  </span>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-1">Responsável</h3>
                <p>{selectedTask.assignedTo}</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedTask(null)}>Fechar</Button>
              <Button onClick={() => toggleTaskCompletion(selectedTask.id)}>
                {selectedTask.completed ? "Marcar como Pendente" : "Marcar como Concluída"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Tasks;
