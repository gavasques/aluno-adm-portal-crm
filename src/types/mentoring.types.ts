
export interface MentoringCatalog {
  id: string;
  name: string;
  type: 'Individual' | 'Grupo';
  instructor: string;
  durationWeeks: number;
  numberOfSessions: number;
  totalSessions: number;
  price: number;
  description: string;
  tags: string[];
  imageUrl?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MentoringExtension {
  id: string;
  enrollmentId: string;
  extensionMonths: number;
  appliedDate: string;
  notes?: string;
  adminId: string;
  createdAt: string;
}

export interface StudentMentoringEnrollment {
  id: string;
  studentId: string;
  mentoringId: string;
  mentoring: MentoringCatalog;
  status: 'ativa' | 'concluida' | 'cancelada' | 'pausada';
  enrollmentDate: string;
  startDate: string;
  endDate: string;
  originalEndDate?: string;
  sessionsUsed: number;
  totalSessions: number;
  responsibleMentor: string;
  paymentStatus: string;
  observations?: string;
  extensions?: MentoringExtension[];
  hasExtension?: boolean;
  createdAt: string;
  updatedAt: string;
  // Novo campo para agrupar inscrições
  groupId?: string;
}

export interface GroupEnrollment {
  id: string;
  groupName: string;
  mentoring: MentoringCatalog;
  status: 'ativa' | 'concluida' | 'cancelada' | 'pausada';
  responsibleMentor: string;
  startDate: string;
  endDate: string;
  totalSessions: number;
  participants: StudentMentoringEnrollment[];
  createdAt: string;
  updatedAt: string;
}

export interface MentoringSession {
  id: string;
  enrollmentId: string;
  enrollment?: StudentMentoringEnrollment;
  type: 'individual' | 'grupo';
  title: string;
  scheduledDate: string;
  durationMinutes: number;
  accessLink?: string;
  recordingLink?: string;
  status: 'agendada' | 'realizada' | 'cancelada' | 'reagendada' | 'ausente_aluno' | 'ausente_mentor';
  mentorNotes?: string;
  studentNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MentoringMaterial {
  id: string;
  sessionId?: string;
  enrollmentId?: string;
  session?: MentoringSession;
  enrollment?: StudentMentoringEnrollment;
  fileName: string;
  fileUrl: string;
  type: string;
  description?: string;
  storagePath?: string;
  fileType?: string;
  sizeMB?: number;
  uploaderId?: string;
  uploaderType?: 'admin' | 'mentor' | 'aluno';
  tags?: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface MentoringStats {
  totalEnrollments: number;
  activeEnrollments: number;
  completedSessions: number;
  upcomingSessions: number;
  totalMaterials: number;
  averageRating: number;
}

export interface CreateMentoringCatalogData {
  name: string;
  type: 'Individual' | 'Grupo';
  instructor: string;
  durationWeeks: number;
  numberOfSessions: number;
  price: number;
  description: string;
  active?: boolean;
}

export interface CreateSessionData {
  enrollmentId: string;
  type: 'individual' | 'grupo';
  title: string;
  scheduledDate: string;
  durationMinutes: number;
  accessLink?: string;
}

export interface UpdateSessionData extends Partial<CreateSessionData> {
  status?: 'agendada' | 'realizada' | 'cancelada' | 'reagendada' | 'ausente_aluno' | 'ausente_mentor';
  mentorNotes?: string;
  studentNotes?: string;
  recordingLink?: string;
}

export interface CreateExtensionData {
  enrollmentId: string;
  extensionMonths: number;
  notes?: string;
}
