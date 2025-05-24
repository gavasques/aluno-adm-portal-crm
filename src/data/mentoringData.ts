
import { 
  MentoringCatalog, 
  StudentMentoringEnrollment, 
  MentoringSession, 
  MentoringMaterial 
} from '@/types/mentoring.types';

// Mock Mentoring Catalogs
export const mockMentoringCatalog: MentoringCatalog[] = [
  {
    id: 'catalog-1',
    name: 'E-commerce Avançado',
    type: 'Individual',
    instructor: 'João Mentor',
    durationWeeks: 8,
    numberOfSessions: 8,
    price: 1200,
    description: 'Mentoria completa para dominar estratégias avançadas de e-commerce',
    active: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'catalog-2',
    name: 'Marketing Digital Intensivo',
    type: 'Grupo',
    instructor: 'Maria Consultora',
    durationWeeks: 6,
    numberOfSessions: 12,
    price: 800,
    description: 'Mentoria em grupo focada em marketing digital e growth hacking',
    active: true,
    createdAt: '2024-01-20T14:00:00Z',
    updatedAt: '2024-01-20T14:00:00Z'
  },
  {
    id: 'catalog-3',
    name: 'Análise de Dados Premium',
    type: 'Premium',
    instructor: 'Pedro Analista',
    durationWeeks: 12,
    numberOfSessions: 16,
    price: 2500,
    description: 'Mentoria premium com análise avançada de dados e BI',
    active: true,
    createdAt: '2024-02-01T09:00:00Z',
    updatedAt: '2024-02-01T09:00:00Z'
  }
];

// Mock Student Enrollments
export const mockStudentEnrollments: StudentMentoringEnrollment[] = [
  {
    id: 'enrollment-1',
    studentId: 'user-1',
    mentoringId: 'catalog-1',
    mentoring: mockMentoringCatalog[0],
    status: 'ativa',
    startDate: '2024-03-01T10:00:00Z',
    endDate: '2024-04-26T10:00:00Z',
    sessionsUsed: 3,
    totalSessions: 8,
    responsibleMentor: 'João Mentor',
    observations: 'Aluno muito dedicado, progresso excelente',
    createdAt: '2024-02-25T15:00:00Z',
    updatedAt: '2024-03-15T10:00:00Z'
  },
  {
    id: 'enrollment-2',
    studentId: 'user-2',
    mentoringId: 'catalog-2',
    mentoring: mockMentoringCatalog[1],
    status: 'ativa',
    startDate: '2024-03-15T14:00:00Z',
    endDate: '2024-04-26T14:00:00Z',
    sessionsUsed: 6,
    totalSessions: 12,
    responsibleMentor: 'Maria Consultora',
    observations: 'Participação ativa no grupo',
    createdAt: '2024-03-10T11:00:00Z',
    updatedAt: '2024-03-20T14:00:00Z'
  },
  {
    id: 'enrollment-3',
    studentId: 'user-1',
    mentoringId: 'catalog-3',
    mentoring: mockMentoringCatalog[2],
    status: 'pausada',
    startDate: '2024-02-01T09:00:00Z',
    endDate: '2024-04-25T09:00:00Z',
    sessionsUsed: 8,
    totalSessions: 16,
    responsibleMentor: 'Pedro Analista',
    observations: 'Pausada por solicitação do aluno',
    createdAt: '2024-01-25T16:00:00Z',
    updatedAt: '2024-03-01T09:00:00Z'
  }
];

// Mock Mentoring Sessions
export const mockMentoringSessions: MentoringSession[] = [
  {
    id: 'session-1',
    enrollmentId: 'enrollment-1',
    type: 'individual',
    title: 'Fundamentos do E-commerce',
    scheduledDate: '2024-03-05T10:00:00Z',
    durationMinutes: 60,
    accessLink: 'https://meet.google.com/abc-defg-hij',
    recordingLink: 'https://drive.google.com/file/recording-1',
    status: 'realizada',
    mentorNotes: 'Ótima sessão, aluno muito engajado',
    studentNotes: 'Aprendi muito sobre funis de venda',
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-03-05T11:00:00Z'
  },
  {
    id: 'session-2',
    enrollmentId: 'enrollment-1',
    type: 'individual',
    title: 'Estratégias de Marketing Digital',
    scheduledDate: '2024-03-12T10:00:00Z',
    durationMinutes: 60,
    accessLink: 'https://meet.google.com/klm-nopq-rst',
    status: 'realizada',
    mentorNotes: 'Revisão de conceitos e aplicação prática',
    createdAt: '2024-03-08T10:00:00Z',
    updatedAt: '2024-03-12T11:00:00Z'
  },
  {
    id: 'session-3',
    enrollmentId: 'enrollment-1',
    type: 'individual',
    title: 'Análise de Métricas',
    scheduledDate: '2024-03-25T10:00:00Z',
    durationMinutes: 60,
    accessLink: 'https://meet.google.com/uvw-xyz-123',
    status: 'agendada',
    createdAt: '2024-03-20T10:00:00Z',
    updatedAt: '2024-03-20T10:00:00Z'
  }
];

// Mock Mentoring Materials
export const mockMentoringMaterials: MentoringMaterial[] = [
  {
    id: 'material-1',
    sessionId: 'session-1',
    enrollmentId: 'enrollment-1',
    fileName: 'Guia_Fundamentos_Ecommerce.pdf',
    storagePath: '/materials/enrollment-1/session-1/guide.pdf',
    fileType: 'application/pdf',
    sizeMB: 2.5,
    uploaderId: 'mentor-1',
    uploaderType: 'mentor',
    description: 'Material de apoio sobre fundamentos do e-commerce',
    tags: ['fundamentos', 'e-commerce', 'guia'],
    createdAt: '2024-03-05T11:30:00Z'
  },
  {
    id: 'material-2',
    enrollmentId: 'enrollment-1',
    fileName: 'Planilha_Metricas_Template.xlsx',
    storagePath: '/materials/enrollment-1/template-metricas.xlsx',
    fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    sizeMB: 1.2,
    uploaderId: 'mentor-1',
    uploaderType: 'mentor',
    description: 'Template para acompanhamento de métricas',
    tags: ['métricas', 'template', 'análise'],
    createdAt: '2024-03-10T14:00:00Z'
  },
  {
    id: 'material-3',
    sessionId: 'session-2',
    enrollmentId: 'enrollment-1',
    fileName: 'Estrategias_Marketing_Digital.pptx',
    storagePath: '/materials/enrollment-1/session-2/presentation.pptx',
    fileType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    sizeMB: 5.8,
    uploaderId: 'mentor-1',
    uploaderType: 'mentor',
    description: 'Apresentação sobre estratégias de marketing digital',
    tags: ['marketing', 'digital', 'estratégias'],
    createdAt: '2024-03-12T10:30:00Z'
  }
];

// Helper functions to get data
export const getStudentEnrollments = (studentId: string): StudentMentoringEnrollment[] => {
  return mockStudentEnrollments.filter(enrollment => enrollment.studentId === studentId);
};

export const getSessionsByEnrollment = (enrollmentId: string): MentoringSession[] => {
  return mockMentoringSessions.filter(session => session.enrollmentId === enrollmentId);
};

export const getMaterialsByEnrollment = (enrollmentId: string): MentoringMaterial[] => {
  return mockMentoringMaterials.filter(material => material.enrollmentId === enrollmentId);
};

export const getUpcomingSessions = (studentId: string): MentoringSession[] => {
  const studentEnrollments = getStudentEnrollments(studentId);
  const enrollmentIds = studentEnrollments.map(e => e.id);
  
  return mockMentoringSessions.filter(session => 
    enrollmentIds.includes(session.enrollmentId) && 
    session.status === 'agendada' &&
    new Date(session.scheduledDate) > new Date()
  ).sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());
};
