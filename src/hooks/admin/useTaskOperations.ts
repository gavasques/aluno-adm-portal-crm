
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { initialTasks, adminUsers } from "@/data/tasksData";
import { USERS } from "@/data/users";

const studentUsers = USERS.filter(user => user.role === "Usuário");

interface TaskFormValues {
  title: string;
  date: string;
  time: string;
  location: string;
  priority: "Baixa" | "Normal" | "Alta";
  assignedTo: string;
  relatedStudentId: string | "none";
}

export const useTaskOperations = () => {
  const [tasks, setTasks] = useState(initialTasks);

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

  // Função para atualizar uma tarefa após edição
  const updateTask = (taskId, updatedData) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? {...task, ...updatedData} : task
    ));
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
    
    toast({
      title: "Tarefa adicionada",
      description: "A tarefa foi adicionada com sucesso."
    });
  };

  return {
    tasks,
    toggleTaskCompletion,
    deleteTask,
    updateTask,
    addTask,
    studentUsers,
  };
};
