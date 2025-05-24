
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { USERS } from "@/data/users";

// Mock de usuários administradores para o dropdown de responsáveis
const adminUsers = [
  { id: 1, name: "Ana Carolina" },
  { id: 2, name: "Pedro Santos" },
  { id: 3, name: "Roberto Silva" },
  { id: 4, name: "Juliana Costa" },
];

// Constante para selecionar os usuários do tipo "Usuário"
const studentUsers = USERS.filter(user => user.role === "Usuário");

// Interface para o formulário de tarefas
interface TaskFormValues {
  title: string;
  date: string;
  time: string;
  location: string;
  priority: "Baixa" | "Normal" | "Alta";
  assignedTo: string;
  relatedStudentId: string | "none";
}

export const useTasks = () => {
  const navigate = useNavigate();
  
  // Estados para controle dos modais
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  
  // Inicialização do hook do formulário
  const form = useForm<TaskFormValues>({
    defaultValues: {
      title: "",
      date: "",
      time: "",
      location: "",
      priority: "Normal",
      assignedTo: "",
      relatedStudentId: "none"
    }
  });
  
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
  const [selectedTab, setSelectedTab] = useState("today");
  
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
  
  // Função para adicionar uma nova tarefa
  const addTask = (data: TaskFormValues) => {
    const newTaskId = Math.max(...tasks.map(task => task.id)) + 1;
    const assignedToName = adminUsers.find(user => user.id.toString() === data.assignedTo)?.name || "";
    
    let relatedStudent = null;
    if (data.relatedStudentId && data.relatedStudentId !== "none") {
      const selectedStudent = studentUsers.find(
        student => student.id.toString() === data.relatedStudentId
      );
      if (selectedStudent) {
        relatedStudent = {
          id: selectedStudent.id,
          name: selectedStudent.name
        };
      }
    }
    
    const newTask = {
      id: newTaskId,
      title: data.title,
      date: data.date,
      time: data.time,
      priority: data.priority,
      completed: false,
      description: "",
      assignedTo: assignedToName,
      location: data.location,
      relatedStudent
    };
    
    setTasks([...tasks, newTask]);
    setIsNewTaskDialogOpen(false);
    form.reset();
    
    toast({
      title: "Tarefa adicionada",
      description: "A tarefa foi adicionada com sucesso."
    });
  };
  
  // Filtrar tarefas com base nos filtros selecionados
  const filterTasks = (tasksArray) => {
    return tasksArray.filter(task => {
      if (priorityFilter !== "all" && task.priority !== priorityFilter) return false;
      if (responsibleFilter !== "all" && task.assignedTo !== responsibleFilter) return false;
      if (statusFilter === "completed" && !task.completed) return false;
      if (statusFilter === "pending" && task.completed) return false;
      if (studentFilter !== "all" && 
          (!task.relatedStudent || task.relatedStudent.id !== parseInt(studentFilter))) 
        return false;
      return true;
    });
  };
  
  // Filtrar tarefas para hoje
  const todayTasks = filterTasks(tasks.filter(task => task.date === "25/05/2025" && !task.completed));
  const upcomingTasks = filterTasks(tasks.filter(task => task.date !== "25/05/2025" && !task.completed));
  const completedTasks = filterTasks(tasks.filter(task => task.completed));

  return {
    // Estados
    tasks,
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
  };
};
