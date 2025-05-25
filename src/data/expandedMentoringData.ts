import { 
  MentoringCatalog, 
  StudentMentoringEnrollment, 
  MentoringSession, 
  MentoringMaterial 
} from '@/types/mentoring.types';

// Catálogos expandidos (sem Premium)
export const expandedMentoringCatalog: MentoringCatalog[] = [
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
    name: 'Análise de Dados Avançada',
    type: 'Individual',
    instructor: 'Pedro Analista',
    durationWeeks: 10,
    numberOfSessions: 12,
    price: 1800,
    description: 'Mentoria individual com análise avançada de dados e BI',
    active: true,
    createdAt: '2024-02-01T09:00:00Z',
    updatedAt: '2024-02-01T09:00:00Z'
  },
  {
    id: 'catalog-4',
    name: 'Dropshipping Estratégico',
    type: 'Individual',
    instructor: 'Ana Vendedora',
    durationWeeks: 4,
    numberOfSessions: 6,
    price: 600,
    description: 'Aprenda dropshipping com estratégias comprovadas',
    active: true,
    createdAt: '2024-02-10T15:00:00Z',
    updatedAt: '2024-02-10T15:00:00Z'
  },
  {
    id: 'catalog-5',
    name: 'Automação de Vendas',
    type: 'Grupo',
    instructor: 'Carlos Automação',
    durationWeeks: 10,
    numberOfSessions: 15,
    price: 1500,
    description: 'Domine ferramentas de automação para vendas online',
    active: true,
    createdAt: '2024-02-15T11:00:00Z',
    updatedAt: '2024-02-15T11:00:00Z'
  }
];

// Inscrições expandidas para múltiplos usuários (ajustando referências)
export const expandedStudentEnrollments: StudentMentoringEnrollment[] = [
  // Usuário 1 (user-1)
  {
    id: 'enrollment-1',
    studentId: 'user-1',
    mentoringId: 'catalog-1',
    mentoring: expandedMentoringCatalog[0],
    status: 'ativa',
    startDate: '2024-03-01T10:00:00Z',
    endDate: '2024-04-26T10:00:00Z',
    sessionsUsed: 3,
    totalSessions: 8,
    responsibleMentor: 'João Mentor',
    observations: 'Aluno muito dedicado, progresso excelente',
    extensions: [],
    hasExtension: false,
    createdAt: '2024-02-25T15:00:00Z',
    updatedAt: '2024-03-15T10:00:00Z'
  },
  {
    id: 'enrollment-2',
    studentId: 'user-1',
    mentoringId: 'catalog-3',
    mentoring: expandedMentoringCatalog[2],
    status: 'pausada',
    startDate: '2024-02-01T09:00:00Z',
    endDate: '2024-04-25T09:00:00Z',
    originalEndDate: '2024-03-25T09:00:00Z',
    sessionsUsed: 6,
    totalSessions: 12,
    responsibleMentor: 'Pedro Analista',
    observations: 'Pausada por solicitação do aluno para reorganização de agenda',
    extensions: [
      {
        id: 'ext-1',
        enrollmentId: 'enrollment-2',
        extensionMonths: 1,
        appliedDate: '2024-03-20T09:00:00Z',
        notes: 'Extensão concedida devido a problemas de agenda do aluno',
        adminId: 'admin-1',
        createdAt: '2024-03-20T09:00:00Z'
      }
    ],
    hasExtension: true,
    createdAt: '2024-01-25T16:00:00Z',
    updatedAt: '2024-03-01T09:00:00Z'
  },
  
  // Usuário 2 (user-2)
  {
    id: 'enrollment-3',
    studentId: 'user-2',
    mentoringId: 'catalog-2',
    mentoring: expandedMentoringCatalog[1],
    status: 'ativa',
    startDate: '2024-03-15T14:00:00Z',
    endDate: '2024-04-26T14:00:00Z',
    sessionsUsed: 6,
    totalSessions: 12,
    responsibleMentor: 'Maria Consultora',
    observations: 'Participação ativa no grupo, excelente colaboração',
    extensions: [],
    hasExtension: false,
    createdAt: '2024-03-10T11:00:00Z',
    updatedAt: '2024-03-20T14:00:00Z'
  },
  {
    id: 'enrollment-4',
    studentId: 'user-2',
    mentoringId: 'catalog-4',
    mentoring: expandedMentoringCatalog[3],
    status: 'concluida',
    startDate: '2024-01-15T10:00:00Z',
    endDate: '2024-02-12T10:00:00Z',
    sessionsUsed: 6,
    totalSessions: 6,
    responsibleMentor: 'Ana Vendedora',
    observations: 'Mentoria concluída com sucesso, aluno implementou estratégias',
    extensions: [],
    hasExtension: false,
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-02-12T10:00:00Z'
  },
  
  // Usuário 3 (user-3)
  {
    id: 'enrollment-5',
    studentId: 'user-3',
    mentoringId: 'catalog-5',
    mentoring: expandedMentoringCatalog[4],
    status: 'ativa',
    startDate: '2024-03-01T16:00:00Z',
    endDate: '2024-05-10T16:00:00Z',
    sessionsUsed: 2,
    totalSessions: 15,
    responsibleMentor: 'Carlos Automação',
    observations: 'Iniciando jornada de automação, muito entusiasmado',
    extensions: [],
    hasExtension: false,
    createdAt: '2024-02-25T14:00:00Z',
    updatedAt: '2024-03-08T16:00:00Z'
  },
  
  // Usuário 4 (user-4) - Inscrição expirada
  {
    id: 'enrollment-6',
    studentId: 'user-4',
    mentoringId: 'catalog-1',
    mentoring: expandedMentoringCatalog[0],
    status: 'cancelada',
    startDate: '2024-01-01T10:00:00Z',
    endDate: '2024-02-26T10:00:00Z',
    sessionsUsed: 2,
    totalSessions: 8,
    responsibleMentor: 'João Mentor',
    observations: 'Cancelada por incompatibilidade de horários',
    extensions: [],
    hasExtension: false,
    createdAt: '2023-12-20T15:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  }
];

// Sessões expandidas
export const expandedMentoringSessions: MentoringSession[] = [
  // Sessões para enrollment-1 (user-1)
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
    recordingLink: 'https://drive.google.com/file/recording-2',
    status: 'realizada',
    mentorNotes: 'Revisão de conceitos e aplicação prática',
    studentNotes: 'Consegui entender melhor as estratégias de SEO',
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
  },
  
  // Sessões para enrollment-3 (user-2)
  {
    id: 'session-4',
    enrollmentId: 'enrollment-3',
    type: 'grupo',
    title: 'Introdução ao Marketing Digital',
    scheduledDate: '2024-03-16T14:00:00Z',
    durationMinutes: 90,
    accessLink: 'https://meet.google.com/group-session-1',
    recordingLink: 'https://drive.google.com/file/group-recording-1',
    status: 'realizada',
    mentorNotes: 'Grupo muito participativo, ótima dinâmica',
    createdAt: '2024-03-15T14:00:00Z',
    updatedAt: '2024-03-16T15:30:00Z'
  },
  {
    id: 'session-5',
    enrollmentId: 'enrollment-3',
    type: 'grupo',
    title: 'Growth Hacking Avançado',
    scheduledDate: '2024-03-28T14:00:00Z',
    durationMinutes: 90,
    accessLink: 'https://meet.google.com/group-session-2',
    status: 'agendada',
    createdAt: '2024-03-20T14:00:00Z',
    updatedAt: '2024-03-20T14:00:00Z'
  },
  
  // Sessões para enrollment-5 (user-3)
  {
    id: 'session-6',
    enrollmentId: 'enrollment-5',
    type: 'grupo',
    title: 'Fundamentos da Automação',
    scheduledDate: '2024-03-05T16:00:00Z',
    durationMinutes: 120,
    accessLink: 'https://meet.google.com/automation-1',
    recordingLink: 'https://drive.google.com/file/automation-1',
    status: 'realizada',
    mentorNotes: 'Introdução bem aceita pelo grupo',
    createdAt: '2024-03-01T16:00:00Z',
    updatedAt: '2024-03-05T18:00:00Z'
  }
];

// Materiais expandidos
export const expandedMentoringMaterials: MentoringMaterial[] = [
  // Materiais para enrollment-1
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
  
  // Materiais para enrollment-3
  {
    id: 'material-3',
    sessionId: 'session-4',
    enrollmentId: 'enrollment-3',
    fileName: 'Marketing_Digital_Fundamentos.pptx',
    storagePath: '/materials/enrollment-3/session-4/presentation.pptx',
    fileType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    sizeMB: 5.8,
    uploaderId: 'mentor-2',
    uploaderType: 'mentor',
    description: 'Apresentação sobre fundamentos do marketing digital',
    tags: ['marketing', 'digital', 'apresentação'],
    createdAt: '2024-03-16T15:00:00Z'
  },
  {
    id: 'material-4',
    enrollmentId: 'enrollment-3',
    fileName: 'Checklist_Growth_Hacking.pdf',
    storagePath: '/materials/enrollment-3/checklist.pdf',
    fileType: 'application/pdf',
    sizeMB: 0.8,
    uploaderId: 'mentor-2',
    uploaderType: 'mentor',
    description: 'Checklist completo para estratégias de growth hacking',
    tags: ['growth-hacking', 'checklist', 'estratégias'],
    createdAt: '2024-03-20T16:00:00Z'
  },
  
  // Materiais para enrollment-5
  {
    id: 'material-5',
    sessionId: 'session-6',
    enrollmentId: 'enrollment-5',
    fileName: 'Automacao_Vendas_Guia.pdf',
    storagePath: '/materials/enrollment-5/session-6/automation-guide.pdf',
    fileType: 'application/pdf',
    sizeMB: 3.2,
    uploaderId: 'mentor-3',
    uploaderType: 'mentor',
    description: 'Guia completo sobre automação de vendas',
    tags: ['automação', 'vendas', 'guia'],
    createdAt: '2024-03-05T18:30:00Z'
  }
];
