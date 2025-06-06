
import { useNavigate } from "react-router-dom";

export const useTaskNavigation = () => {
  const navigate = useNavigate();

  // Função para visualizar detalhes da tarefa em nova página
  const viewTaskDetails = (taskId) => {
    navigate(`/admin/tarefas/${taskId}`);
  };

  return {
    viewTaskDetails,
  };
};
