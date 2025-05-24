
import { MentoringCatalog, StudentMentoringEnrollment, MentoringSession, MentoringMaterial, MentoringStats } from '@/types/mentoring.types';

export const mockMentoringCatalog: MentoringCatalog[] = [
  {
    id: '1',
    name: 'Mentoria Individual E-commerce',
    type: 'Individual',
    instructor: 'Ana Silva',
    durationWeeks: 8,
    numberOfSessions: 8,
    price: 1200.00,
    description: 'Mentoria individual focada em estratégias de e-commerce e marketplace',
    active: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Mentoria em Grupo - Marketing Digital',
    type: 'Grupo',
    instructor: 'Carlos Oliveira',
    durationWeeks: 6,
    numberOfSessions: 6,
    price: 600.00,
    description: 'Mentoria em grupo para aprender marketing digital e vendas online',
    active: true,
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-10T10:00:00Z'
  },
  {
    id: '3',
    name: 'Mentoria Premium - Negócios Digitais',
    type: 'Premium',
    instructor: 'Maria Santos',
    durationWeeks: 12,
    numberOfSessions: 12,
    price: 2500.00,
    description: 'Mentoria premium com acompanhamento exclusivo para criação de negócios digitais',
    active: true,
    createdAt: '2024-01-05T10:00:00Z',
    updatedAt: '2024-01-05T10:00:00Z'
  },
  {
    id: '4',
    name: 'Mentoria Grupo - Logística',
    type: 'Grupo',
    instructor: 'João Costa',
    durationWeeks: 4,
    numberOfSessions: 4,
    price: 400.00,
    description: 'Mentoria em grupo focada em logística e fulfillment para e-commerce',
    active: false,
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z'
  }
];

export const mockStudentEnrollments: StudentMentoringEnrollment[] = [
  {
    id: 'enr-1',
    studentId: 'user-1',
    mentoringId: '1',
    mentoring: mockMentoringCatalog[0],
    status: 'ativa',
    startDate: '2024-02-01',
    endDate: '2024-03-28',
    sessionsUsed: 3,
    totalSessions: 8,
    responsibleMentor: 'Ana Silva',
    observations: 'Aluno muito dedicado, progresso excelente',
    createdAt: '2024-01-25T10:00:00Z',
    updatedAt: '2024-02-15T10:00:00Z'
  },
  {
    id: 'enr-2',
    studentId: 'user-1',
    mentoringId: '2',
    mentoring: mockMentoringCatalog[1],
    status: 'ativa',
    startDate: '2024-02-15',
    endDate: '2024-03-29',
    sessionsUsed: 2,
    totalSessions: 6,
    responsibleMentor: 'Carlos Oliveira',
    observations: 'Participa ativamente das discussões em grupo',
    createdAt: '2024-02-10T10:00:00Z',
    updatedAt: '2024-02-20T10:00:00Z'
  },
  {
    id: 'enr-3',
    studentId: 'user-2',
    mentoringId: '3',
    mentoring: mockMentoringCatalog[2],
    status: 'concluida',
    startDate: '2024-01-01',
    endDate: '2024-03-24',
    sessionsUsed: 12,
    totalSessions: 12,
    responsibleMentor: 'Maria Santos',
    observations: 'Mentoria concluída com sucesso, excelente aproveitamento',
    createdAt: '2023-12-20T10:00:00Z',
    updatedAt: '2024-03-24T10:00:00Z'
  }
];

export const mockMentoringSessions: MentoringSession[] = [
  {
    id: 'sess-1',
    enrollmentId: 'enr-1',
    type: 'individual',
    title: 'Análise de Mercado e Concorrência',
    scheduledDate: '2024-02-05T14:00:00Z',
    durationMinutes: 60,
    accessLink: 'https://meet.google.com/abc-defg-hij',
    recordingLink: 'https://drive.google.com/recording1',
    status: 'realizada',
    mentorNotes: 'Sessão produtiva, aluno demonstrou boa compreensão',
    studentNotes: 'Aprendi muito sobre análise de concorrência',
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-02-05T15:30:00Z'
  },
  {
    id: 'sess-2',
    enrollmentId: 'enr-1',
    type: 'individual',
    title: 'Estratégias de Precificação',
    scheduledDate: '2024-02-12T14:00:00Z',
    durationMinutes: 60,
    accessLink: 'https://meet.google.com/xyz-1234-abc',
    recordingLink: 'https://drive.google.com/recording2',
    status: 'realizada',
    mentorNotes: 'Foco em precificação dinâmica e margem de lucro',
    studentNotes: 'Conceitos importantes sobre pricing',
    createdAt: '2024-02-08T10:00:00Z',
    updatedAt: '2024-02-12T15:15:00Z'
  },
  {
    id: 'sess-3',
    enrollmentId: 'enr-1',
    type: 'individual',
    title: 'Marketing Digital e Funis de Vendas',
    scheduledDate: '2024-02-19T14:00:00Z',
    durationMinutes: 60,
    accessLink: 'https://meet.google.com/fuv-7890-def',
    status: 'realizada',
    mentorNotes: 'Aluno criou seu primeiro funil durante a sessão',
    studentNotes: 'Prática com ferramentas de automação',
    createdAt: '2024-02-15T10:00:00Z',
    updatedAt: '2024-02-19T15:45:00Z'
  },
  {
    id: 'sess-4',
    enrollmentId: 'enr-1',
    type: 'individual',
    title: 'Otimização de Conversão',
    scheduledDate: '2024-02-26T14:00:00Z',
    durationMinutes: 60,
    accessLink: 'https://meet.google.com/ghi-1111-jkl',
    status: 'agendada',
    createdAt: '2024-02-22T10:00:00Z',
    updatedAt: '2024-02-22T10:00:00Z'
  },
  {
    id: 'sess-5',
    enrollmentId: 'enr-2',
    type: 'grupo',
    title: 'Workshop - Criação de Conteúdo para Redes Sociais',
    scheduledDate: '2024-02-17T10:00:00Z',
    durationMinutes: 90,
    accessLink: 'https://meet.google.com/grupo-123-abc',
    recordingLink: 'https://drive.google.com/grupo-recording1',
    status: 'realizada',
    mentorNotes: 'Workshop interativo, boa participação de todos',
    createdAt: '2024-02-14T10:00:00Z',
    updatedAt: '2024-02-17T11:45:00Z'
  },
  {
    id: 'sess-6',
    enrollmentId: 'enr-2',
    type: 'grupo',
    title: 'Estratégias de SEO para E-commerce',
    scheduledDate: '2024-02-24T10:00:00Z',
    durationMinutes: 90,
    accessLink: 'https://meet.google.com/grupo-456-def',
    recordingLink: 'https://drive.google.com/grupo-recording2',
    status: 'realizada',
    mentorNotes: 'Foco em SEO técnico e otimização de produtos',
    createdAt: '2024-02-21T10:00:00Z',
    updatedAt: '2024-02-24T11:30:00Z'
  }
];

export const mockMentoringMaterials: MentoringMaterial[] = [
  {
    id: 'mat-1',
    sessionId: 'sess-1',
    enrollmentId: 'enr-1',
    fileName: 'Guia_Analise_Mercado.pdf',
    storagePath: 'mentorias/enr-1/sess-1/guia-analise-mercado.pdf',
    fileType: 'application/pdf',
    sizeMB: 2.5,
    uploaderId: 'mentor-1',
    uploaderType: 'mentor',
    description: 'Guia completo para análise de mercado e concorrência',
    tags: ['analise', 'mercado', 'concorrencia'],
    createdAt: '2024-02-05T15:00:00Z'
  },
  {
    id: 'mat-2',
    sessionId: 'sess-1',
    enrollmentId: 'enr-1',
    fileName: 'Template_Pesquisa_Concorrencia.xlsx',
    storagePath: 'mentorias/enr-1/sess-1/template-pesquisa.xlsx',
    fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    sizeMB: 0.8,
    uploaderId: 'mentor-1',
    uploaderType: 'mentor',
    description: 'Template para pesquisa de concorrência',
    tags: ['template', 'pesquisa', 'excel'],
    createdAt: '2024-02-05T15:30:00Z'
  },
  {
    id: 'mat-3',
    sessionId: 'sess-2',
    enrollmentId: 'enr-1',
    fileName: 'Calculadora_Precificacao.xlsx',
    storagePath: 'mentorias/enr-1/sess-2/calculadora-precificacao.xlsx',
    fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    sizeMB: 1.2,
    uploaderId: 'mentor-1',
    uploaderType: 'mentor',
    description: 'Calculadora automática para precificação de produtos',
    tags: ['calculadora', 'precificacao', 'margem'],
    createdAt: '2024-02-12T15:45:00Z'
  },
  {
    id: 'mat-4',
    enrollmentId: 'enr-1',
    fileName: 'Meu_Plano_Negocio.docx',
    storagePath: 'mentorias/enr-1/plano-negocio-aluno.docx',
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    sizeMB: 1.8,
    uploaderId: 'user-1',
    uploaderType: 'aluno',
    description: 'Plano de negócio desenvolvido pelo aluno',
    tags: ['plano', 'negocio', 'aluno'],
    createdAt: '2024-02-18T09:30:00Z'
  },
  {
    id: 'mat-5',
    sessionId: 'sess-5',
    enrollmentId: 'enr-2',
    fileName: 'Cronograma_Conteudo_Social.pdf',
    storagePath: 'mentorias/enr-2/sess-5/cronograma-conteudo.pdf',
    fileType: 'application/pdf',
    sizeMB: 3.2,
    uploaderId: 'mentor-2',
    uploaderType: 'mentor',
    description: 'Cronograma de conteúdo para redes sociais - 3 meses',
    tags: ['cronograma', 'conteudo', 'redes-sociais'],
    createdAt: '2024-02-17T12:00:00Z'
  }
];

export const mockMentoringStats: MentoringStats = {
  totalEnrollments: 45,
  activeEnrollments: 32,
  completedSessions: 156,
  upcomingSessions: 28,
  totalMaterials: 89,
  averageRating: 4.7
};

// Funções helper para filtrar dados por usuário
export const getStudentEnrollments = (studentId: string): StudentMentoringEnrollment[] => {
  return mockStudentEnrollments.filter(enrollment => enrollment.studentId === studentId);
};

export const getSessionsByEnrollment = (enrollmentId: string): MentoringSession[] => {
  return mockMentoringSessions.filter(session => session.enrollmentId === enrollmentId);
};

export const getMaterialsByEnrollment = (enrollmentId: string): MentoringMaterial[] => {
  return mockMentoringMaterials.filter(material => material.enrollmentId === enrollmentId);
};

export const getMaterialsBySession = (sessionId: string): MentoringMaterial[] => {
  return mockMentoringMaterials.filter(material => material.sessionId === sessionId);
};

export const getUpcomingSessions = (studentId: string): MentoringSession[] => {
  const studentEnrollments = getStudentEnrollments(studentId);
  const enrollmentIds = studentEnrollments.map(e => e.id);
  
  return mockMentoringSessions.filter(session => 
    enrollmentIds.includes(session.enrollmentId) && 
    session.status === 'agendada' &&
    new Date(session.scheduledDate) >= new Date()
  );
};
