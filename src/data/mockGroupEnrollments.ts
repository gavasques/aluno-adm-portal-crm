
import { GroupEnrollment, StudentMentoringEnrollment, MentoringCatalog } from '@/types/mentoring.types';

// Mock de mentorias para grupos
const mockGroupMentoringCatalogs: MentoringCatalog[] = [
  {
    id: 'catalog-group-001',
    name: 'E-commerce Avançado - Turma A',
    type: 'Grupo',
    instructor: 'Ana Silva',
    durationMonths: 3,
    frequency: 'Semanal',
    numberOfSessions: 8,
    totalSessions: 8,
    price: 800,
    description: 'Mentoria em grupo focada em estratégias avançadas de e-commerce',
    tags: ['e-commerce', 'vendas', 'marketing'],
    active: true,
    status: 'Ativa',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'catalog-group-002',
    name: 'Gestão de Fornecedores - Turma B',
    type: 'Grupo',
    instructor: 'Carlos Mendes',
    durationMonths: 2,
    frequency: 'Quinzenal',
    numberOfSessions: 6,
    totalSessions: 6,
    price: 600,
    description: 'Mentoria em grupo sobre gestão eficiente de fornecedores',
    tags: ['fornecedores', 'gestão', 'negociação'],
    active: true,
    status: 'Ativa',
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-02-01T10:00:00Z'
  }
];

// Mock de participantes individuais para os grupos
const mockGroupParticipants: StudentMentoringEnrollment[] = [
  // Participantes do Grupo 1
  {
    id: 'enrollment-group-001-student-001',
    studentId: 'student-001',
    mentoringId: 'catalog-group-001',
    mentoring: mockGroupMentoringCatalogs[0],
    status: 'ativa',
    enrollmentDate: '2024-01-20T10:00:00Z',
    startDate: '2024-01-25T10:00:00Z',
    endDate: '2024-04-25T10:00:00Z',
    sessionsUsed: 3,
    totalSessions: 8,
    responsibleMentor: 'Ana Silva',
    paymentStatus: 'pago',
    groupId: 'group-001',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z'
  },
  {
    id: 'enrollment-group-001-student-002',
    studentId: 'student-002',
    mentoringId: 'catalog-group-001',
    mentoring: mockGroupMentoringCatalogs[0],
    status: 'ativa',
    enrollmentDate: '2024-01-20T10:00:00Z',
    startDate: '2024-01-25T10:00:00Z',
    endDate: '2024-04-25T10:00:00Z',
    sessionsUsed: 2,
    totalSessions: 8,
    responsibleMentor: 'Ana Silva',
    paymentStatus: 'pago',
    groupId: 'group-001',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z'
  },
  {
    id: 'enrollment-group-001-student-003',
    studentId: 'student-003',
    mentoringId: 'catalog-group-001',
    mentoring: mockGroupMentoringCatalogs[0],
    status: 'ativa',
    enrollmentDate: '2024-01-22T10:00:00Z',
    startDate: '2024-01-25T10:00:00Z',
    endDate: '2024-04-25T10:00:00Z',
    sessionsUsed: 3,
    totalSessions: 8,
    responsibleMentor: 'Ana Silva',
    paymentStatus: 'pago',
    groupId: 'group-001',
    createdAt: '2024-01-22T10:00:00Z',
    updatedAt: '2024-01-22T10:00:00Z'
  },
  // Participantes do Grupo 2
  {
    id: 'enrollment-group-002-student-004',
    studentId: 'student-004',
    mentoringId: 'catalog-group-002',
    mentoring: mockGroupMentoringCatalogs[1],
    status: 'ativa',
    enrollmentDate: '2024-02-05T10:00:00Z',
    startDate: '2024-02-10T10:00:00Z',
    endDate: '2024-04-10T10:00:00Z',
    sessionsUsed: 1,
    totalSessions: 6,
    responsibleMentor: 'Carlos Mendes',
    paymentStatus: 'pago',
    groupId: 'group-002',
    createdAt: '2024-02-05T10:00:00Z',
    updatedAt: '2024-02-05T10:00:00Z'
  },
  {
    id: 'enrollment-group-002-student-005',
    studentId: 'student-005',
    mentoringId: 'catalog-group-002',
    mentoring: mockGroupMentoringCatalogs[1],
    status: 'ativa',
    enrollmentDate: '2024-02-05T10:00:00Z',
    startDate: '2024-02-10T10:00:00Z',
    endDate: '2024-04-10T10:00:00Z',
    sessionsUsed: 1,
    totalSessions: 6,
    responsibleMentor: 'Carlos Mendes',
    paymentStatus: 'pago',
    groupId: 'group-002',
    createdAt: '2024-02-05T10:00:00Z',
    updatedAt: '2024-02-05T10:00:00Z'
  }
];

// Mock de grupos
export const mockGroupEnrollments: GroupEnrollment[] = [
  {
    id: 'group-001',
    groupName: 'E-commerce Avançado - Turma A',
    mentoring: mockGroupMentoringCatalogs[0],
    status: 'ativa',
    responsibleMentor: 'Ana Silva',
    startDate: '2024-01-25T10:00:00Z',
    endDate: '2024-04-25T10:00:00Z',
    totalSessions: 8,
    participants: mockGroupParticipants.filter(p => p.groupId === 'group-001'),
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z'
  },
  {
    id: 'group-002',
    groupName: 'Gestão de Fornecedores - Turma B',
    mentoring: mockGroupMentoringCatalogs[1],
    status: 'ativa',
    responsibleMentor: 'Carlos Mendes',
    startDate: '2024-02-10T10:00:00Z',
    endDate: '2024-04-10T10:00:00Z',
    totalSessions: 6,
    participants: mockGroupParticipants.filter(p => p.groupId === 'group-002'),
    createdAt: '2024-02-05T10:00:00Z',
    updatedAt: '2024-02-05T10:00:00Z'
  }
];

export { mockGroupParticipants };
