
// Sample students data
export const STUDENTS = [
  {
    id: 1,
    name: "João Silva",
    email: "joao.silva@exemplo.com",
    phone: "(11) 98765-4321",
    registrationDate: "15/03/2023",
    status: "Ativo",
    lastLogin: "Hoje, 10:45",
    courses: ["Curso Básico de E-commerce", "Mentoria Individual"],
    mentorships: ["Mentoria Individual", "Mentoria em Grupo"],
    bonuses: ["E-book de E-commerce", "Planilha de Controle"],
    observations: "Cliente interessado em expandir para marketplace."
  },
  {
    id: 2,
    name: "Maria Oliveira",
    email: "maria.oliveira@exemplo.com",
    phone: "(21) 97654-3210",
    registrationDate: "22/05/2023",
    status: "Ativo",
    lastLogin: "Ontem, 15:30",
    courses: ["Curso Avançado de E-commerce"],
    mentorships: [],
    bonuses: ["Planilha de Controle"],
    observations: ""
  },
  {
    id: 3,
    name: "Carlos Santos",
    email: "carlos.santos@exemplo.com",
    phone: "(31) 98877-6655",
    registrationDate: "10/01/2023",
    status: "Ativo",
    lastLogin: "Hoje, 09:15",
    courses: ["Curso Básico de E-commerce", "Curso Avançado de E-commerce", "Mentoria Individual"],
    mentorships: ["Mentoria Individual", "Mentoria Avançada"],
    bonuses: ["E-book de E-commerce", "Planilha de Controle", "Templates de E-commerce"],
    observations: "Aluno destaque na turma."
  },
  {
    id: 4,
    name: "Ana Pereira",
    email: "ana.pereira@exemplo.com",
    phone: "(41) 99988-7766",
    registrationDate: "05/02/2023",
    status: "Inativo",
    lastLogin: "15/05/2023, 14:20",
    courses: ["Curso Básico de E-commerce"],
    mentorships: [],
    bonuses: [],
    observations: "Cliente em processo de renovação."
  },
  {
    id: 5,
    name: "Roberto Costa",
    email: "roberto.costa@exemplo.com",
    phone: "(51) 98765-4321",
    registrationDate: "18/04/2023",
    status: "Pendente",
    lastLogin: "Hoje, 11:05",
    courses: ["Mentoria em Grupo"],
    mentorships: ["Mentoria em Grupo"],
    bonuses: ["E-book de E-commerce"],
    observations: "Aguardando confirmação de dados bancários."
  },
  {
    id: 6,
    name: "Fernanda Lima",
    email: "fernanda.lima@exemplo.com",
    phone: "(61) 97654-3210",
    registrationDate: "03/06/2023",
    status: "Ativo",
    lastLogin: "Hoje, 08:30",
    courses: ["Curso Básico de E-commerce", "Mentoria em Grupo"],
    mentorships: ["Mentoria em Grupo"],
    bonuses: ["Planilha de Controle"],
    observations: "Interessada em expandir negócio."
  },
  {
    id: 7,
    name: "Pedro Alves",
    email: "pedro.alves@exemplo.com",
    phone: "(71) 98877-6655",
    registrationDate: "12/07/2023",
    status: "Ativo",
    lastLogin: "Ontem, 16:45",
    courses: ["Curso Avançado de E-commerce"],
    mentorships: ["Mentoria Individual"],
    bonuses: ["Templates de E-commerce"],
    observations: ""
  },
  {
    id: 8,
    name: "Juliana Martins",
    email: "juliana.martins@exemplo.com",
    phone: "(81) 99988-7766",
    registrationDate: "25/08/2023",
    status: "Inativo",
    lastLogin: "20/04/2023, 09:10",
    courses: ["Mentoria Individual"],
    mentorships: ["Mentoria Individual"],
    bonuses: [],
    observations: "Cliente aguardando renovação."
  },
  {
    id: 9,
    name: "Ricardo Souza",
    email: "ricardo.souza@exemplo.com",
    phone: "(91) 98765-4321",
    registrationDate: "14/09/2023",
    status: "Pendente",
    lastLogin: "Hoje, 14:20",
    courses: ["Curso Básico de E-commerce"],
    mentorships: [],
    bonuses: ["E-book de E-commerce"],
    observations: "Aguardando confirmação de pagamento."
  },
  {
    id: 10,
    name: "Amanda Gomes",
    email: "amanda.gomes@exemplo.com",
    phone: "(11) 97654-3210",
    registrationDate: "30/10/2023",
    status: "Ativo",
    lastLogin: "Ontem, 11:30",
    courses: ["Curso Avançado de E-commerce", "Mentoria em Grupo"],
    mentorships: ["Mentoria em Grupo"],
    bonuses: ["Planilha de Controle", "Templates de E-commerce"],
    observations: "Aluna com potencial para mentorias avançadas."
  }
];

// Sample data for courses, mentorships, and bonuses
export const AVAILABLE_COURSES = [
  { id: 1, name: "Curso Básico de E-commerce", price: "R$ 497,00" },
  { id: 2, name: "Curso Avançado de E-commerce", price: "R$ 997,00" },
  { id: 3, name: "Mentoria Individual", price: "R$ 1.997,00" },
  { id: 4, name: "Curso de Marketing Digital", price: "R$ 697,00" }
];

export const AVAILABLE_MENTORSHIPS = [
  { id: 1, name: "Mentoria Individual", sessions: 4, price: "R$ 1.997,00" },
  { id: 2, name: "Mentoria em Grupo", sessions: 8, price: "R$ 997,00" },
  { id: 3, name: "Mentoria Avançada", sessions: 6, price: "R$ 2.497,00" }
];

export const AVAILABLE_BONUSES = [
  { id: 1, name: "E-book de E-commerce", type: "Digital" },
  { id: 2, name: "Planilha de Controle", type: "Digital" },
  { id: 3, name: "Templates de E-commerce", type: "Digital" },
  { id: 4, name: "Acesso à Comunidade VIP", type: "Serviço" }
];
