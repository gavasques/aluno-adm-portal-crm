import { 
  MentoringCatalog, 
  StudentMentoringEnrollment, 
  MentoringSession, 
  MentoringMaterial,
  CreateMentoringCatalogData,
  CreateSessionData,
  UpdateSessionData,
  CreateExtensionData,
  EnrollmentProgress
} from '@/types/mentoring.types';

const initialCatalogs: MentoringCatalog[] = [
  {
    id: 'catalog-1',
    name: 'Mentoria de Carreira',
    type: 'Individual',
    instructor: 'João Silva',
    durationMonths: 2, // Mudado de durationWeeks para durationMonths
    numberOfSessions: 8,
    totalSessions: 8,
    price: 499.99,
    description: 'Mentoria individual para te ajudar a encontrar o caminho certo na sua carreira.',
    tags: ['carreira', 'desenvolvimento pessoal'],
    active: true,
    status: 'Ativa',
    createdAt: '2024-05-01T10:00:00Z',
    updatedAt: '2024-05-01T10:00:00Z',
    extensions: [
      {
        id: 'ext-1',
        months: 1,
        price: 99.99,
        description: 'Extensão de 1 mês para continuar recebendo suporte.'
      },
      {
        id: 'ext-2',
        months: 3,
        price: 249.99,
        description: 'Extensão de 3 meses para aprofundar seus conhecimentos.'
      }
    ]
  },
  {
    id: 'catalog-2',
    name: 'Grupo de Estudos - React Avançado',
    type: 'Grupo',
    instructor: 'Maria Oliveira',
    durationMonths: 3, // Mudado de durationWeeks para durationMonths
    numberOfSessions: 12,
    totalSessions: 12,
    price: 299.99,
    description: 'Grupo de estudos para quem quer dominar React e suas ferramentas mais avançadas.',
    tags: ['react', 'javascript', 'frontend'],
    active: true,
    status: 'Ativa',
    createdAt: '2024-05-01T10:00:00Z',
    updatedAt: '2024-05-01T10:00:00Z'
  },
  {
    id: 'catalog-3',
    name: 'Mentoria de Produtividade',
    type: 'Individual',
    instructor: 'Carlos Pereira',
    durationMonths: 2, // Mudado de durationWeeks para durationMonths
    numberOfSessions: 6,
    totalSessions: 6,
    price: 399.99,
    description: 'Mentoria individual focada em aumentar sua produtividade e organização.',
    tags: ['produtividade', 'organização', 'gestão de tempo'],
    active: false,
    status: 'Inativa',
    createdAt: '2024-05-01T10:00:00Z',
    updatedAt: '2024-05-01T10:00:00Z'
  },
  {
    id: 'catalog-4',
    name: 'Bootcamp de Data Science',
    type: 'Grupo',
    instructor: 'Ana Souza',
    durationMonths: 4, // Mudado de durationWeeks para durationMonths
    numberOfSessions: 32,
    totalSessions: 32,
    price: 799.99,
    description: 'Bootcamp intensivo para te transformar em um cientista de dados completo.',
    tags: ['data science', 'machine learning', 'python'],
    active: true,
    status: 'Ativa',
    createdAt: '2024-05-01T10:00:00Z',
    updatedAt: '2024-05-01T10:00:00Z'
  },
  {
    id: 'catalog-5',
    name: 'Mentoria de Marketing Digital',
    type: 'Individual',
    instructor: 'Mariana Costa',
    durationMonths: 3, // Mudado de durationWeeks para durationMonths
    numberOfSessions: 10,
    totalSessions: 10,
    price: 599.99,
    description: 'Mentoria individual para você dominar o marketing digital e alavancar seus resultados.',
    tags: ['marketing digital', 'seo', 'social media'],
    active: true,
    status: 'Ativa',
    createdAt: '2024-05-01T10:00:00Z',
    updatedAt: '2024-05-01T10:00:00Z'
  },
  {
    id: 'catalog-6',
    name: 'Curso de Design Thinking',
    type: 'Grupo',
    instructor: 'Roberto Almeida',
    durationMonths: 1, // Mudado de durationWeeks para durationMonths
    numberOfSessions: 8,
    totalSessions: 8,
    price: 199.99,
    description: 'Curso prático de Design Thinking para você resolver problemas de forma criativa e inovadora.',
    tags: ['design thinking', 'inovação', 'criatividade'],
    active: true,
    status: 'Ativa',
    createdAt: '2024-05-01T10:00:00Z',
    updatedAt: '2024-05-01T10:00:00Z'
  }
];

const initialEnrollments: StudentMentoringEnrollment[] = [
  {
    id: 'enrollment-1',
    studentId: 'student-1',
    mentoringId: 'catalog-1',
    mentoring: initialCatalogs[0],
    status: 'ativa',
    enrollmentDate: '2024-05-15T10:00:00Z',
    startDate: '2024-05-22T10:00:00Z',
    endDate: '2024-07-22T10:00:00Z',
    originalEndDate: '2024-07-22T10:00:00Z',
    sessionsUsed: 3,
    totalSessions: 8,
    responsibleMentor: 'João Silva',
    paymentStatus: 'pago',
    observations: 'Aluno dedicado e com grande potencial.',
    createdAt: '2024-05-15T10:00:00Z',
    updatedAt: '2024-05-15T10:00:00Z'
  },
  {
    id: 'enrollment-2',
    studentId: 'student-2',
    mentoringId: 'catalog-2',
    mentoring: initialCatalogs[1],
    status: 'concluida',
    enrollmentDate: '2024-05-01T10:00:00Z',
    startDate: '2024-05-08T10:00:00Z',
    endDate: '2024-08-08T10:00:00Z',
    originalEndDate: '2024-08-08T10:00:00Z',
    sessionsUsed: 12,
    totalSessions: 12,
    responsibleMentor: 'Maria Oliveira',
    paymentStatus: 'pago',
    observations: 'Turma muito engajada e com ótimos resultados.',
    createdAt: '2024-05-01T10:00:00Z',
    updatedAt: '2024-05-01T10:00:00Z'
  },
  {
    id: 'enrollment-3',
    studentId: 'student-3',
    mentoringId: 'catalog-3',
    mentoring: initialCatalogs[2],
    status: 'pausada',
    enrollmentDate: '2024-04-20T10:00:00Z',
    startDate: '2024-04-27T10:00:00Z',
    endDate: '2024-06-27T10:00:00Z',
    originalEndDate: '2024-06-27T10:00:00Z',
    sessionsUsed: 2,
    totalSessions: 6,
    responsibleMentor: 'Carlos Pereira',
    paymentStatus: 'pendente',
    observations: 'Aluno solicitou pausa por motivos pessoais.',
    createdAt: '2024-04-20T10:00:00Z',
    updatedAt: '2024-04-20T10:00:00Z'
  },
  {
    id: 'enrollment-4',
    studentId: 'student-4',
    mentoringId: 'catalog-4',
    mentoring: initialCatalogs[3],
    status: 'ativa',
    enrollmentDate: '2024-05-10T10:00:00Z',
    startDate: '2024-05-17T10:00:00Z',
    endDate: '2024-09-17T10:00:00Z',
    originalEndDate: '2024-09-17T10:00:00Z',
    sessionsUsed: 10,
    totalSessions: 32,
    responsibleMentor: 'Ana Souza',
    paymentStatus: 'pago',
    observations: 'Bootcamp com alta demanda e alunos muito dedicados.',
    createdAt: '2024-05-10T10:00:00Z',
    updatedAt: '2024-05-10T10:00:00Z'
  },
  {
    id: 'enrollment-5',
    studentId: 'student-5',
    mentoringId: 'catalog-5',
    mentoring: initialCatalogs[4],
    status: 'ativa',
    enrollmentDate: '2024-05-05T10:00:00Z',
    startDate: '2024-05-12T10:00:00Z',
    endDate: '2024-07-12T10:00:00Z',
    originalEndDate: '2024-07-12T10:00:00Z',
    sessionsUsed: 5,
    totalSessions: 10,
    responsibleMentor: 'Mariana Costa',
    paymentStatus: 'pago',
    observations: 'Aluno com grande interesse em SEO e marketing de conteúdo.',
    createdAt: '2024-05-05T10:00:00Z',
    updatedAt: '2024-05-05T10:00:00Z'
  },
  {
    id: 'enrollment-6',
    studentId: 'student-6',
    mentoringId: 'catalog-6',
    mentoring: initialCatalogs[5],
    status: 'concluida',
    enrollmentDate: '2024-04-15T10:00:00Z',
    startDate: '2024-04-22T10:00:00Z',
    endDate: '2024-05-22T10:00:00Z',
    originalEndDate: '2024-05-22T10:00:00Z',
    sessionsUsed: 8,
    totalSessions: 8,
    responsibleMentor: 'Roberto Almeida',
    paymentStatus: 'pago',
    observations: 'Curso com feedback muito positivo dos participantes.',
    createdAt: '2024-04-15T10:00:00Z',
    updatedAt: '2024-04-15T10:00:00Z'
  }
];

const initialSessions: MentoringSession[] = [
  {
    id: 'session-1',
    enrollmentId: 'enrollment-1',
    sessionNumber: 1,
    type: 'individual',
    title: 'Primeiros passos na sua carreira',
    scheduledDate: '2024-05-29T10:00:00Z',
    durationMinutes: 60,
    status: 'agendada',
    calendlyLink: 'https://calendly.com/joaosilva/mentoria',
    meetingLink: 'https://meet.google.com/xyz',
    recordingLink: 'https://youtube.com/xyz',
    mentorNotes: 'Aluno com muitas dúvidas sobre o mercado de trabalho.',
    studentNotes: 'Gostaria de saber mais sobre as áreas em alta.',
    createdAt: '2024-05-22T10:00:00Z',
    updatedAt: '2024-05-22T10:00:00Z'
  },
  {
    id: 'session-2',
    enrollmentId: 'enrollment-1',
    sessionNumber: 2,
    type: 'individual',
    title: 'Definindo seus objetivos de carreira',
    scheduledDate: '2024-06-05T10:00:00Z',
    durationMinutes: 60,
    status: 'agendada',
    calendlyLink: 'https://calendly.com/joaosilva/mentoria',
    meetingLink: 'https://meet.google.com/abc',
    recordingLink: 'https://youtube.com/abc',
    mentorNotes: 'Aluno precisa focar em definir seus objetivos.',
    studentNotes: 'Preciso de ajuda para definir meus objetivos.',
    createdAt: '2024-05-29T10:00:00Z',
    updatedAt: '2024-05-29T10:00:00Z'
  },
  {
    id: 'session-3',
    enrollmentId: 'enrollment-2',
    sessionNumber: 1,
    type: 'grupo',
    title: 'Introdução ao React',
    scheduledDate: '2024-05-15T19:00:00Z',
    durationMinutes: 90,
    status: 'realizada',
    calendlyLink: 'https://calendly.com/mariaoliveira/react',
    meetingLink: 'https://meet.google.com/def',
    recordingLink: 'https://youtube.com/def',
    mentorNotes: 'Turma muito participativa e com bom nível de conhecimento.',
    studentNotes: 'Gostei muito da aula e aprendi bastante.',
    createdAt: '2024-05-08T10:00:00Z',
    updatedAt: '2024-05-08T10:00:00Z'
  },
  {
    id: 'session-4',
    enrollmentId: 'enrollment-4',
    sessionNumber: 1,
    type: 'grupo',
    title: 'Introdução ao Data Science',
    scheduledDate: '2024-05-24T14:00:00Z',
    durationMinutes: 120,
    status: 'realizada',
    calendlyLink: 'https://calendly.com/anasouza/datascience',
    meetingLink: 'https://meet.google.com/ghi',
    recordingLink: 'https://youtube.com/ghi',
    mentorNotes: 'Bootcamp começou com tudo e os alunos estão animados.',
    studentNotes: 'Estou ansioso para aprender mais sobre Data Science.',
    createdAt: '2024-05-17T10:00:00Z',
    updatedAt: '2024-05-17T10:00:00Z'
  }
];

const initialMaterials: MentoringMaterial[] = [
  {
    id: 'material-1',
    sessionId: 'session-1',
    fileName: 'Guia de Carreiras.pdf',
    fileUrl: 'https://example.com/guiadecarreiras.pdf',
    type: 'pdf',
    description: 'Guia completo para te ajudar a escolher a carreira certa.',
    storagePath: '/materiais/guiadecarreiras.pdf',
    fileType: 'application/pdf',
    sizeMB: 2.5,
    uploaderId: 'joaosilva',
    uploaderType: 'mentor',
    tags: ['carreira', 'guia', 'pdf'],
    createdAt: '2024-05-22T10:00:00Z',
    updatedAt: '2024-05-22T10:00:00Z'
  },
  {
    id: 'material-2',
    sessionId: 'session-3',
    fileName: 'Apresentação React Avançado.pptx',
    fileUrl: 'https://example.com/apresentacaoreact.pptx',
    type: 'apresentacao',
    description: 'Apresentação completa sobre React Avançado.',
    storagePath: '/materiais/apresentacaoreact.pptx',
    fileType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    sizeMB: 5.2,
    uploaderId: 'mariaoliveira',
    uploaderType: 'mentor',
    tags: ['react', 'apresentacao', 'powerpoint'],
    createdAt: '2024-05-08T10:00:00Z',
    updatedAt: '2024-05-08T10:00:00Z'
  }
];

export class MentoringDataService {
  private catalogs: MentoringCatalog[] = [];
  private enrollments: StudentMentoringEnrollment[] = [];
  private sessions: MentoringSession[] = [];
  private materials: MentoringMaterial[] = [];

  constructor() {
    this.loadCatalogs();
    this.loadEnrollments();
    this.loadSessions();
    this.loadMaterials();
  }

  // Local Storage Management
  private loadCatalogs() {
    const storedCatalogs = localStorage.getItem('mentoringCatalogs');
    this.catalogs = storedCatalogs ? JSON.parse(storedCatalogs) : initialCatalogs;
  }

  private saveCatalogs() {
    localStorage.setItem('mentoringCatalogs', JSON.stringify(this.catalogs));
  }

  private loadEnrollments() {
    const storedEnrollments = localStorage.getItem('mentoringEnrollments');
    this.enrollments = storedEnrollments ? JSON.parse(storedEnrollments) : initialEnrollments;
  }

  private saveEnrollments() {
    localStorage.setItem('mentoringEnrollments', JSON.stringify(this.enrollments));
  }

  private loadSessions() {
    const storedSessions = localStorage.getItem('mentoringSessions');
    this.sessions = storedSessions ? JSON.parse(storedSessions) : initialSessions;
  }

  private saveSessions() {
    localStorage.setItem('mentoringSessions', JSON.stringify(this.sessions));
  }

  private loadMaterials() {
    const storedMaterials = localStorage.getItem('mentoringMaterials');
    this.materials = storedMaterials ? JSON.parse(storedMaterials) : initialMaterials;
  }

  private saveMaterials() {
    localStorage.setItem('mentoringMaterials', JSON.stringify(this.materials));
  }

  // Catalog Operations
  getCatalogs(): MentoringCatalog[] {
    return this.catalogs;
  }

  createCatalog(data: CreateMentoringCatalogData): MentoringCatalog {
    console.log('💾 MentoringDataService.createCatalog recebendo:', data);
    console.log('📋 Extensões recebidas:', data.extensions);
    
    const newCatalog: MentoringCatalog = {
      id: `catalog-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: data.name,
      type: data.type,
      instructor: data.instructor,
      durationMonths: data.durationMonths, // Mudado de durationWeeks para durationMonths
      numberOfSessions: data.numberOfSessions,
      totalSessions: data.numberOfSessions,
      price: data.price,
      description: data.description,
      tags: [],
      active: data.active || true,
      status: data.status || 'Ativa',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      extensions: data.extensions || []
    };

    console.log('✅ Catálogo criado com extensões:', newCatalog.extensions);
    
    this.catalogs.push(newCatalog);
    this.saveCatalogs();
    return newCatalog;
  }

  updateCatalog(id: string, data: Partial<CreateMentoringCatalogData>): boolean {
    console.log('🔄 MentoringDataService.updateCatalog:', { id, data });
    console.log('📋 Extensões para atualizar:', data.extensions);
    
    const index = this.catalogs.findIndex(catalog => catalog.id === id);
    if (index === -1) return false;

    this.catalogs[index] = {
      ...this.catalogs[index],
      ...data,
      updatedAt: new Date().toISOString(),
      extensions: data.extensions || this.catalogs[index].extensions || []
    };

    console.log('✅ Catálogo atualizado com extensões:', this.catalogs[index].extensions);
    
    this.saveCatalogs();
    return true;
  }

  deleteCatalog(id: string): boolean {
    this.catalogs = this.catalogs.filter(catalog => catalog.id !== id);
    this.saveCatalogs();
    return true;
  }

  // Enrollment Operations
  getEnrollments(): StudentMentoringEnrollment[] {
    return this.enrollments;
  }

  getStudentEnrollments(studentId: string): StudentMentoringEnrollment[] {
    return this.enrollments.filter(enrollment => enrollment.studentId === studentId);
  }

  addExtension(data: CreateExtensionData): boolean {
    const enrollment = this.enrollments.find(e => e.id === data.enrollmentId);
    if (!enrollment) return false;

    const extension = {
      id: `extension-${Date.now()}`,
      enrollmentId: data.enrollmentId,
      extensionMonths: data.extensionMonths,
      appliedDate: new Date().toISOString(),
      notes: data.notes,
      adminId: 'admin-1', // Replace with actual admin ID
      createdAt: new Date().toISOString()
    };

    enrollment.endDate = new Date(new Date(enrollment.endDate).setMonth(new Date(enrollment.endDate).getMonth() + data.extensionMonths)).toISOString();

    if (!enrollment.extensions) {
      enrollment.extensions = [];
    }
    enrollment.extensions.push(extension);
    this.saveEnrollments();
    return true;
  }

  getEnrollmentProgress(enrollment: StudentMentoringEnrollment): EnrollmentProgress {
    const startDate = new Date(enrollment.startDate);
    const endDate = new Date(enrollment.endDate);
    const today = new Date();
    const totalSessions = enrollment.totalSessions;
    const sessionsUsed = enrollment.sessionsUsed;
    const completedSessions = this.sessions.filter(s => s.enrollmentId === enrollment.id && s.status === 'realizada').length;
    const scheduledSessions = this.sessions.filter(s => s.enrollmentId === enrollment.id && s.status === 'agendada').length;
    const pendingSessions = totalSessions - completedSessions - scheduledSessions;
  
    const timeDiff = endDate.getTime() - startDate.getTime();
    const daysTotal = Math.ceil(timeDiff / (1000 * 3600 * 24));
    const daysRemaining = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    const percentage = (sessionsUsed / totalSessions) * 100;
    const isExpired = today > endDate;
    const isCompleted = sessionsUsed >= totalSessions;
  
    return {
      completedSessions,
      sessionsUsed,
      totalSessions,
      pendingSessions,
      scheduledSessions,
      percentage,
      daysRemaining,
      isExpired,
      isCompleted
    };
  }

  // Session Operations
  getSessions(): MentoringSession[] {
    return this.sessions;
  }

  getEnrollmentSessions(enrollmentId: string): MentoringSession[] {
    return this.sessions.filter(session => session.enrollmentId === enrollmentId);
  }

  getSessionDetails(sessionId: string): MentoringSession | undefined {
    return this.sessions.find(session => session.id === sessionId);
  }

  getUpcomingSessions(studentId: string): MentoringSession[] {
    const today = new Date();
    return this.sessions.filter(session => {
      const enrollment = this.enrollments.find(e => e.id === session.enrollmentId && e.studentId === studentId);
      if (!enrollment) return false;
      return session.scheduledDate && new Date(session.scheduledDate) >= today;
    });
  }

  createSession(data: CreateSessionData): MentoringSession {
    const newSession: MentoringSession = {
      id: `session-${Date.now()}`,
      enrollmentId: data.enrollmentId,
      sessionNumber: this.getEnrollmentSessions(data.enrollmentId).length + 1,
      type: data.type,
      title: data.title,
      scheduledDate: data.scheduledDate,
      durationMinutes: data.durationMinutes,
      status: 'aguardando_agendamento',
      meetingLink: data.meetingLink,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.sessions.push(newSession);
    this.saveSessions();
    return newSession;
  }

  updateSession(sessionId: string, data: UpdateSessionData): boolean {
    const sessionIndex = this.sessions.findIndex(session => session.id === sessionId);
    if (sessionIndex === -1) return false;

    this.sessions[sessionIndex] = {
      ...this.sessions[sessionIndex],
      ...data,
      updatedAt: new Date().toISOString()
    };
    this.saveSessions();
    return true;
  }

  scheduleSession(sessionId: string, scheduledDate: string, meetingLink?: string): boolean {
    const sessionIndex = this.sessions.findIndex(session => session.id === sessionId);
    if (sessionIndex === -1) return false;

    this.sessions[sessionIndex] = {
      ...this.sessions[sessionIndex],
      scheduledDate: scheduledDate,
      meetingLink: meetingLink,
      status: 'agendada',
      updatedAt: new Date().toISOString()
    };
    this.saveSessions();
    return true;
  }

  // Material Operations
  getMaterials(): MentoringMaterial[] {
    return this.materials;
  }

  getEnrollmentMaterials(enrollmentId: string): MentoringMaterial[] {
    return this.materials.filter(material => material.enrollmentId === enrollmentId);
  }

  getSessionMaterials(sessionId: string): MentoringMaterial[] {
    return this.materials.filter(material => material.sessionId === sessionId);
  }
}
