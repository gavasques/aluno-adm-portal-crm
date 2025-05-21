
export const USERS = [
  {
    id: 1,
    name: "Admin Principal",
    email: "admin@portal.com",
    role: "Admin",
    status: "Ativo",
    lastLogin: "Hoje, 09:15",
    tasks: []
  },
  {
    id: 2,
    name: "João Silva",
    email: "joao.silva@exemplo.com",
    role: "Usuário",
    status: "Ativo",
    lastLogin: "Ontem, 14:30",
    tasks: [
      { 
        id: 2, 
        title: "Revisar propostas", 
        date: "25/05/2025", 
        time: "14:30", 
        priority: "Média"
      }
    ]
  },
  {
    id: 3,
    name: "Maria Santos",
    email: "maria.santos@exemplo.com",
    role: "Usuário",
    status: "Ativo",
    lastLogin: "22/05/2023, 11:20",
    tasks: [
      { 
        id: 1, 
        title: "Reunião com fornecedor", 
        date: "25/05/2025", 
        time: "11:00", 
        priority: "Alta"
      },
      { 
        id: 5, 
        title: "Revisar feedback dos alunos", 
        date: "26/05/2025", 
        time: "13:00", 
        priority: "Média"
      }
    ]
  },
  {
    id: 4,
    name: "Pedro Oliveira",
    email: "pedro.oliveira@exemplo.com",
    role: "Usuário",
    status: "Inativo",
    lastLogin: "15/04/2023, 16:45",
    tasks: []
  },
  {
    id: 5,
    name: "Ana Costa",
    email: "ana.costa@exemplo.com",
    role: "Usuário",
    status: "Ativo",
    lastLogin: "19/05/2023, 08:30",
    tasks: [
      { 
        id: 3, 
        title: "Call com parceiro", 
        date: "25/05/2025", 
        time: "16:00", 
        priority: "Alta"
      },
      { 
        id: 4, 
        title: "Preparar material", 
        date: "26/05/2025", 
        time: "09:30", 
        priority: "Baixa"
      }
    ]
  }
];
