
// Mock de usuários administradores para o dropdown de responsáveis
export const adminUsers = [
  { id: 1, name: "Ana Carolina" },
  { id: 2, name: "Pedro Santos" },
  { id: 3, name: "Roberto Silva" },
  { id: 4, name: "Juliana Costa" },
];

// Mock tasks data
export const initialTasks = [
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
];
