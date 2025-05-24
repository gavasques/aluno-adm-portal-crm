
import { useState } from "react";

export const useTaskFilters = () => {
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [responsibleFilter, setResponsibleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [studentFilter, setStudentFilter] = useState("all");

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

  return {
    priorityFilter,
    setPriorityFilter,
    responsibleFilter,
    setResponsibleFilter,
    statusFilter,
    setStatusFilter,
    studentFilter,
    setStudentFilter,
    filterTasks,
  };
};
