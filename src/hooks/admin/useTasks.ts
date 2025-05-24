
import { useForm } from "react-hook-form";
import { adminUsers } from "@/data/tasksData";
import { useTaskModals } from "./useTaskModals";
import { useTaskFilters } from "./useTaskFilters";
import { useTaskOperations } from "./useTaskOperations";
import { useTaskNavigation } from "./useTaskNavigation";

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
  // Hooks modulares
  const modals = useTaskModals();
  const filters = useTaskFilters();
  const operations = useTaskOperations();
  const navigation = useTaskNavigation();
  
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
  
  // Função para mostrar o modal de um aluno
  const viewStudent = (studentId) => {
    modals.setSelectedStudentId(studentId);
    modals.setShowStudentModal(true);
  };
  
  // Função para editar uma tarefa
  const editTask = (task) => {
    modals.setCurrentTask(task);
    modals.setIsEditDialogOpen(true);
  };
  
  // Função para adicionar uma nova tarefa com reset do form
  const addTask = (data: TaskFormValues) => {
    operations.addTask(data);
    modals.setIsNewTaskDialogOpen(false);
    form.reset();
  };
  
  // Filtrar tarefas para hoje, futuras e concluídas
  const todayTasks = filters.filterTasks(operations.tasks.filter(task => task.date === "25/05/2025" && !task.completed));
  const upcomingTasks = filters.filterTasks(operations.tasks.filter(task => task.date !== "25/05/2025" && !task.completed));
  const completedTasks = filters.filterTasks(operations.tasks.filter(task => task.completed));

  return {
    // Estados dos modais
    ...modals,
    
    // Filtros
    ...filters,
    
    // Tarefas filtradas
    todayTasks,
    upcomingTasks,
    completedTasks,
    
    // Funções de operações
    toggleTaskCompletion: operations.toggleTaskCompletion,
    deleteTask: operations.deleteTask,
    updateTask: operations.updateTask,
    addTask,
    
    // Funções de navegação e modal
    viewTaskDetails: navigation.viewTaskDetails,
    viewStudent,
    editTask,
    
    // Form
    form,
    
    // Dados auxiliares
    adminUsers,
    studentUsers: operations.studentUsers
  };
};
